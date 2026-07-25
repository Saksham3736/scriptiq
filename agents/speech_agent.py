import os
import wave
from faster_whisper import WhisperModel
from google import genai
import config

class SpeechAgent:
    def __init__(self, model_size="tiny"):
        """
        Initialize the Speech Agent.
        Uses Gemini Multimodal Audio API for direct audio-to-text decoding,
        with faster-whisper as a local fallback.
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

    def speech_to_text(self, audio_path: str) -> str:
        """
        Convert the audio file into a raw text transcript.
        Tries Gemini Multimodal Audio first (works on any OS without ffmpeg),
        falling back to local faster-whisper.
        """
        print(f"[SpeechAgent] Transcribing audio file: {audio_path}...")
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        # 1. Try Gemini Multimodal Audio transcription
        if self.gemini_client:
            try:
                print("[SpeechAgent] Transcribing via Gemini Multimodal Audio API...")
                with open(audio_path, "rb") as f:
                    audio_bytes = f.read()

                mime_type = "audio/webm"
                if audio_path.endswith(".wav"):
                    mime_type = "audio/wav"
                elif audio_path.endswith(".mp3"):
                    mime_type = "audio/mp3"

                target_model = getattr(config, "LLM_MODEL", "gemini-2.5-flash")

                response = self.gemini_client.models.generate_content(
                    model=target_model,
                    contents=[
                        genai.types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                        "You are an expert clinical medical transcriptionist. Transcribe this doctor consultation audio accurately into English text. Include patient name, symptoms, diagnosis, prescribed medicines with strength, dosage, frequency, and duration. Output ONLY the raw transcript text with proper punctuation."
                    ]
                )

                transcript_text = response.text.strip() if response and response.text else ""
                if transcript_text:
                    print(f"[SpeechAgent] Gemini Audio Transcript Success: '{transcript_text[:100]}...'")
                    return transcript_text
            except Exception as e:
                print(f"[SpeechAgent] Gemini Audio STT warning: {e}. Trying Whisper fallback...")

        # 2. Fallback to faster-whisper
        try:
            segments, info = self.whisper_model.transcribe(audio_path, beam_size=5)
            raw_transcript = " ".join([segment.text for segment in segments]).strip()
            print(f"[SpeechAgent] Whisper transcript: '{raw_transcript}'")
            return raw_transcript
        except Exception as e:
            print(f"[SpeechAgent] Whisper transcription error: {e}")
            return ""

    def refine_transcript(self, raw_transcript: str) -> str:
        """
        Use Gemini to refine punctuation and correct spelling of medical terms.
        """
        if not raw_transcript or not raw_transcript.strip():
            return ""
            
        if not self.gemini_client:
            return raw_transcript

        print("[SpeechAgent] Refining transcript using Gemini...")
        prompt = (
            "You are a medical speech transcription assistant. The following text is a transcript of a doctor speaking. "
            "Your job is to clean up spelling (especially Indian medical names and drug brands like Combiflam, Pan 40, Dolo 650), "
            "insert proper punctuation and casing, and format numbers clearly. "
            "Do NOT add any new medical information. Output ONLY the cleaned transcript text.\n\n"
            f"Raw Transcript:\n{raw_transcript}"
        )

        target_model = getattr(config, "LLM_MODEL", "gemini-2.5-flash")
        try:
            response = self.gemini_client.models.generate_content(
                model=target_model,
                contents=prompt
            )
            return response.text.strip() if response and response.text else raw_transcript
        except Exception as err:
            print(f"[SpeechAgent] Transcript refinement error: {err}")
            return raw_transcript
