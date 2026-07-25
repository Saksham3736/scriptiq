# AI Prescription Assistant

## Project Overview

### Project Name

AI Prescription Assistant

---

## Objective

The AI Prescription Assistant is an Agentic AI application designed to help doctors create digital prescriptions using voice commands.

Instead of writing prescriptions manually, the doctor simply speaks during the consultation. The system converts the conversation into text, extracts the required medical information, generates a professional prescription, stores it securely, and shares it with the patient.

The goal is to reduce paperwork, save consultation time, and maintain digital medical records.

---

# Project Workflow

```
Doctor Consultation
        │
        ▼
Speech Agent
(Convert Speech to Text)
        │
        ▼
Prescription Agent
(Generate Structured Prescription)
        │
        ▼
Doctor Reviews Prescription
        │
        ▼
PDF Agent
(Create Professional Prescription PDF)
        │
        ▼
Database Agent
(Save Prescription)
        │
        ├───────────────┐
        ▼               ▼
WhatsApp Agent     Pharmacy Agent
```

---

# Tech Stack

## Frontend

- Streamlit

---

## Backend

- Python

---

## AI Model

- Gemini API

---

## Database

- MongoDB Atlas

---

## PDF Generation

- ReportLab

---

## Speech to Text

- Faster Whisper

---

## WhatsApp

- Meta WhatsApp Cloud API
(or Twilio WhatsApp API)

---

# Project Folder Structure

```
AI-Prescription-Agent/

│
├── app.py
├── config.py
├── requirements.txt
├── .env
│
├── agents/
│   ├── speech_agent.py
│   ├── prescription_agent.py
│   ├── pdf_agent.py
│   ├── database_agent.py
│   ├── whatsapp_agent.py
│   └── pharmacy_agent.py
│
├── templates/
│   └── doctor_letterhead.html
│
├── assets/
│   ├── hospital_logo.png
│   ├── doctor_signature.png
│   └── doctor_stamp.png
│
├── database/
│   └── mongodb.py
│
├── output/
│   └── prescriptions/
│
└── docs/
    ├── 00-project-overview.md
    ├── 01-agent-1-speech.md
    ├── 02-agent-2-prescription.md
    ├── 03-agent-3-pdf.md
    ├── 04-agent-4-database.md
    ├── 05-agent-5-whatsapp.md
    └── 06-agent-6-pharmacy.md
```

---

# Agents Overview

## Agent 1 — Speech Agent

### Responsibility

- Listen to the doctor's voice.
- Convert speech into text.
- Display the live transcript.
- Pass the transcript to the Prescription Agent.

**Input**

- Doctor's voice

**Output**

- Conversation transcript

---

## Agent 2 — Prescription Agent

### Responsibility

- Understand the transcript.
- Extract diagnosis.
- Extract medicines.
- Extract dosage.
- Extract duration.
- Generate a structured prescription.

**Input**

- Conversation transcript

**Output**

- Structured prescription data

---

## Agent 3 — PDF Agent

### Responsibility

- Generate a professional prescription.
- Add doctor's details.
- Add hospital logo.
- Add doctor's signature.
- Add doctor's stamp.
- Export as PDF.

**Input**

- Structured prescription

**Output**

- PDF Prescription

---

## Agent 4 — Database Agent

### Responsibility

- Save patient details.
- Save prescription.
- Save PDF path.
- Retrieve prescription history.

**Input**

- Prescription data

**Output**

- MongoDB Record

---

## Agent 5 — WhatsApp Agent

### Responsibility

- Send prescription PDF to the patient.
- Send a confirmation message.

**Input**

- Patient phone number
- PDF

**Output**

- WhatsApp delivery

---

## Agent 6 — Pharmacy Agent

### Responsibility

- Send the prescription to the hospital pharmacy if the patient chooses to purchase medicines from the hospital.

**Input**

- Prescription

**Output**

- Pharmacy order

---

# Development Phases

## Phase 1

Build the Speech Agent.

---

## Phase 2

Build the Prescription Agent.

---

## Phase 3

Generate the PDF.

---

## Phase 4

Store the prescription in MongoDB Atlas.

---

## Phase 5

Send the prescription via WhatsApp.

---

## Phase 6

Send the prescription to the hospital pharmacy.

---

# MVP Goals

The first version of the project should be able to:

- Record the doctor's speech.
- Convert speech to text.
- Generate a structured prescription using Gemini.
- Allow the doctor to review the prescription.
- Generate a professional PDF.
- Save the prescription in MongoDB Atlas.
- Send the prescription to the patient through WhatsApp.
- Optionally send the prescription to the hospital pharmacy.

---

# Future Enhancements

The MVP is intentionally simple.

Possible future improvements include:

- Patient history analysis
- Drug interaction checking
- Allergy detection
- OCR for handwritten prescriptions
- Lab report integration
- Multi-language support
- Voice editing commands
- Analytics dashboard
- Doctor login system
- Hospital management integration
- Electronic Health Record (EHR) support

---

# Project Philosophy

This project follows a simple modular architecture.

Each agent has a single responsibility and can be developed, tested, and improved independently.

The focus of the MVP is to create a working end-to-end system before adding advanced AI workflows or production-level optimizations.