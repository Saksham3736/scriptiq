# Agent 5 — WhatsApp Agent

## Overview

The WhatsApp Agent is responsible for sending the generated prescription PDF to the patient through WhatsApp.

After the prescription has been successfully saved in MongoDB Atlas, this agent prepares a message, attaches the prescription PDF, and sends it to the patient's registered mobile number.

> **Important:** This agent only sends the prescription. It does not modify the prescription or patient data.

---

# Objective

Automatically deliver the prescription PDF to the patient's WhatsApp after the doctor approves the prescription.

---

# Workflow

```
Receive Patient Details
          │
          ▼
Validate Phone Number
          │
          ▼
Prepare WhatsApp Message
          │
          ▼
Attach Prescription PDF
          │
          ▼
Send Message
          │
          ▼
Show Delivery Status
          │
          ▼
Send Data to Pharmacy Agent
(Optional)
```

---

# Responsibilities

The WhatsApp Agent should:

- Validate the patient's phone number.
- Check if the prescription PDF exists.
- Prepare a WhatsApp message.
- Attach the prescription PDF.
- Send the message.
- Display delivery status.
- Continue to Agent 6 if the patient chooses the hospital pharmacy.

---

# Input

Example

```json
{
    "patient_name": "Rahul Sharma",
    "phone": "+919876543210",
    "pdf_path": "output/prescriptions/Rahul_Sharma_2026-07-15_10-35.pdf",
    "hospital_pharmacy": true
}
```

---

# Output

```
Prescription Sent Successfully
```

---

# WhatsApp Service

For the MVP, either of the following can be used:

- Meta WhatsApp Cloud API ✅ (Recommended)
- Twilio WhatsApp API

---

# Libraries Required

## HTTP Requests

```
requests
```

Used for making API requests.

---

## Environment Variables

```
python-dotenv
```

Used for securely storing API credentials.

---

## File Handling

```
os
```

Used to verify that the prescription PDF exists.

---

# Suggested File Structure

```
agents/

whatsapp_agent.py
```

---

# Main Functions

## Validate Phone Number

```python
validate_phone(phone_number)
```

Purpose

Check whether the phone number is valid.

Returns

```
True / False
```

---

## Send WhatsApp

```python
send_whatsapp(pdf_path, phone_number)
```

Purpose

Send the prescription PDF to the patient.

Returns

```
Success / Failed
```

---

## Notify User

```python
show_delivery_status()
```

Purpose

Display the delivery result in Streamlit.

---

## Send to Pharmacy Agent

```python
send_to_pharmacy(data)
```

Purpose

If the patient selects the hospital pharmacy option, pass the prescription to Agent 6.

---

# Default WhatsApp Message

```
Hello Rahul Sharma,

Your prescription has been generated successfully.

Please find your prescription attached.

We wish you a speedy recovery.

Thank you for visiting our hospital.
```

---

# Streamlit UI

After clicking **Send WhatsApp**

```
-------------------------------------

Patient Name

Rahul Sharma

Phone Number

+91 9876543210

-------------------------------------

Prescription PDF

✔ Attached

-------------------------------------

[ Send ]

-------------------------------------

Status

✅ Sent Successfully

-------------------------------------
```

---

# Validation

Before sending the message:

- Phone number should not be empty.
- Phone number should be in the correct format.
- PDF should exist.
- WhatsApp API credentials should be available.

If any validation fails, stop the process and notify the doctor.

---

# Error Handling

### Invalid Phone Number

```
Invalid phone number.
```

---

### PDF Not Found

```
Prescription PDF not found.
```

---

### WhatsApp API Error

```
Unable to send the prescription.

Please try again.
```

---

### Internet Connection Error

```
Unable to connect to WhatsApp service.
```

---

# Example Output

```
Patient Name

Rahul Sharma

Status

Prescription Sent Successfully

Time

15 July 2026
```

---

# Data Passed to Agent 6

If the patient chooses to purchase medicines from the hospital pharmacy:

```json
{
    "patient_name": "Rahul Sharma",
    "phone": "+919876543210",
    "pdf_path": "output/prescriptions/Rahul_Sharma_2026-07-15_10-35.pdf",
    "hospital_pharmacy": true
}
```

If the patient does **not** choose the hospital pharmacy:

```
Workflow Ends
```

---

# Future Improvements

The MVP only sends a prescription PDF.

Possible future enhancements:

- Personalized message templates.
- Support for multiple languages.
- Automatic delivery confirmation.
- Read receipt tracking.
- Follow-up reminder messages.
- Appointment reminder integration.
- Medicine refill reminders.

---

# Summary

### Input

Patient phone number

↓

Prescription PDF

↓

### Processing

Validate phone number

↓

Attach PDF

↓

Send WhatsApp message

↓

Show delivery status

↓

### Output

Prescription delivered to the patient and, if applicable, data passed to Agent 6