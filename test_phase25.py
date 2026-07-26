import requests

def test_phase25_patient_portal():
    print("==================================================")
    print("Phase 25: Testing Full Patient Portal Web Suite API")
    print("==================================================")

    base_url = "http://localhost:8000"
    test_phone = "9888478606"

    # 1. Request OTP
    print(f"1. Requesting OTP for patient phone: {test_phone}...")
    try:
        otp_res = requests.post(f"{base_url}/api/patient/auth/request-otp", json={"phone": test_phone})
        otp_data = otp_res.json()
        
        if otp_res.status_code == 200 and otp_data.get("success"):
            print("   SUCCESS: OTP Requested! Demo OTP:", otp_data["data"].get("demo_otp"))
        else:
            print("   FAILED:", otp_data)
            return
    except Exception as e:
        print("   CONNECTION ERROR:", e)
        return

    # 2. Verify OTP
    print("\n2. Verifying OTP code 1234...")
    try:
        verify_res = requests.post(f"{base_url}/api/patient/auth/verify-otp", json={"phone": test_phone, "otp": "1234"})
        verify_data = verify_res.json()

        if verify_res.status_code == 200 and verify_data.get("success"):
            token = verify_data["data"].get("token")
            user = verify_data["data"].get("user")
            print("   SUCCESS: Patient authenticated successfully!")
            print(f"   User Profile: {user}")
            print(f"   JWT Token: {token[:25]}...")
        else:
            print("   FAILED:", verify_data)
            return
    except Exception as e:
        print("   ERROR:", e)
        return

    # 3. Fetch Patient Prescription History
    print(f"\n3. Querying prescription history for phone: {test_phone}...")
    try:
        hist_res = requests.get(f"{base_url}/api/patient/prescriptions?phone={test_phone}")
        hist_data = hist_res.json()

        if hist_res.status_code == 200 and hist_data.get("success"):
            prescriptions = hist_data["data"].get("prescriptions", [])
            print(f"   SUCCESS: Retrieved {len(prescriptions)} prescription record(s) for patient.")
            for i, p in enumerate(prescriptions, 1):
                print(f"   - Record #{i}: Diagnosis '{p.get('diagnosis', 'N/A')}', PDF: {p.get('pdf_url', 'None')}")
        else:
            print("   FAILED:", hist_data)
    except Exception as e:
        print("   ERROR:", e)

if __name__ == "__main__":
    test_phase25_patient_portal()
