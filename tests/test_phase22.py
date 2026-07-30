import requests

url = 'http://localhost:8000/api/prescription/approve'
payload = {
    'prescription_data': {
        'patient_name': 'Test Patient',
        'phone': '919876543210',
        'dob': '01012000',
        'symptoms': ['Headache'],
        'diagnosis': 'Migraine',
        'medicines': [{'name': 'Paracetamol', 'dosage': '500mg'}],
        'advice': ['Rest'],
        'consultation_date': '2026-07-26'
    },
    'phone': '919876543210',
    'patient_dob': '01012000'
}

response = requests.post(url, json=payload)
print(f'Status Code: {response.status_code}')
print(f'Response: {response.text}')
