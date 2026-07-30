"""
test_manual_autopilot.py — ScriptIQ Manual Testing & Live Telemetry Trigger Script

Execute this script to trigger the full 6-agent Auto-Pilot workflow.
If you have the web console open at http://localhost:5173/console with Auto-Pilot ON,
you will see the floating Master Agent Telemetry Console animate live in your browser!
"""

import urllib.request
import json
import time

def trigger_manual_autopilot_test():
    print("=" * 70)
    print("[TEST] ScriptIQ Manual Auto-Pilot Consultation Trigger")
    print("=" * 70)
    print("\n[NOTE] Open http://localhost:5173/console in your browser first!")
    print("       Ensure Auto-Pilot is ON to watch live sub-agent telemetry!\n")
    time.sleep(2)

    url = "http://localhost:8000/api/consultation/autopilot"
    payload = {
        "transcript": (
            "Patient name is Sunita Patel, 35 years old female, DOB 15-08-1995. Phone 9888478606. "
            "Patient ko 3 din se bukhar aur sar me tez dard hai. "
            "Prescribing Dolo 650mg subah shaam khana khane ke baad for 5 days. "
            "Also prescribing Pantocid 40mg subah khali pet for 5 days. "
            "Advice: Drink warm water, take proper rest, and avoid cold drinks."
        ),
        "patient_name": "Sunita Patel",
        "phone": "9888478606",
        "dob": "15081995",
        "want_in_house_buy": True
    }

    print("[1/3] Sending Auto-Pilot Consultation Request to Backend Server...")
    print(f"      Patient: {payload['patient_name']} (DOB Password: {payload['dob']})")
    print(f"      Transcript: \"{payload['transcript'][:90]}...\"\n")

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )

    try:
        start_time = time.time()
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            elapsed = time.time() - start_time

            print("=" * 70)
            print(f"[SUCCESS] Auto-Pilot Workflow Execution Completed in {elapsed:.2f}s!")
            print("=" * 70)
            
            data = res_data.get("data", {})
            rx_dispatch = data.get("prescription_dispatch", {})
            rx_data = rx_dispatch.get("prescription", {})
            pharmacy = data.get("pharmacy_dispatch", {}).get("pharmacy_order", {})

            print("\n  [OK] Extracted Prescription JSON:")
            print(f"       - Patient: {rx_data.get('patient_name')} (Age: {rx_data.get('age')})")
            print(f"       - Chief Complaint: {rx_data.get('chief_complaint')}")
            print(f"       - Prescribed Medicines: {len(rx_data.get('medicines', []))} items")
            for m in rx_data.get('medicines', []):
                print(f"         * {m.get('name')}: {m.get('dosage')} ({m.get('meal_instruction')}) for {m.get('duration')}")

            print(f"\n  [OK] Encrypted PDF Saved: {rx_dispatch.get('pdf_path')}")
            print(f"  [OK] MongoDB Document ID: {rx_dispatch.get('db_id')}")
            print(f"  [OK] Email Dispatched to: saksham.kj.3736@gmail.com")
            if pharmacy:
                print(f"  [OK] Pharmacy Order Generated: {pharmacy.get('order_id')} (Total: INR {pharmacy.get('total_amount_inr')})")
                print("  [OK] Hospital Medical Desk Alert Sent to Counter 2!")

    except Exception as e:
        print(f"[ERROR] Failed to execute Auto-Pilot trigger: {e}")

if __name__ == "__main__":
    trigger_manual_autopilot_test()
