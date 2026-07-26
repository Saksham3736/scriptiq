import requests

def test_web_push():
    print("==================================================")
    print("Phase 24: Testing Web Push Notification Engine")
    print("==================================================")
    
    url = "http://localhost:8000/api/prescription/send-push"
    
    # Using the exact phone number requested for testing
    payload = {
        "phone": "9888478606",
        "patient_name": "Test Patient"
    }
    
    print(f"Triggering push notification for phone: {payload['phone']}...")
    
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        
        if response.status_code == 200:
            if data.get("success"):
                print("SUCCESS: Web push notification sent to browser Service Worker!")
                print("Check your desktop or device for the native push popup notification.")
            else:
                print("FAILED: " + (data.get("error") or "Unknown error"))
        else:
            print(f"ERROR: Server returned HTTP {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("CONNECTION ERROR: Could not connect to the backend server.")
        print("Please make sure the backend server is running on port 8000.")
    except Exception as e:
        print(f"UNEXPECTED ERROR: {e}")

if __name__ == "__main__":
    print("Note: Ensure you have first visited http://localhost:5173/patient and subscribed with this phone number!")
    test_web_push()
