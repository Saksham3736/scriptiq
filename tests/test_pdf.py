import os
import sys
import json
import unittest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.pdf_agent import PDFAgent


class TestPDFAgent(unittest.TestCase):
    def setUp(self):
        self.agent = PDFAgent()

    def test_pdf_generation(self):
        sample_prescription = {
            "hospital_name": "MediCare Hospital",
            "doctor_name": "Dr. Arjun Sharma",
            "doctor_qualification": "MBBS, MD (General Medicine)",
            "doctor_specialization": "Senior Consultant Physician",
            "doctor_reg_no": "PMC/2026/123456",
            "hospital_address": "Civil Lines, Ludhiana, Punjab - 141001",
            "hospital_phone": "+91 98884 78606",
            "hospital_email": "dr.arjunsharma@medicarehospital.com",
            "patient_name": "Rahul Sharma",
            "patient_dob": "15/08/1998",
            "age": 24,
            "gender": "Male",
            "chief_complaint": "Fever and sore throat since 2 days",
            "diagnosis": "Viral Fever",
            "medicines": [
                {
                    "name": "Dolo 650",
                    "dosage": "Twice Daily",
                    "duration": "5 Days",
                    "meal_instruction": "After Meals"
                },
                {
                    "name": "Azithromycin 500",
                    "dosage": "Once Daily",
                    "duration": "3 Days",
                    "meal_instruction": "After Food"
                }
            ],
            "tests": ["Complete Blood Count (CBC)"],
            "general_advice": ["Drink plenty of warm water and rest"],
            "follow_up": "After 5 Days"
        }

        pdf_path = self.agent.generate_pdf(sample_prescription)
        self.assertTrue(os.path.exists(pdf_path))
        self.assertGreater(os.path.getsize(pdf_path), 0)

    def test_pdf_generation_phone_fallback(self):
        sample_no_dob = {
            "patient_name": "Anita Gupta",
            "patient_dob": "",
            "phone": "9888478606",
            "age": 30,
            "gender": "Female",
            "chief_complaint": "Migraine",
            "diagnosis": "Acute Migraine"
        }
        pdf_path = self.agent.generate_pdf(sample_no_dob)
        self.assertTrue(os.path.exists(pdf_path))
        self.assertGreater(os.path.getsize(pdf_path), 0)


if __name__ == "__main__":
    unittest.main()
