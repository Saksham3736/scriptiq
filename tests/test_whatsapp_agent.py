import os
import sys
import glob
import json
import unittest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.whatsapp_agent import WhatsAppAgent, validate_phone


class TestWhatsAppAgent(unittest.TestCase):
    def setUp(self):
        self.agent = WhatsAppAgent()

    def test_phone_validation(self):
        self.assertTrue(validate_phone("+919876543210"))
        self.assertTrue(validate_phone("9876543210"))
        self.assertFalse(validate_phone("1234"))

    def test_whatsapp_delivery(self):
        pdf_dir = "output/prescriptions"
        os.makedirs(pdf_dir, exist_ok=True)
        test_pdf = os.path.join(pdf_dir, "test_prescription.pdf")
        if not os.path.exists(test_pdf):
            with open(test_pdf, "wb") as f:
                f.write(b"%PDF-1.4 dummy pdf for whatsapp test")

        sample_payload = {
            "patient_name": "Rahul Sharma",
            "phone": "+918872220999",
            "patient_dob": "15/08/1998",
            "pdf_path": test_pdf,
            "hospital_pharmacy": True
        }

        result = self.agent.process_consultation(sample_payload)
        self.assertIn("status", result)
        self.assertIn(result["status"], ["success", "error"])
        self.assertIn("whatsapp_url", result)


if __name__ == "__main__":
    unittest.main()
