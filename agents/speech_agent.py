import os
import wave
from faster_whisper import WhisperModel
from google import genai
import config

class SpeechAgent:
    def __init__(self, model_size="small"):
        """
        Initialize the Speech Agent.
        Uses Gemini Multimodal Audio API for direct audio-to-text decoding,
        with faster-whisper (small/base model) as a high-accuracy local fallback.
        """
        self.model_size = model_size
        self._whisper_model = None
        print(f"[SpeechAgent] Initialized with model configuration size: '{model_size}'")
        
        # Initialize Gemini Client if API key is present
        self.gemini_client = None
        if config.GEMINI_API_KEY and config.GEMINI_API_KEY != "your_gemini_api_key_here":
            print("[SpeechAgent] Gemini API Key found. Initializing Gemini Client for Audio STT & refinement...")
            self.gemini_client = genai.Client(api_key=config.GEMINI_API_KEY)
        else:
            print("[SpeechAgent] Warning: Gemini API Key not set.")

    @property
    def whisper_model(self):
        """
        Lazy-load Whisper model on demand.
        """
        if self._whisper_model is None:
            print(f"[SpeechAgent] Lazily loading Whisper model ({self.model_size})...")
            self._whisper_model = WhisperModel(self.model_size, device="cpu", compute_type="float32")
        return self._whisper_model

    def speech_to_text(self, audio_path: str, language: str = "en") -> str:
        """
        Convert the audio file into a raw text transcript with fallback AI models & medical vocabulary hints.
        """
        print(f"[SpeechAgent] Transcribing audio file ({language} mode): {audio_path}...")
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        # 1. Try Gemini Multimodal Audio transcription with fallback model chain
        if self.gemini_client:
            target_model = getattr(config, "LLM_MODEL", "gemini-2.0-flash")
            fallback_models = ["gemini-2.0-flash", "gemma-4-26b-a4b-it", "gemini-1.5-flash"]
            models_to_try = []
            for m in [target_model] + fallback_models:
                if m not in models_to_try:
                    models_to_try.append(m)

            with open(audio_path, "rb") as f:
                audio_bytes = f.read()

            mime_type = "audio/webm"
            if audio_path.endswith(".wav"):
                mime_type = "audio/wav"
            elif audio_path.endswith(".mp3"):
                mime_type = "audio/mp3"

            stt_prompt = (
                "You are an expert clinical medical transcriptionist with universal multilingual capabilities.\n"
                "Listen to the doctor's consultation audio, which may be spoken in English, Hindi, Hinglish, or any regional mix.\n"
                "1. Automatically detect the spoken language.\n"
                "2. Transcribe the audio with extreme precision, accurately identifying medical brand names (e.g., Dolo 650, Combiflam, Pan 40, Azithromycin, Augmentin, Amoxicillin, Cetirizine, Paracetamol, Telma 40, Metformin).\n"
                "3. Normalize any spoken Hindi/vernacular clinical terms into standard medical English terminology "
                "(e.g., 'bukhar' -> 'fever', 'sar dard' -> 'headache', 'subah-shaam' -> 'Twice Daily (1-0-1)', 'khana khane ke baad' -> 'After Meals', 'khali pet' -> 'Before Food').\n"
                "Output ONLY the clear transcript text with proper medical terms and punctuation."
            )

            for model_name in models_to_try:
                try:
                    print(f"[SpeechAgent] Attempting Gemini Audio STT with model '{model_name}'...")
                    response = self.gemini_client.models.generate_content(
                        model=model_name,
                        contents=[
                            genai.types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                            stt_prompt
                        ]
                    )

                    transcript_text = response.text.strip() if response and response.text else ""
                    if transcript_text:
                        print(f"[SpeechAgent] Gemini Audio STT Success via '{model_name}': '{transcript_text[:100]}...'")
                        return transcript_text
                except Exception as e:
                    print(f"[SpeechAgent] Model '{model_name}' STT warning: {e}. Trying next fallback...")

        # 2. High-accuracy local Whisper fallback with medical initial prompt
        try:
            whisper_lang = "hi" if language in ["hi", "hinglish"] else "en"
            medical_vocab_prompt = (
                "Doctor consultation prescription transcript: Dolo 650mg, Pan 40, Combiflam, Azithromycin 500mg, "
                "Augmentin 625mg, Amoxicillin, Cetirizine 10mg, Paracetamol, PCM, BD, TDS, HS, OD, QID, "
                "Twice Daily, Once Daily, After Meals, Before Food, Empty Stomach, Fever, Headache, Cough."
            )
            segments, info = self.whisper_model.transcribe(
                audio_path,
                beam_size=5,
                language=whisper_lang,
                initial_prompt=medical_vocab_prompt
            )
            raw_transcript = " ".join([segment.text for segment in segments]).strip()
            print(f"[SpeechAgent] Whisper transcript ({whisper_lang}): '{raw_transcript}'")
            return raw_transcript
        except Exception as e:
            print(f"[SpeechAgent] Whisper transcription error: {e}")
            return ""

    def refine_transcript(self, raw_transcript: str, language: str = "en") -> str:
        """
        Use Gemini model chain to refine punctuation, correct spelling of medical terms, and translate Hinglish/Hindi clinical phrases.
        """
        if not raw_transcript or not raw_transcript.strip():
            return ""
            
        if not self.gemini_client:
            return raw_transcript

        print(f"[SpeechAgent] Refining transcript using Gemini (Language: {language})...")
        prompt = (
            "You are an expert clinical medical speech transcription assistant specializing in Indian clinical consultations.\n"
            "The following text is a doctor's consultation transcript spoken in English, Hindi, or Hinglish.\n"
            "Your job is to:\n"
            "1. Clean up medical drug names (e.g. Dolo 650, Combiflam, Pan 40, Azithromycin, Augmentin, Amoxicillin, Telma 40, Pantocid).\n"
            "2. Translate spoken Hindi symptoms and dosage instructions into standard clinical English terms "
            "(e.g., '3 din se bukhar' -> 'fever for 3 days', 'subah shaam' -> 'Twice Daily (1-0-1)', 'khana khane ke baad' -> 'After Meals', 'khali pet' -> 'Before Food').\n"
            "3. Insert proper punctuation and casing.\n"
            "Do NOT alter prescribed dosages or medicine names. Output ONLY the refined clinical transcript text.\n\n"
            f"Raw Transcript:\n{raw_transcript}"
        )

        target_model = getattr(config, "LLM_MODEL", "gemini-2.0-flash")
        fallback_models = ["gemini-2.0-flash", "gemma-4-26b-a4b-it", "gemini-1.5-flash"]
        models_to_try = []
        for m in [target_model] + fallback_models:
            if m not in models_to_try:
                models_to_try.append(m)

        for model_name in models_to_try:
            try:
                response = self.gemini_client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                refined = response.text.strip() if response and response.text else ""
                if refined:
                    return refined
            except Exception as err:
                print(f"[SpeechAgent] Model '{model_name}' transcript refinement warning: {err}")

        return raw_transcript
