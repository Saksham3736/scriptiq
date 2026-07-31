"""
Phase 63: Gemini Function Calling & Clinical Tool-Use Engine — Test Suite
Tests the tool-use extraction pipeline, validator, and fallback chain.
"""
import os
import sys
import unittest
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from agents.prescription_agent import (
    PrescriptionAgent,
    MEDICAL_CONTEXT_HEADER,
    CLINICAL_TOOLS,
    TOOL_USE_SYSTEM_INSTRUCTION
)


class TestMedicalContextHeader(unittest.TestCase):
    """Test that MEDICAL_CONTEXT_HEADER contains essential vocabulary."""

    def test_header_contains_dosage_codes(self):
        self.assertIn("BD=Twice Daily", MEDICAL_CONTEXT_HEADER)
        self.assertIn("TDS=Three Times Daily", MEDICAL_CONTEXT_HEADER)
        self.assertIn("OD=Once Daily", MEDICAL_CONTEXT_HEADER)
        self.assertIn("HS=At Bedtime", MEDICAL_CONTEXT_HEADER)
        self.assertIn("SOS=As Needed", MEDICAL_CONTEXT_HEADER)

    def test_header_contains_common_drugs(self):
        self.assertIn("Dolo 650", MEDICAL_CONTEXT_HEADER)
        self.assertIn("Azithromycin 500mg", MEDICAL_CONTEXT_HEADER)
        self.assertIn("Pan 40", MEDICAL_CONTEXT_HEADER)
        self.assertIn("Augmentin 625", MEDICAL_CONTEXT_HEADER)
        self.assertIn("Combiflam", MEDICAL_CONTEXT_HEADER)
        self.assertIn("Cetirizine 10mg", MEDICAL_CONTEXT_HEADER)

    def test_header_contains_lab_tests(self):
        self.assertIn("CBC", MEDICAL_CONTEXT_HEADER)
        self.assertIn("LFT", MEDICAL_CONTEXT_HEADER)
        self.assertIn("HbA1c", MEDICAL_CONTEXT_HEADER)

    def test_header_contains_meal_instructions(self):
        self.assertIn("After Meals", MEDICAL_CONTEXT_HEADER)
        self.assertIn("Before Food", MEDICAL_CONTEXT_HEADER)
        self.assertIn("Empty Stomach", MEDICAL_CONTEXT_HEADER)


class TestClinicalTools(unittest.TestCase):
    """Test that CLINICAL_TOOLS declarations are properly formed."""

    def test_seven_tools_defined(self):
        self.assertEqual(len(CLINICAL_TOOLS), 7)

    def test_tool_names(self):
        tool_names = [t.name for t in CLINICAL_TOOLS]
        expected = [
            "extract_patient_info",
            "extract_chief_complaint",
            "extract_diagnosis",
            "extract_medicine",
            "extract_lab_tests",
            "extract_advice",
            "extract_follow_up"
        ]
        self.assertEqual(tool_names, expected)

    def test_extract_medicine_per_call_description(self):
        med_tool = [t for t in CLINICAL_TOOLS if t.name == "extract_medicine"][0]
        self.assertIn("ONE", med_tool.description)
        self.assertIn("EACH", med_tool.description)


class TestToolCallValidator(unittest.TestCase):
    """Test _execute_tool_call validation logic."""

    def setUp(self):
        self.agent = PrescriptionAgent()

    def test_valid_patient_info(self):
        result = self.agent._execute_tool_call("extract_patient_info", {
            "name": "Rahul Sharma",
            "age": 24,
            "gender": "male"
        })
        self.assertEqual(result["name"], "Rahul Sharma")
        self.assertEqual(result["age"], 24)
        self.assertEqual(result["gender"], "male")

    def test_empty_string_sanitization(self):
        result = self.agent._execute_tool_call("extract_patient_info", {
            "name": "Amit Kumar",
            "phone": "",
            "email": "   "
        })
        self.assertEqual(result["name"], "Amit Kumar")
        self.assertNotIn("phone", result)
        self.assertNotIn("email", result)

    def test_invalid_phone_rejected(self):
        result = self.agent._execute_tool_call("extract_patient_info", {
            "name": "Test",
            "phone": "12345"  # Too short
        })
        self.assertNotIn("phone", result)

    def test_valid_phone_cleaned(self):
        result = self.agent._execute_tool_call("extract_patient_info", {
            "phone": "+91 9888478606"
        })
        self.assertEqual(result["phone"], "919888478606")

    def test_invalid_email_rejected(self):
        result = self.agent._execute_tool_call("extract_patient_info", {
            "email": "not-an-email"
        })
        self.assertNotIn("email", result)

    def test_valid_email_accepted(self):
        result = self.agent._execute_tool_call("extract_patient_info", {
            "email": "patient@example.com"
        })
        self.assertEqual(result["email"], "patient@example.com")

    def test_invalid_age_rejected(self):
        result = self.agent._execute_tool_call("extract_patient_info", {
            "name": "Test",
            "age": 200
        })
        self.assertNotIn("age", result)

    def test_placeholder_medicine_rejected(self):
        result = self.agent._execute_tool_call("extract_medicine", {
            "name": "medicine",
            "dosage": "Twice Daily"
        })
        self.assertEqual(result, {})  # Completely rejected

    def test_placeholder_drug_rejected(self):
        result = self.agent._execute_tool_call("extract_medicine", {
            "name": "Tablet"
        })
        self.assertEqual(result, {})

    def test_valid_medicine_accepted(self):
        result = self.agent._execute_tool_call("extract_medicine", {
            "name": "Dolo 650",
            "dosage": "Twice Daily",
            "duration": "5 Days",
            "meal_instruction": "After Meals"
        })
        self.assertEqual(result["name"], "Dolo 650")
        self.assertEqual(result["dosage"], "Twice Daily")

    def test_medicine_defaults_missing_fields(self):
        result = self.agent._execute_tool_call("extract_medicine", {
            "name": "Azithromycin 500mg"
        })
        self.assertEqual(result["name"], "Azithromycin 500mg")
        self.assertEqual(result["dosage"], "As Directed")
        self.assertEqual(result["duration"], "As Directed")
        self.assertEqual(result["meal_instruction"], "After Meals")

    def test_diagnosis_passthrough(self):
        result = self.agent._execute_tool_call("extract_diagnosis", {
            "diagnosis": "Viral Fever"
        })
        self.assertEqual(result["diagnosis"], "Viral Fever")

    def test_advice_passthrough(self):
        result = self.agent._execute_tool_call("extract_advice", {
            "advice": ["Drink warm water", "Rest for 3 days"]
        })
        self.assertEqual(len(result["advice"]), 2)


class TestHeuristicFallback(unittest.TestCase):
    """Test that the heuristic fallback still works."""

    def setUp(self):
        self.agent = PrescriptionAgent()

    def test_heuristic_regex_mode(self):
        transcript = "Patient Name Rahul Sharma, age 24 years old. Prescribe Dolo 650 mg twice daily."
        result = self.agent.generate_prescription(transcript, model_override="heuristic-regex")
        self.assertIn("patient_name", result)
        self.assertIn("medicines", result)
        self.assertTrue(len(result["medicines"]) > 0)

    def test_process_consultation_returns_valid(self):
        transcript = "Patient Amit Patel. Fever. Dolo 650 mg BD. Follow up after 5 days."
        result = self.agent.process_consultation(transcript, model_override="heuristic-regex")
        self.assertIn("valid", result)
        self.assertIn("prescription", result)


class TestToolUseSystemInstruction(unittest.TestCase):
    """Test the tool-use system instruction content."""

    def test_instruction_emphasizes_no_hallucination(self):
        self.assertIn("ONLY extract information that is EXPLICITLY spoken", TOOL_USE_SYSTEM_INSTRUCTION)
        self.assertIn("Do NOT invent", TOOL_USE_SYSTEM_INSTRUCTION)

    def test_instruction_mentions_per_medicine_calls(self):
        self.assertIn("extract_medicine ONCE for EACH", TOOL_USE_SYSTEM_INSTRUCTION)

    def test_instruction_handles_hinglish(self):
        self.assertIn("Hindi", TOOL_USE_SYSTEM_INSTRUCTION)
        self.assertIn("Hinglish", TOOL_USE_SYSTEM_INSTRUCTION)
        self.assertIn("subah shaam", TOOL_USE_SYSTEM_INSTRUCTION)


if __name__ == "__main__":
    unittest.main()
