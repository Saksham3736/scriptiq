# Agent 3 — PDF Agent

## Overview

The PDF Agent is responsible for converting the approved prescription into a professional prescription document.

It receives the structured prescription from the Prescription Agent, places the information into the doctor's letterhead, adds the doctor's signature and stamp, and generates a printable PDF.

> **Important:** This agent does **not** modify any medical information. It only formats the approved prescription.

---

# Objective

Generate a clean, professional, and printable prescription PDF.

---

# Workflow

```
Receive Prescription JSON
          │
          ▼
Load Doctor Letterhead
          │
          ▼
Fill Patient Details
          │
          ▼
Add Medicines
          │
          ▼
Add Doctor Signature & Stamp
          │
          ▼
Generate PDF
          │
          ▼
Save PDF
          │
          ▼
Send PDF Path to Database Agent
```

---

# Responsibilities

The PDF Agent should:

- Read the approved prescription.
- Load the doctor's letterhead template.
- Display patient information.
- Display diagnosis.
- Display medicine list.
- Display investigations (if any).
- Display general advice.
- Display follow-up details.
- Add doctor's digital signature.
- Add doctor's stamp.
- Generate a professional PDF.
- Save the PDF locally.

---

# Input

Structured Prescription JSON.

Example

```json
{
  "patient_name": "Rahul Sharma",
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
  "follow_up": "After 5 Days"
}
```

---

# Output

```
output/prescriptions/

Rahul_Sharma_2026-07-15.pdf
```

---

# Libraries Required

## PDF Generation

```
reportlab
```

Used to generate the PDF.

---

## Date & Time

```
datetime
```

Used to generate the prescription date and unique filename.

---

## File Handling

```
os
```

Used for saving PDFs to the output folder.

---

# Suggested File Structure

```
agents/

pdf_agent.py
```

---

# Required Assets

```
assets/

hospital_logo.png

doctor_signature.png

doctor_stamp.png
```

---

# Template Required

```
templates/

doctor_letterhead.html
```

> **Note:** For the MVP, you can either use a simple ReportLab layout or an HTML template. A basic ReportLab layout is simpler to implement.

---

# Main Functions

## Generate PDF

```python
generate_pdf(prescription_data)
```

Purpose:

Create the prescription PDF.

Returns:

```
PDF Path
```

---

## Save PDF

```python
save_pdf(file_name)
```

Purpose:

Save the generated PDF inside the output folder.

---

## Send to Database Agent

```python
send_to_database(pdf_path)
```

Purpose:

Pass the PDF path along with the prescription data to Agent 4.

---

# Prescription Layout

```
-------------------------------------------------------

              ABC MULTISPECIALITY HOSPITAL

                 Dr. John Doe, MBBS
              Registration No. XXXXXXXX

-------------------------------------------------------

Patient Name : Rahul Sharma

Age          : 24

Gender       : Male

Date         : 15 July 2026

-------------------------------------------------------

Diagnosis

Viral Fever

-------------------------------------------------------

Medicines

-------------------------------------------------------

1.

Medicine:
Dolo 650

Dosage:
Twice Daily

Duration:
5 Days

Instructions:
After Meals

-------------------------------------------------------

General Advice

• Drink plenty of water

-------------------------------------------------------

Follow Up

After 5 Days

-------------------------------------------------------

Doctor Signature



Doctor Stamp

-------------------------------------------------------
```

---

# Streamlit UI

After clicking **Generate PDF**

Display

```
✅ Prescription Generated Successfully

File Name

Rahul_Sharma_2026-07-15.pdf

[ Download PDF ]

[ Save ]

[ Send to Patient ]
```

---

# Naming Convention

Every PDF should have a unique filename.

Example

```
PatientName_Date_Time.pdf
```

Example

```
Rahul_Sharma_2026-07-15_10-35.pdf
```

This avoids duplicate file names.

---

# Validation

Before generating the PDF, verify:

- Patient name exists (or use "Unknown_Patient").
- Medicine list is not empty.
- Doctor signature image exists.
- Doctor stamp image exists.
- Hospital logo exists.
- Output folder is available.

If any asset is missing, notify the doctor and stop PDF generation.

---

# Error Handling

### Missing Signature

```
Doctor signature not found.
```

---

### Missing Stamp

```
Doctor stamp not found.
```

---

### Output Folder Missing

```
Creating output folder...
```

Automatically create the folder if it doesn't exist.

---

### PDF Generation Failed

```
Unable to generate PDF.

Please try again.
```

---

# Example Output

```
output/

prescriptions/

Rahul_Sharma_2026-07-15_10-35.pdf
```

---

# Data Passed to Agent 4

```json
{
  "pdf_path": "output/prescriptions/Rahul_Sharma_2026-07-15_10-35.pdf",
  "prescription": {
    "...": "Approved prescription JSON"
  }
}
```

---

# Future Improvements

The MVP generates a clean prescription PDF.

Possible future enhancements:

- Hospital branding themes.
- QR code for verification.
- Digital signature certificate.
- Watermark support.
- Barcode generation.
- Password-protected PDFs.
- Multi-page prescriptions.
- Automatic page numbering.
- Color themes for different hospitals.

---

# Summary

### Input

Approved Prescription JSON

↓

### Processing

Load letterhead

↓

Fill patient details

↓

Add medicines

↓

Add signature & stamp

↓

Generate PDF

↓

Save PDF

↓

### Output

PDF path and prescription data sent to Agent 4