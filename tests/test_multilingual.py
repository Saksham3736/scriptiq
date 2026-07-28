import unittest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.prescription_agent import PrescriptionAgent

class TestMultilingualExtraction(unittest.TestCase):
    def setUp(self):
        self.agent = PrescriptionAgent()

    def test_hinglish_consultation_extraction(self):
        hinglish_transcript = (
            "Patient name is Ramesh Kumar, age 32 years. Patient ko 3 din se bukhar aur sar dard hai. "
            "Prescribing Dolo 650mg subah shaam khana khane ke baad for 5 days. "
            "Also prescribing Pantocid 40mg subah khali pet for 5 days. "
            "Advice: Drink warm water and rest."
        )
        res = self.agent.generate_prescription(hinglish_transcript)
        self.assertIsNotNone(res)
        self.assertIn("Ramesh", res.get("patient_name", ""))
        self.assertGreater(len(res.get("medicines", [])), 0)
        print("\n[TestMultilingualExtraction] Successfully extracted Hinglish prescription:")
        print(res)

if __name__ == "__main__":
    unittest.main()
