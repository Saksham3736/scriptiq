import os
import sys
import json
import unittest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.pharmacy_agent import PharmacyAgent


class TestPharmacyAgent(unittest.TestCase):
    def setUp(self):
        self.agent = PharmacyAgent()

    def test_pharmacy_order_generation(self):
        sample_prescription = {
            "patient_name": "Rahul Sharma",
            "phone": "+91 88722 20999",
            "age": 24,
            "gender": "Male",
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
            ]
        }

        order = self.agent.process_consultation(sample_prescription)
        self.assertIn("order_id", order)
        self.assertEqual(order.get("patient_name"), "Rahul Sharma")
        self.assertEqual(order.get("total_items"), 2)
        self.assertGreater(order.get("total_amount_inr", 0), 0)


if __name__ == "__main__":
    unittest.main()
