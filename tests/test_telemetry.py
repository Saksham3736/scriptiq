import unittest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ai_prescription_agent import AIPrescriptionAgent

class TestMasterAgentTelemetry(unittest.TestCase):
    def setUp(self):
        self.master_agent = AIPrescriptionAgent()
        self.received_events = []

    def telemetry_handler(self, event):
        self.received_events.append(event)
        print(f"[TelemetryTest] Received Event Step {event.get('step')}: [{event.get('agent')}] {event.get('title')} -> {event.get('message')}")

    def test_telemetry_emission_chain(self):
        sample_transcript = "Patient name is Sunita Patel, 28 years old. Complaint: Sore throat. Prescribing Cetzine 10mg once daily for 3 days."
        
        res = self.master_agent.run_full_automated_workflow(
            transcript=sample_transcript,
            patient_name="Sunita Patel",
            phone="9888478606",
            dob="15081995",
            want_in_house_buy=True,
            telemetry_callback=self.telemetry_handler
        )
        
        self.assertIsNotNone(res)
        self.assertGreater(len(self.received_events), 0)
        
        agents_emitted = [e.get("agent") for e in self.received_events]
        self.assertIn("SpeechAgent", agents_emitted)
        self.assertIn("PrescriptionAgent", agents_emitted)
        self.assertIn("PDFAgent", agents_emitted)
        self.assertIn("DatabaseAgent", agents_emitted)
        self.assertIn("EmailAgent", agents_emitted)
        self.assertIn("PharmacyAgent", agents_emitted)
        print("\n[TestMasterAgentTelemetry] Verified 6 sub-agents emitted telemetry events successfully!")

if __name__ == "__main__":
    unittest.main()
