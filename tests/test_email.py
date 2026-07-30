import unittest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.email_agent import EmailAgent

class TestEmailAgent(unittest.TestCase):
    def setUp(self):
        self.email_agent = EmailAgent()

    def test_send_prescription_email_simulation(self):
        config = {
            "email_simulation_mode": True,
            "smtp_user": "scriptiq.sk@gmail.com",
            "hospital_name": "ScriptIQ Medical Suite"
        }
        res = self.email_agent.send_prescription_email(
            pdf_path="output/prescriptions/sample.pdf",
            patient_email="saksham.kj.3736@gmail.com",
            patient_name="Ravi Mehta",
            config=config
        )
        self.assertTrue(res)

if __name__ == "__main__":
    unittest.main()
