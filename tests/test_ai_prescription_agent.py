# Integration Test for AIPrescriptionAgent
import os
import sys
import unittest

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ai_prescription_agent import AIPrescriptionAgent


from agents.database_agent import DatabaseAgent


class TestAIPrescriptionAgent(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.agent = AIPrescriptionAgent()
        # Isolate database writes to test collection to prevent polluting production DB
        cls.agent.db_agent = DatabaseAgent(collection_name="test_prescriptions")

    @classmethod
    def tearDownClass(cls):
        try:
            # Clean up test documents created during testing
            cls.agent.db_agent.db['test_prescriptions'].delete_many({'patient_name': {'$in': ['Priya Verma', 'Amit Patel']}})
        except Exception:
            pass

    def test_full_automated_workflow_with_pharmacy(self):
        sample_transcript = (
            "Patient Priya Verma, 30 year old female, reports stomach pain and acidity for past 3 days. "
            "Diagnosis: Hyperacidity. Prescribing Pan 40 tablet once daily before breakfast for 7 days, "
            "and Cetzine 10mg once daily at bedtime for 3 days."
        )
        
        result = self.agent.run_full_automated_workflow(
            transcript=sample_transcript,
            patient_name="Priya Verma",
            phone="919876543211",
            dob="22041996",
            amendments={
                "follow_up": "After 7 Days"
            },
            want_in_house_buy=True
        )

        self.assertIn("prescription_dispatch", result)
        self.assertIn("pharmacy_dispatch", result)
        
        # Verify PDF generation
        pdf_path = result["prescription_dispatch"]["pdf_path"]
        self.assertTrue(os.path.exists(pdf_path), f"PDF file not found at {pdf_path}")
        
        # Verify Pharmacy dispatch
        pharmacy_dispatch = result["pharmacy_dispatch"]
        self.assertEqual(pharmacy_dispatch["pharmacy_choice"], "In-House Pharmacy")
        self.assertTrue(pharmacy_dispatch["medical_desk_notified"])
        self.assertGreater(pharmacy_dispatch["pharmacy_order"]["total_amount_inr"], 0)

    def test_workflow_external_pharmacy_choice(self):
        sample_transcript = (
            "Patient Amit Patel, 45 year old male, complains of mild headache. "
            "Diagnosis: Tension Headache. Prescribe Paracetamol 500mg as needed."
        )
        
        rx_data = self.agent.generate_prescription(
            transcript=sample_transcript,
            patient_name="Amit Patel",
            phone="919876543212"
        )
        
        dispatch_res = self.agent.approve_and_send_prescription(rx_data, phone="919876543212")
        pharmacy_res = self.agent.process_pharmacy_choice(rx_data, want_in_house_buy=False, phone="919876543212")
        
        self.assertEqual(pharmacy_res["pharmacy_choice"], "External Pharmacy")
        self.assertIsNone(pharmacy_res["pharmacy_order"])


if __name__ == "__main__":
    unittest.main()
