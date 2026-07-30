"""
test_phase26_email.py — Phase 26 Redesigned Live Email & Web Push Diagnostic Suite
"""

import os
import sys
import requests
import json
from dotenv import load_dotenv

# Ensure root workspace is in sys.path
WORKSPACE_ROOT = os.path.dirname(os.path.abspath(__file__))
if WORKSPACE_ROOT not in sys.path:
    sys.path.insert(0, WORKSPACE_ROOT)

load_dotenv()

import config as app_config
from agents.pdf_agent import PDFAgent
from agents.email_agent import EmailAgent

BASE_URL = "http://localhost:8000"

def run_test():
    print("=" * 70)
    print("Phase 26 Diagnostic Suite: Live Email SMTP & Web Push Verification")
    print("=" * 70)

    # Credential Audit
    smtp_user = getattr(app_config, "SMTP_USER", "") or os.getenv("SMTP_USER", "scriptiq.sk@gmail.com")
    smtp_pass = getattr(app_config, "SMTP_PASS", "") or os.getenv("SMTP_PASS", "") or os.getenv("GMAIL_APP_PASSWORD", "")
    patient_email = getattr(app_config, "DEFAULT_PATIENT_EMAIL", "saksham.kj.3736@gmail.com")

    print("\n[CREDENTIAL & SMTP AUDIT]")
    print(f"  * Sender Email (SMTP_USER) : {smtp_user}")
    print(f"  * Target Patient Email    : {patient_email}")
    if smtp_pass:
        masked_pass = smtp_pass[:2] + "*" * (len(smtp_pass) - 4) + smtp_pass[-2:] if len(smtp_pass) > 4 else "****"
        print(f"  * SMTP Password Status    : DETECTED ({masked_pass})")
        print(f"  * Dispatch Mode Target    : REAL LIVE SMTP DISPATCH (smtp.gmail.com:587)")
    else:
        print(f"  * SMTP Password Status    : NOT SET IN .env / config.py")
        print(f"  * Dispatch Mode Target    : SIMULATION MODE (Console Print Only)")
        print("  [TIP] Add SMTP_PASS=xxxx xxxx xxxx xxxx to your .env file to enable live inbox delivery!")

    print("-" * 70)

    # Step 1: Generate Prescription PDF directly via PDFAgent
    print("\n[Step 1/4] Generating Clinical Prescription PDF...")
    patient_data = {
        "patient_name": "Ravi Mehta",
        "age": "35",
        "gender": "Male",
        "patient_dob": "15081989",
        "phone": "9888478606",
        "email": patient_email,
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
        "clinic_name": "ScriptIQ Medical Center"
    }

    pdf_agent = PDFAgent()
    pdf_filename = "Prescription_Ravi_Mehta_Phase26.pdf"
    generated_pdf = pdf_agent.generate_pdf(patient_data, output_filename=pdf_filename)
    print(f"SUCCESS: Generated PDF at: {generated_pdf}")

    # Step 2: Direct EmailAgent SMTP Dispatch Test
    print("\n[Step 2/4] Direct EmailAgent Dispatch Test...")
    try:
        email_agent = EmailAgent()
        direct_success = email_agent.send_prescription_email(
            pdf_path=generated_pdf,
            patient_email=patient_email,
            patient_name="Ravi Mehta"
        )
        if direct_success:
            if smtp_pass:
                print(f"SUCCESS: Direct REAL SMTP email dispatched to {patient_email}!")
            else:
                print(f"INFO: Direct EmailAgent execution completed in SIMULATION MODE.")
        else:
            print("FAILED: Direct EmailAgent dispatch returned False.")
    except Exception as e:
        print(f"SMTP DISPATCH EXCEPTION: {e}")
        import traceback
        traceback.print_exc()

    # Step 3: FastAPI Server Endpoint Dispatch Test
    print(f"\n[Step 3/4] FastAPI Server Endpoint Test ({BASE_URL}/api/prescription/send-email)...")
    email_payload = {
        "prescription_data": patient_data,
        "pdf_path": generated_pdf,
        "patient_email": patient_email,
        "patient_name": "Ravi Mehta"
    }

    try:
        res = requests.post(f"{BASE_URL}/api/prescription/send-email", json=email_payload, timeout=15)
        json_data = res.json()
        if json_data.get("success"):
            data_info = json_data.get("data") or {}
            mode = data_info.get("mode", "UNKNOWN")
            if mode == "LIVE_SMTP":
                print("SUCCESS: FastAPI Server dispatched REAL SMTP email to patient inbox!")
            else:
                print("SUCCESS (SIMULATION): FastAPI Server processed request in Simulation Mode.")
            print(f"   Response Payload: {json_data}")
        else:
            print(f"FAILED: Server returned error: {json_data}")
    except Exception as e:
        print(f"SERVER API EXCEPTION: {e}")

    # Step 4: Dispatch Web Push Notification
    print(f"\n[Step 4/4] Web Push Notification Test ({BASE_URL}/api/prescription/send-push)...")
    push_payload = {
        "phone": "9888478606",
        "patient_name": "Ravi Mehta"
    }

    try:
        res = requests.post(f"{BASE_URL}/api/prescription/send-push", json=push_payload, timeout=10)
        json_data = res.json()
        if json_data.get("success"):
            print("SUCCESS: Web Push notification dispatched!")
            print(f"   Details: {json_data.get('data')}")
        else:
            print(f"Web Push Info: {json_data.get('error') or json_data}")
    except Exception as e:
        print(f"WEB PUSH EXCEPTION: {e}")

    print("\n" + "=" * 70)
    print("Phase 26 Redesigned Verification Completed!")
    print("=" * 70)

if __name__ == "__main__":
    run_test()
