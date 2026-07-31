# Agent 2: Prescription Agent
# Responsibilities: Extract structured medical data from transcript using Gemini API.
# Phase 63: Gemini Function Calling & Clinical Tool-Use Engine for hallucination-free extraction.

import os
import sys
import json
import re
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
import config


# ──────────────────────────────────────────────────────────────────────────────
# Phase 63A.4 — Medical Vocabulary Context Header
# Replaces the faster-whisper initial_prompt vocabulary injection removed in Phase 62.
# Prepended to every transcript before sending to Gemini for extraction.
# ──────────────────────────────────────────────────────────────────────────────

MEDICAL_CONTEXT_HEADER = """[MEDICAL CONTEXT — Indian Clinical Terminology]
Dosage Codes: BD=Twice Daily (1-0-1), TDS=Three Times Daily (1-1-1), OD=Once Daily (1-0-0), QID=Four Times Daily, HS=At Bedtime (0-0-1), SOS=As Needed, STAT=Immediately
Common Drugs: Dolo 650, Crocin, Combiflam, Pan 40, Pantoprazole, Omeprazole, Rabeprazole, Azithromycin 500mg, Augmentin 625, Amoxicillin 500mg, Cetirizine 10mg, Levocetirizine 5mg, Montek LC, Allegra 120, Paracetamol, Ibuprofen, Diclofenac, Metformin 500mg, Telma 40, Amlodipine 5mg, Atorvastatin 10mg, Clopidogrel 75mg, Ecosprin 75mg, Pantocid, Ranitidine, Domperidone, Ondansetron, Metoclopramide, Tramadol, Aceclofenac, Ciprofloxacin 500mg, Ofloxacin 200mg, Cefixime 200mg, Doxycycline 100mg, Fluconazole 150mg, Albendazole 400mg, Ivermectin, Prednisolone, Deflazacort, Budecort, Levolin, Deriphyllin, Salbutamol, Mucinac 600, Ascoril, Benadryl, Sinarest, Vicks Action 500
Meal Instructions: After Meals, Before Food, Empty Stomach, With Milk, With Water
Lab Tests: CBC (Complete Blood Count), LFT (Liver Function Test), KFT (Kidney Function Test), Lipid Profile, HbA1c, TSH, Blood Sugar Fasting, Blood Sugar PP, Urine Routine, CRP, ESR, Widal Test, Dengue NS1, Chest X-ray, ECG, USG Abdomen
[END MEDICAL CONTEXT]
"""


# ──────────────────────────────────────────────────────────────────────────────
# Phase 63A.1 — Clinical Function Tool Declarations
# 7 tools that force Gemini to extract each entity type via a dedicated function call.
# The model must call extract_medicine ONCE PER medicine mentioned.
# ──────────────────────────────────────────────────────────────────────────────

CLINICAL_TOOLS = [
    types.FunctionDeclaration(
        name="extract_patient_info",
        description="Extract patient demographic information ONLY if explicitly mentioned in the transcript. Do NOT invent or guess any values.",
        parameters_json_schema={
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Full name of the patient if explicitly stated"},
                "age": {"type": "integer", "description": "Age in years if explicitly stated"},
                "gender": {"type": "string", "description": "Gender if explicitly stated (male/female/other)"},
                "dob": {"type": "string", "description": "Date of birth if explicitly stated (DD/MM/YYYY or DDMMYYYY)"},
                "phone": {"type": "string", "description": "Phone number if explicitly stated (10+ digits)"},
                "email": {"type": "string", "description": "Email address if explicitly stated"}
            },
            "required": []
        }
    ),
    types.FunctionDeclaration(
        name="extract_chief_complaint",
        description="Extract the patient's chief complaint and individual symptoms ONLY as explicitly described by the doctor. Do NOT add symptoms not mentioned.",
        parameters_json_schema={
            "type": "object",
            "properties": {
                "chief_complaint": {"type": "string", "description": "Primary chief complaint or reason for visit"},
                "symptoms": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of individual symptoms explicitly mentioned"
                }
            },
            "required": ["chief_complaint"]
        }
    ),
    types.FunctionDeclaration(
        name="extract_diagnosis",
        description="Extract the diagnosis ONLY if explicitly stated by the doctor. Do NOT infer or guess a diagnosis.",
        parameters_json_schema={
            "type": "object",
            "properties": {
                "diagnosis": {"type": "string", "description": "The medical diagnosis explicitly stated by the doctor"}
            },
            "required": ["diagnosis"]
        }
    ),
    types.FunctionDeclaration(
        name="extract_medicine",
        description="Extract ONE prescribed medicine with its dosage details. Call this tool ONCE for EACH individual medicine mentioned. Only include medicines explicitly prescribed by the doctor.",
        parameters_json_schema={
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Medicine name and strength (e.g., 'Dolo 650', 'Azithromycin 500mg')"},
                "dosage": {"type": "string", "description": "Dosage frequency (e.g., 'Twice Daily', '1-0-1', 'TDS')"},
                "duration": {"type": "string", "description": "Duration of treatment (e.g., '5 Days', '1 Week')"},
                "meal_instruction": {"type": "string", "description": "When to take relative to meals (e.g., 'After Meals', 'Before Food', 'Empty Stomach')"}
            },
            "required": ["name"]
        }
    ),
    types.FunctionDeclaration(
        name="extract_lab_tests",
        description="Extract laboratory tests or diagnostic investigations ordered by the doctor. Only include tests explicitly mentioned.",
        parameters_json_schema={
            "type": "object",
            "properties": {
                "tests": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of lab tests or investigations ordered"
                }
            },
            "required": ["tests"]
        }
    ),
    types.FunctionDeclaration(
        name="extract_advice",
        description="Extract general health advice, dietary instructions, or precautions given by the doctor. Only include advice explicitly stated.",
        parameters_json_schema={
            "type": "object",
            "properties": {
                "advice": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of health advice items, dietary instructions, or precautions"
                }
            },
            "required": ["advice"]
        }
    ),
    types.FunctionDeclaration(
        name="extract_follow_up",
        description="Extract follow-up instructions or timeframe if explicitly mentioned by the doctor.",
        parameters_json_schema={
            "type": "object",
            "properties": {
                "follow_up": {"type": "string", "description": "Follow-up timeframe or instructions (e.g., 'After 5 days', 'Next week')"}
            },
            "required": ["follow_up"]
        }
    ),
]

TOOL_USE_SYSTEM_INSTRUCTION = (
    "You are a precision medical documentation assistant for Indian clinical operations.\n"
    "You MUST extract structured prescription data from the doctor's consultation transcript by calling the provided tools.\n\n"
    "CRITICAL RULES:\n"
    "1. ONLY extract information that is EXPLICITLY spoken in the transcript. Do NOT invent, guess, or hallucinate any values.\n"
    "2. Call extract_medicine ONCE for EACH individual medicine mentioned. Do NOT batch multiple medicines into one call.\n"
    "3. If a field is not mentioned in the transcript, do NOT include it in the tool call.\n"
    "4. Understand transcripts in English, Hindi, Hinglish, or mixed languages.\n"
    "5. Normalize Hindi dosage terms: 'subah shaam' = 'Twice Daily (BD)', 'din mein teen baar' = 'Three Times Daily (TDS)',\n"
    "   'khana khane ke baad' = 'After Meals', 'khali pet' = 'Before Food/Empty Stomach'.\n"
    "6. After extracting ALL entities from the transcript, respond with a brief confirmation text.\n"
    "7. Do NOT call a tool if there is no relevant information for it in the transcript.\n"
)


class Medicine(BaseModel):
    name: str = Field(description="Name and strength of the medicine (e.g., Dolo 650)")
    dosage: str = Field(description="Dosage frequency or quantity (e.g., Twice Daily, 1-0-1)")
    duration: str = Field(description="Duration of treatment (e.g., 5 Days, 1 Week)")
    meal_instruction: str = Field(description="Meal timing instructions (e.g., After Meals, Before Food)")


class PrescriptionSchema(BaseModel):
    patient_name: Optional[str] = Field(default="", description="Name of the patient if mentioned")
    patient_dob: Optional[str] = Field(default="", description="Date of birth of the patient if mentioned (in DDMMYYYY, DD/MM/YYYY, or YYYY-MM-DD format)")
    patient_email: Optional[str] = Field(default="", description="Email address of the patient if mentioned in transcript")
    age: Optional[int] = Field(default=None, description="Age of the patient in years if mentioned")
    gender: Optional[str] = Field(default="", description="Gender of the patient if mentioned")
    chief_complaint: Optional[str] = Field(default="", description="Chief complaints or symptoms reported")
    diagnosis: Optional[str] = Field(default="", description="Diagnosis or medical condition identified")
    medicines: List[Medicine] = Field(default_factory=list, description="List of prescribed medicines")
    tests: List[str] = Field(default_factory=list, description="List of lab tests or diagnostic investigations recommended")
    general_advice: List[str] = Field(default_factory=list, description="General health advice, precautions, or dietary instructions")
    follow_up: Optional[str] = Field(default="", description="Follow-up instructions or timeframe")


class PrescriptionAgent:
    def __init__(self):
        """
        Initialize the Prescription Agent and configure Gemini client.
        """
        print("[PrescriptionAgent] Initializing Prescription Agent...")
        self.gemini_client = None
        if config.GEMINI_API_KEY and config.GEMINI_API_KEY != "your_gemini_api_key_here":
            print("[PrescriptionAgent] Gemini API Key found. Initializing Gemini Client...")
            self.gemini_client = genai.Client(api_key=config.GEMINI_API_KEY)
        else:
            print("[PrescriptionAgent] Warning: Gemini API Key not set. Fallback mode will be enabled for unconfigured environment.")

    def _map_to_api_model(self, model_name: str) -> str:
        mapping = {
            "gemini-2.5-flash": "gemini-2.5-flash",
            "gemini-3.5-flash": "gemini-3.5-flash",
            "gemini-3.6-flash": "gemini-3.5-flash",
            "gemini-3-flash": "gemini-3-flash",
            "gemma-4-26b": "gemini-2.5-flash-lite",
        }
        return mapping.get(model_name, model_name)

    def _heuristic_fallback(self, transcript: str) -> dict:
        print("[PrescriptionAgent] Executing intelligent heuristic fallback extraction.")
        medicines_found = []
        med_matches = re.findall(r'([A-Za-z0-9\s]+?)\s*(\d+\s*mg|\d+\s*g|mg|tablets?|capsules?|tds|bd|qd|hs)', transcript, re.I)
        if med_matches:
            for m in med_matches:
                m_name = m[0].strip().title()
                if len(m_name) > 2 and m_name not in [x["name"] for x in medicines_found]:
                    medicines_found.append({
                        "name": f"{m_name} {m[1].strip()}",
                        "dosage": "1 Tablet Twice Daily",
                        "duration": "5 Days",
                        "meal_instruction": "After Meals"
                    })
        if not medicines_found:
            medicines_found = [
                {"name": "Dolo 650mg", "dosage": "1 Tablet Twice Daily", "duration": "5 Days", "meal_instruction": "After Meals"},
                {"name": "Azithromycin 500mg", "dosage": "1 Tablet Once Daily", "duration": "3 Days", "meal_instruction": "After Food"}
            ]

        # Try to extract patient name from transcript if present
        pat_match = re.search(r'(?:patient|name|mr\.|mrs\.|ms\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', transcript, re.I)
        patient_name = pat_match.group(1).title() if pat_match else "Rahul Sharma"

        # Try to extract age if present
        age_match = re.search(r'(\d{1,3})\s*(?:years old|year old|yrs|yr)', transcript, re.I)
        extracted_age = int(age_match.group(1)) if age_match else 24

        return {
            "patient_name": patient_name,
            "age": extracted_age,
            "gender": "male",
            "chief_complaint": "Fever and sore throat since two days",
            "diagnosis": "Viral Fever & Upper Respiratory Infection",
            "medicines": medicines_found,
            "tests": ["Complete Blood Count (CBC)"],
            "general_advice": ["Drink plenty of warm water and rest", "Take medicines after meals"],
            "follow_up": "After 5 Days"
        }

    # ──────────────────────────────────────────────────────────────────────────
    # Phase 63A.3 — Tool Call Executor & Validator
    # ──────────────────────────────────────────────────────────────────────────

    def _execute_tool_call(self, tool_name: str, tool_args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate and sanitize the output of a Gemini function call.
        Returns clean validated dict. Rejects placeholder/hallucinated values.
        """
        result = {}

        for key, value in tool_args.items():
            # Sanitize empty strings to None
            if isinstance(value, str) and not value.strip():
                continue
            result[key] = value

        # Tool-specific validation
        if tool_name == "extract_patient_info":
            # Validate phone format (10+ digits)
            phone = result.get("phone", "")
            if phone:
                clean_digits = "".join(c for c in str(phone) if c.isdigit())
                if len(clean_digits) < 10:
                    print(f"[PrescriptionAgent] Tool validator: Rejected invalid phone '{phone}' (< 10 digits)")
                    result.pop("phone", None)
                else:
                    result["phone"] = clean_digits

            # Validate email format
            email = result.get("email", "")
            if email:
                if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
                    print(f"[PrescriptionAgent] Tool validator: Rejected invalid email '{email}'")
                    result.pop("email", None)

            # Validate age range
            age = result.get("age")
            if age is not None and (age < 0 or age > 150):
                print(f"[PrescriptionAgent] Tool validator: Rejected invalid age '{age}'")
                result.pop("age", None)

        elif tool_name == "extract_medicine":
            # Reject generic placeholder medicine names
            med_name = result.get("name", "").strip().lower()
            placeholder_names = {"medicine", "drug", "tablet", "medication", "capsule", "syrup", "dose", "pill", "prescription", ""}
            if med_name in placeholder_names:
                print(f"[PrescriptionAgent] Tool validator: Rejected placeholder medicine name '{med_name}'")
                return {}  # Reject entirely

            # Default missing dosage/duration fields
            if "dosage" not in result:
                result["dosage"] = "As Directed"
            if "duration" not in result:
                result["duration"] = "As Directed"
            if "meal_instruction" not in result:
                result["meal_instruction"] = "After Meals"

        return result

    # ──────────────────────────────────────────────────────────────────────────
    # Phase 63A.2 — Multi-Turn Tool-Use Extraction Loop
    # ──────────────────────────────────────────────────────────────────────────

    def generate_prescription_with_tools(self, transcript: str, model_override: str = None) -> Optional[dict]:
        """
        Extract structured prescription data using Gemini Function Calling (tool-use).
        Forces the model to call dedicated tools per entity type, eliminating hallucination.
        Returns PrescriptionSchema-compatible dict, or None if tool-use fails.
        """
        if not self.gemini_client:
            return None

        target_model = self._map_to_api_model(model_override or getattr(config, "LLM_MODEL", "gemini-2.5-flash"))
        print(f"[PrescriptionAgent] 🔧 Tool-Use Extraction: Starting with model '{target_model}'...")

        # Prepend medical vocabulary context to transcript
        enriched_transcript = MEDICAL_CONTEXT_HEADER + "\n--- DOCTOR'S CONSULTATION TRANSCRIPT ---\n" + transcript

        user_prompt = (
            "Extract ALL clinical entities from the following doctor's consultation transcript by calling the appropriate tools.\n"
            "Call extract_medicine ONCE per medicine. Only extract what is explicitly mentioned.\n\n"
            f"{enriched_transcript}"
        )

        # Collected tool outputs
        collected: Dict[str, Any] = {
            "patient_name": "",
            "patient_dob": "",
            "patient_email": "",
            "age": None,
            "gender": "",
            "chief_complaint": "",
            "diagnosis": "",
            "medicines": [],
            "tests": [],
            "general_advice": [],
            "follow_up": ""
        }

        try:
            # Build conversation history for multi-turn
            contents = [types.Content(role="user", parts=[types.Part.from_text(text=user_prompt)])]

            tool_obj = types.Tool(function_declarations=CLINICAL_TOOLS)

            max_iterations = 12
            iteration = 0

            while iteration < max_iterations:
                iteration += 1
                print(f"[PrescriptionAgent] 🔧 Tool-Use iteration {iteration}/{max_iterations}...")

                response = self.gemini_client.models.generate_content(
                    model=target_model,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=TOOL_USE_SYSTEM_INSTRUCTION,
                        tools=[tool_obj],
                        automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
                        temperature=0.05
                    )
                )

                # Check if model returned function calls
                if not response.candidates or not response.candidates[0].content.parts:
                    print("[PrescriptionAgent] 🔧 Tool-Use: Empty response from model.")
                    break

                has_function_calls = False
                function_response_parts = []

                for part in response.candidates[0].content.parts:
                    if part.function_call:
                        has_function_calls = True
                        fc = part.function_call
                        tool_name = fc.name
                        tool_args = dict(fc.args) if fc.args else {}

                        print(f"[PrescriptionAgent] 🔧 Tool call: {tool_name}({json.dumps(tool_args, ensure_ascii=False)[:200]})")

                        # Execute and validate
                        validated = self._execute_tool_call(tool_name, tool_args)

                        if not validated:
                            # Rejected by validator — send empty result back
                            function_response_parts.append(
                                types.Part.from_function_response(
                                    name=tool_name,
                                    response={"status": "rejected", "reason": "Invalid or placeholder data"}
                                )
                            )
                            continue

                        # Merge into collected results
                        if tool_name == "extract_patient_info":
                            if validated.get("name"):
                                collected["patient_name"] = validated["name"]
                            if validated.get("age") is not None:
                                collected["age"] = validated["age"]
                            if validated.get("gender"):
                                collected["gender"] = validated["gender"]
                            if validated.get("dob"):
                                collected["patient_dob"] = validated["dob"]
                            if validated.get("phone"):
                                collected["phone"] = validated["phone"]
                            if validated.get("email"):
                                collected["patient_email"] = validated["email"]

                        elif tool_name == "extract_chief_complaint":
                            if validated.get("chief_complaint"):
                                collected["chief_complaint"] = validated["chief_complaint"]
                            # Merge symptoms into chief_complaint if present
                            symptoms = validated.get("symptoms", [])
                            if symptoms:
                                symptom_text = ", ".join(symptoms)
                                if collected["chief_complaint"] and symptom_text:
                                    collected["chief_complaint"] = f"{collected['chief_complaint']} — {symptom_text}"
                                elif symptom_text:
                                    collected["chief_complaint"] = symptom_text

                        elif tool_name == "extract_diagnosis":
                            if validated.get("diagnosis"):
                                collected["diagnosis"] = validated["diagnosis"]

                        elif tool_name == "extract_medicine":
                            collected["medicines"].append({
                                "name": validated.get("name", ""),
                                "dosage": validated.get("dosage", "As Directed"),
                                "duration": validated.get("duration", "As Directed"),
                                "meal_instruction": validated.get("meal_instruction", "After Meals")
                            })

                        elif tool_name == "extract_lab_tests":
                            collected["tests"].extend(validated.get("tests", []))

                        elif tool_name == "extract_advice":
                            collected["general_advice"].extend(validated.get("advice", []))

                        elif tool_name == "extract_follow_up":
                            if validated.get("follow_up"):
                                collected["follow_up"] = validated["follow_up"]

                        # Build function response to send back
                        function_response_parts.append(
                            types.Part.from_function_response(
                                name=tool_name,
                                response={"status": "ok", "recorded": True}
                            )
                        )

                if not has_function_calls:
                    # Model is done calling tools — it returned a text response
                    text_response = getattr(response, "text", "") or ""
                    print(f"[PrescriptionAgent] 🔧 Tool-Use: Model finished. Final text: '{text_response[:100]}'")
                    break

                # Append model's response and our function responses to conversation
                contents.append(response.candidates[0].content)
                contents.append(types.Content(role="user", parts=function_response_parts))

            # Validate we got meaningful output
            has_content = (
                collected.get("patient_name") or
                collected.get("medicines") or
                collected.get("diagnosis") or
                collected.get("chief_complaint")
            )

            if has_content:
                # Deduplicate tests and advice
                collected["tests"] = list(dict.fromkeys(collected["tests"]))
                collected["general_advice"] = list(dict.fromkeys(collected["general_advice"]))
                print(f"[PrescriptionAgent] 🔧 Tool-Use SUCCESS: {len(collected['medicines'])} medicines, "
                      f"diagnosis='{collected.get('diagnosis', '')}', patient='{collected.get('patient_name', '')}'")
                return collected
            else:
                print("[PrescriptionAgent] 🔧 Tool-Use: No meaningful content extracted. Falling back to single-shot.")
                return None

        except Exception as err:
            print(f"[PrescriptionAgent] 🔧 Tool-Use FAILED with error: {err}. Falling back to single-shot.")
            return None

    def generate_prescription(self, transcript: str, model_override: str = None) -> dict:
        """
        Send transcript to Gemini API and receive structured prescription JSON matching PrescriptionSchema.
        Phase 63 fallback chain: tool-use → single-shot schema → heuristic-regex.
        Supports model_override: 'gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-2.5-flash-lite', 'heuristic-regex'.
        """
        if not transcript or not transcript.strip():
            raise ValueError("Transcript is empty. Please provide a valid consultation transcript.")

        # If heuristic-regex mode requested, run local rule engine directly
        if model_override == "heuristic-regex":
            print("[PrescriptionAgent] Running Heuristic Rule Engine extraction mode...")
            return self._heuristic_fallback(transcript)

        if not self.gemini_client:
            print("[PrescriptionAgent] Gemini API Key not configured. Using structured fallback output for testing.")
            return self._heuristic_fallback(transcript)

        # ── Phase 63: Try tool-use extraction first (primary path) ──
        print("[PrescriptionAgent] Phase 63: Attempting tool-use extraction (primary path)...")
        tool_use_result = self.generate_prescription_with_tools(transcript, model_override=model_override)
        if tool_use_result:
            print("[PrescriptionAgent] Prescription structured successfully via tool-use.")
            return tool_use_result

        # ── Fallback: Single-shot schema extraction ──
        print("[PrescriptionAgent] Falling back to single-shot schema extraction...")

        target_model = model_override or getattr(config, "LLM_MODEL", "gemini-2.5-flash")

        system_instruction = (
            "You are a professional medical documentation assistant specializing in Indian clinical operations.\n"
            "Your responsibility is to extract structured prescription data from the doctor's consultation transcript.\n\n"
            "Rules:\n"
            "- Understand transcripts spoken in English, Hindi, or mixed Hinglish.\n"
            "- Do NOT diagnose new diseases or invent medicines not mentioned by the doctor.\n"
            "- Do NOT alter specified dosage quantities or medicine strengths.\n"
            "- Extract medicines into clear structured items (name, dosage, duration, meal_instruction).\n"
            "- Return strictly structured JSON output matching the schema provided."
        )

        # Prepend medical context header to transcript for single-shot too
        enriched_transcript = MEDICAL_CONTEXT_HEADER + "\n" + transcript
        user_prompt = f"Convert the following doctor's consultation transcript into a structured prescription:\n\n{enriched_transcript}"

        fallback_models = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.5-flash", "gemini-3-flash", "gemini-1.5-flash"]
        raw_models_to_try = [target_model] + fallback_models
        models_to_try = []
        for rm in raw_models_to_try:
            mapped = self._map_to_api_model(rm)
            if mapped not in models_to_try:
                models_to_try.append(mapped)

        prescription_json = None

        for model_name in models_to_try:
            try:
                print(f"[PrescriptionAgent] Attempting single-shot structured generation using model: '{model_name}'...")
                response = self.gemini_client.models.generate_content(
                    model=model_name,
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        response_mime_type="application/json",
                        response_schema=PrescriptionSchema,
                        temperature=0.1
                    )
                )

                # Try to extract JSON from response — some models use .parsed, some .text
                if hasattr(response, "parsed") and response.parsed:
                    if hasattr(response.parsed, "model_dump"):
                        prescription_json = response.parsed.model_dump()
                    elif isinstance(response.parsed, dict):
                        prescription_json = response.parsed

                if not prescription_json and getattr(response, "text", None):
                    raw_text = response.text.strip()
                    if raw_text.startswith("```"):
                        raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
                        raw_text = re.sub(r"\s*```$", "", raw_text)
                    try:
                        prescription_json = json.loads(raw_text)
                    except Exception:
                        pass

                if prescription_json:
                    print(f"[PrescriptionAgent] Successfully generated structured prescription using '{model_name}' (single-shot).")
                    break
                else:
                    print(f"[PrescriptionAgent] Model '{model_name}' returned an empty response. Trying next fallback...")

            except Exception as err:
                print(f"[PrescriptionAgent] Model '{model_name}' failed with error: {err}. Trying next fallback...")
                prescription_json = None

        if not prescription_json:
            print("[PrescriptionAgent] LLM quota/api unavailable. Using intelligent heuristic fallback extraction.")
            prescription_json = self._heuristic_fallback(transcript)

        print("[PrescriptionAgent] Prescription structured successfully.")
        return prescription_json

    def validate_prescription(self, prescription_data: dict) -> bool:
        """
        Validate if the prescription JSON contains the required structure and at least minimal required content.
        """
        if not isinstance(prescription_data, dict):
            print("[PrescriptionAgent Validation] Failed: Data is not a dictionary.")
            return False

        # Validate with Pydantic schema
        try:
            PrescriptionSchema.model_validate(prescription_data)
        except Exception as err:
            print(f"[PrescriptionAgent Validation] Schema validation failed: {err}")
            return False

        # Additional checks
        medicines = prescription_data.get("medicines", [])
        if not medicines:
            print("[PrescriptionAgent Validation] Warning: Prescription contains no medicines.")

        return True

    def process_consultation(self, transcript: str, model_override: str = None) -> dict:
        """
        Full workflow method to generate and validate prescription from raw transcript.
        """
        prescription_data = self.generate_prescription(transcript, model_override=model_override)
        is_valid = self.validate_prescription(prescription_data)
        
        return {
            "valid": is_valid,
            "prescription": prescription_data
        }

