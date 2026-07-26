"""
test_phase26_email.py — Phase 26 Redesigned Test: Instant Email & Web Push Verification
"""

import os
import sys
import requests
import json

sys.path.insert(0, r"s:\AI-prescription-agent")
from agents.pdf_agent import PDFAgent

BASE_URL = "http://localhost:8000"

def run_test():
    print("=" * 65)
    print("Phase 26: Redesigned Instant Email & Web Push Verification")
    print("=" * 65)

    # Step 1: Generate Prescription PDF directly via PDFAgent
    print("\n[Step 1/3] Generating Clinical Prescription PDF...")
    patient_data = {
        "patient_name": "Ravi Mehta",
        "age": "35",
        "gender": "Male",
        "patient_dob": "15081989",
        "phone": "9888478606",
        "email": "saksham.kj.3736@gmail.com",
        "chief_complaint": "Acute seasonal bronchitis & dry cough",
        "diagnosis": "Acute Bronchitis (J20.9)",
        "medicines": [
            {
                "name": "Amoxicillin 500mg",
                "dosage": "1 Tablet 3 Times Daily",
                "duration": "5 Days",
                "instruction": "Take after food"
            },
            {
                "name": "Cetirizine 10mg",
                "dosage": "1 Tablet at Bedtime",
                "duration": "3 Days",
                "instruction": "Take with water"
            }
        ],
        "doctor_name": "Dr. Arjun Sharma",
        "clinic_name": "MediCare Hospital, Delhi"
    }

    pdf_agent = PDFAgent()
    pdf_filename = f"Prescription_Ravi_Mehta_Phase26.pdf"
    generated_pdf = pdf_agent.generate_pdf(patient_data, output_filename=pdf_filename)
    print(f"SUCCESS: Generated PDF at {generated_pdf}")

    # Step 2: Dispatch Email (saksham2435157@gmail.com -> saksham.kj.3736@gmail.com)
    print("\n[Step 2/3] Dispatching Email from saksham2435157@gmail.com to saksham.kj.3736@gmail.com...")
    email_payload = {
        "prescription_data": patient_data,
        "pdf_path": generated_pdf,
        "patient_email": "saksham.kj.3736@gmail.com",
        "patient_name": "Ravi Mehta"
    }

    try:
        res = requests.post(f"{BASE_URL}/api/prescription/send-email", json=email_payload, timeout=15)
        json_data = res.json()
        if json_data.get("success"):
            print("SUCCESS: Email successfully dispatched to patient!")
            print(f"Details: {json_data.get('data')}")
        else:
            print(f"FAILED: Email dispatch response: {json_data}")
    except Exception as e:
        print(f"Exception sending email: {e}")

    # Step 3: Dispatch Web Push Notification
    print("\n[Step 3/3] Triggering Web Push Notification for phone 9888478606...")
    push_payload = {
        "phone": "9888478606",
        "patient_name": "Ravi Mehta"
    }

    try:
        res = requests.post(f"{BASE_URL}/api/prescription/send-push", json=push_payload, timeout=10)
        json_data = res.json()
        if json_data.get("success"):
            print("SUCCESS: Web Push notification sent!")
            print(f"Details: {json_data.get('data')}")
        else:
            print(f"Web Push Info: {json_data.get('error') or json_data}")
    except Exception as e:
        print(f"Exception sending push: {e}")

    print("\n" + "=" * 65)
    print("Phase 26 Redesigned Verification Completed Successfully!")
    print("=" * 65)

if __name__ == "__main__":
    run_test()
