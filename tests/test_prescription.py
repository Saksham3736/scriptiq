import os
import sys
import unittest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.prescription_agent import PrescriptionAgent


class TestPrescriptionAgent(unittest.TestCase):
    def setUp(self):
        self.agent = PrescriptionAgent()

    def test_prescription_agent(self):
        sample_transcript = """
        Patient Name Rahul Sharma, age 24, male.
        Complaining of fever and sore throat since two days.
        Diagnosis: Viral Fever.
        Prescribe Dolo 650 twice daily after meals for 5 days.
        Azithromycin 500 once daily after food for 3 days.
        Recommend Complete Blood Count (CBC) test.
        Drink plenty of warm water and rest.
        Follow up after 5 days.
        """
        result = self.agent.process_consultation(sample_transcript)
        self.assertIn("valid", result)
        self.assertTrue(result["valid"])
        self.assertIn("prescription", result)
        prescription = result["prescription"]
        self.assertEqual(prescription.get("patient_name"), "Rahul Sharma")


if __name__ == "__main__":
    unittest.main()
