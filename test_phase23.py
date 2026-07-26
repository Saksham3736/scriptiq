import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_email_dispatch():
    print("Testing Phase 23: Email Dispatch Engine")
    
    # 1. Update email settings to simulation mode
    print("\n--- 1. Setting up Email Settings (Simulation Mode) ---")
    settings_payload = {
        "email_simulation_mode": True,
        "smtp_host": "smtp.gmail.com",
        "smtp_port": 587,
        "smtp_user": "saksham2435157@gmail.com",
        "smtp_pass": "",
        "sender_email": "saksham2435157@gmail.com"
    }
    r = requests.post(f"{BASE_URL}/api/settings/email", json=settings_payload)
    if r.status_code == 200:
        print("SUCCESS: Email settings updated successfully.")
    else:
        print(f"FAILED to update settings: {r.text}")
        return

    # 2. Trigger send-email endpoint
    print("\n--- 2. Triggering /api/prescription/send-email ---")
    draft_data = {
        "patient_name": "Test Patient",
        "phone": "+91 98765 43210",
        "email": "saksham2435157@gmail.com",
        "dob": "01012000",
        "diagnosis": "Viral Fever",
        "symptoms": ["Fever", "Cough"],
        "medicines": [
            {"name": "Paracetamol", "dosage": "500mg", "frequency": "Twice a day", "duration": "3 days"}
        ]
    }
    
    # Mocking PDF path since we don't have a real one here, it will just warn and send email body
    email_payload = {
        "prescription_data": draft_data,
        "pdf_path": "non_existent.pdf", 
        "patient_email": "saksham2435157@gmail.com",
        "patient_name": "Test Patient"
    }
    
    r2 = requests.post(f"{BASE_URL}/api/prescription/send-email", json=email_payload)
    if r2.status_code == 200 and r2.json().get("success"):
        print("SUCCESS: Email dispatch triggered successfully.")
        print("Check the backend terminal to verify simulation mode printed the email output.")
    else:
        print(f"FAILED to trigger email dispatch: {r2.text}")

if __name__ == "__main__":
    test_email_dispatch()
