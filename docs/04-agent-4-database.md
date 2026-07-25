# Agent 4 — Database Agent

## Overview

The Database Agent is responsible for storing the prescription details in MongoDB Atlas.

Once the prescription PDF has been generated, this agent saves both the prescription data and the PDF location so that it can be accessed later.

> **Important:** This agent only stores and retrieves data. It does not modify prescriptions.

---

# Objective

Save every approved prescription in MongoDB Atlas and allow it to be retrieved later.

---

# Workflow

```
Receive Prescription Data
          │
          ▼
Connect to MongoDB Atlas
          │
          ▼
Create Prescription Record
          │
          ▼
Save Record
          │
          ▼
Return Success Message
          │
          ▼
Send Data to WhatsApp Agent
```

---

# Responsibilities

The Database Agent should:

- Connect to MongoDB Atlas.
- Save patient details.
- Save prescription details.
- Save PDF file path.
- Save consultation date and time.
- Retrieve previous prescriptions when needed.

---

# Input

Prescription JSON received from Agent 3.

Example

```json
{
  "patient_name": "Rahul Sharma",
  "phone": "9876543210",
  "age": 24,
  "gender": "Male",
  "diagnosis": "Viral Fever",
  "medicines": [
    {
      "name": "Dolo 650",
      "dosage": "Twice Daily",
      "duration": "5 Days",
      "meal_instruction": "After Meals"
    }
  ],
  "general_advice": [
    "Drink plenty of water"
  ],
  "follow_up": "After 5 Days",
  "pdf_path": "output/prescriptions/Rahul_Sharma_2026-07-15_10-35.pdf"
}
```

---

# Output

A new document stored in MongoDB Atlas.

Example

```
Prescription Saved Successfully.
```

---

# Database

## MongoDB Atlas

Database Name

```
ai_prescription
```

---

# Collection

```
prescriptions
```

---

# Document Structure

```json
{
  "patient_name": "Rahul Sharma",
  "phone": "9876543210",
  "age": 24,
  "gender": "Male",
  "diagnosis": "Viral Fever",
  "medicines": [
    {
      "name": "Dolo 650",
      "dosage": "Twice Daily",
      "duration": "5 Days",
      "meal_instruction": "After Meals"
    }
  ],
  "general_advice": [
    "Drink plenty of water"
  ],
  "follow_up": "After 5 Days",
  "pdf_path": "output/prescriptions/Rahul_Sharma_2026-07-15_10-35.pdf",
  "created_at": "2026-07-15 10:35"
}
```

---

# Libraries Required

## MongoDB

```
pymongo
```

Used for connecting to MongoDB Atlas.

---

## Date & Time

```
datetime
```

Used for storing consultation time.

---

## Environment Variables

```
python-dotenv
```

Used for securely loading the MongoDB connection string.

---

# Suggested File Structure

```
database/

mongodb.py

agents/

database_agent.py
```

---

# Main Functions

## Connect Database

```python
connect_database()
```

Purpose:

Create a connection with MongoDB Atlas.

---

## Save Prescription

```python
save_prescription(data)
```

Purpose:

Insert a prescription document into MongoDB.

Returns

```
Document ID
```

---

## Get Patient History

```python
get_patient_history(phone_number)
```

Purpose:

Retrieve previous prescriptions for a patient.

Returns

```
List of Prescriptions
```

---

## Send to WhatsApp Agent

```python
send_to_whatsapp(data)
```

Purpose:

Pass the saved prescription data to Agent 5.

---

# Streamlit UI

After saving the prescription:

```
----------------------------------------

✅ Prescription Saved Successfully

Patient Name

Rahul Sharma

Database

MongoDB Atlas

Consultation Date

15 July 2026

----------------------------------------

[ View History ]

[ Send WhatsApp ]

----------------------------------------
```

---

# Validation

Before saving the record:

- Patient name should exist.
- Phone number should be available.
- PDF path should exist.
- Medicine list should not be empty.
- Database connection should be active.

If validation fails, display an error and stop the save process.

---

# Error Handling

### Database Connection Failed

```
Unable to connect to MongoDB Atlas.
```

---

### Insert Failed

```
Unable to save prescription.

Please try again.
```

---

### Missing PDF

```
Prescription PDF not found.
```

---

### Missing Patient Name

```
Patient name is required.
```

---

# Example Record

```
Patient

Rahul Sharma

Diagnosis

Viral Fever

Medicines

Dolo 650

PDF

output/prescriptions/Rahul_Sharma_2026-07-15_10-35.pdf

Saved

15 July 2026
```

---

# Data Passed to Agent 5

```json
{
  "patient_name": "Rahul Sharma",
  "phone": "9876543210",
  "pdf_path": "output/prescriptions/Rahul_Sharma_2026-07-15_10-35.pdf"
}
```

---

# Future Improvements

The MVP stores only the essential information.

Possible future enhancements:

- Separate collections for doctors and patients.
- Search prescriptions by patient name.
- Filter by consultation date.
- Edit prescription history.
- Soft delete instead of permanent delete.
- Upload PDFs to cloud storage.
- Store consultation audio.
- Analytics and reporting.

---

# Summary

### Input

Approved prescription JSON + PDF path

↓

### Processing

Connect to MongoDB Atlas

↓

Save prescription document

↓

Return success

↓

### Output

Prescription stored in MongoDB and patient details passed to Agent 5