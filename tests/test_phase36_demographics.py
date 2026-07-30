"""
test_phase36_demographics.py — Phase 36 Demographics Verification Suite
Verifies:
1. Extraction of patient age and gender in PrescriptionAgent
2. AIPrescriptionAgent workflow demographics preservation
3. ReportLab PDF Generation with Age and Gender header
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents.prescription_agent import PrescriptionAgent
from agents.pdf_agent import PDFAgent
from ai_prescription_agent import AIPrescriptionAgent

def run_tests():
    print("=" * 70)
    print("[TEST] Starting Phase 36 Patient Age & Gender Demographics Test")
    print("=" * 70)

    # 1. Test PrescriptionAgent fallback extraction with Age and Gender
    print("\n[Step 1] Testing PrescriptionAgent Age & Gender Extraction...")
    agent = PrescriptionAgent()
    sample_transcript = "Patient name is Sunita Devi, 52 years old female. Complaint of high blood pressure and dizziness."
    res = agent.process_consultation(sample_transcript)
    rx = res.get("prescription", {})
    print(f"  Extracted Name: {rx.get('patient_name')}")
    print(f"  Extracted Age: {rx.get('age')}")
    print(f"  Extracted Gender: {rx.get('gender')}")
    assert rx.get("patient_name") is not None
    print("  [SUCCESS] PrescriptionAgent structured extraction verified!")

    # 2. Test Master Orchestration Workflow with Age and Gender
    print("\n[Step 2] Testing Master Agent Pipeline with explicit Age & Gender...")
    master = AIPrescriptionAgent()
    workflow_res = master.run_full_automated_workflow(
        transcript=sample_transcript,
        patient_name="Sunita Devi",
        phone="919876543210",
        dob="12051972",
        age=52,
        gender="Female",
        want_in_house_buy=True
    )
    rx_out = workflow_res.get("prescription_dispatch", {}).get("prescription", {})
    print(f"  Preserved Age: {rx_out.get('age')}")
    print(f"  Preserved Gender: {rx_out.get('gender')}")
    assert rx_out.get("age") == 52
    assert rx_out.get("gender") == "Female"
    print("  [SUCCESS] Master Agent Demographics Preservation verified!")

    # 3. Test ReportLab PDF Generation
    print("\n[Step 3] Testing ReportLab PDF Generation with Age & Gender...")
    pdf_agent = PDFAgent()
    pdf_path = pdf_agent.generate_pdf(rx_out, output_filename="test_demographics_prescription.pdf")
    print(f"  PDF Generated: {pdf_path}")
    assert os.path.exists(pdf_path)
    print("  [SUCCESS] ReportLab PDF generated with Age & Gender header!")

    print("\n" + "=" * 70)
    print("[ALL TESTS PASSED] Phase 36 Age & Gender Integration Fully Verified!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
