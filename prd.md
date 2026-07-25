# Product Requirements Document (PRD)

<!-- Add your UI & Product Requirements context here -->

# Product Requirements Document (PRD)
## AI Prescription Agent — "ScriptIQ"

**Version:** 1.0
**Status:** Draft for review
**Owner:** Product/Engineering
**Last updated:** July 24, 2026

---

## 1. Overview

ScriptIQ is an AI-powered clinical assistant that lets a doctor speak or type during a consultation and walks that input all the way through to a finished, saved, and delivered prescription — with a printable/shareable medicine receipt — without the doctor having to manually type a structured prescription.

**Core idea:** Doctor talks → Master Agent listens → Transcript generated → Transcript parsed into structured clinical data → Prescription drafted → Doctor reviews/edits → Prescription saved to MongoDB → Prescription + receipt sent to patient.

### 1.1 Problem statement
Doctors spend significant time on manual prescription writing, which is:
- Slow, repetitive, and interrupts doctor-patient eye contact/conversation
- Prone to illegible handwriting or inconsistent formatting (paper-based clinics)
- Disconnected from patient records — no easy digital trail
- Hard to share instantly with patients or pharmacies

### 1.2 Solution
A single "Master Agent" conversational interface that:
1. Accepts **voice or text** input from the doctor during/after a consultation
2. Converts speech to an accurate **transcript**
3. Runs the transcript through an **NLP/LLM pipeline** to extract clinical entities (symptoms, diagnosis, medicines, dosage, frequency, duration, advice, follow-up)
4. Generates a **structured, editable prescription draft**
5. On doctor confirmation, **saves the prescription to MongoDB**
6. **Sends the prescription** to the patient (app notification / email / SMS / WhatsApp)
7. Generates an accompanying **medicine receipt/bill** (itemized medicines, cost if applicable, pharmacy details)

---

## 2. Goals & Non-Goals

### 2.1 Goals
- Reduce prescription creation time from minutes to under 30 seconds of doctor review
- Achieve >95% transcription accuracy for common clinical vocabulary (English + Hindi/Punjabi mixed speech, given target geography)
- Ensure every prescription is structured, stored, auditable, and retrievable
- Give doctors full control to review/edit before anything is finalized or sent
- Provide patients instant, easy-to-read digital access to their prescription and a receipt
- Maintain data privacy/security suitable for medical records

### 2.2 Non-Goals (v1)
- Not building a full EMR/EHR system (only prescription-focused workflow)
- Not handling insurance claims or payment processing
- Not replacing pharmacy inventory/billing systems (receipt is informational, not a POS system)
- Not providing diagnostic decision-making — the AI assists documentation, it does not replace clinical judgment

---

## 3. Target Users

| User | Description | Key Needs |
|---|---|---|
| **Doctor** | Primary user; dictates or types notes during/after consultation | Speed, accuracy, easy correction, minimal clicks |
| **Patient** | Receives prescription + receipt | Clarity, easy access on phone, medicine instructions |
| **Clinic Admin / Receptionist** | Manages patient records, may assist doctor with corrections | Search, history, export |
| **Pharmacist** (future) | May receive medicine receipt to fulfill order | Clear itemized list, dosage, quantity |

---

## 4. Core User Flow (End-to-End)

```
[Doctor speaks or types]
        ↓
[Master Agent captures audio/text]
        ↓
[Speech-to-Text Engine → Raw Transcript]
        ↓
[Transcript Cleanup / Diarization (doctor vs patient speech, if consult recording)]
        ↓
[NLU/LLM Extraction Engine]
    → Patient details (if mentioned/linked)
    → Symptoms & complaints
    → Diagnosis
    → Medicines (name, dosage, frequency, duration, route)
    → Advice / lifestyle notes
    → Follow-up date
        ↓
[Structured Prescription Draft generated]
        ↓
[Doctor Review Screen — edit any field, confirm/reject AI suggestions]
        ↓
[Doctor clicks "Confirm & Save"]
        ↓
   ┌─────────────┴─────────────┐
   ↓                           ↓
[Saved to MongoDB]     [Medicine Receipt generated]
   ↓                           ↓
   └─────────────┬─────────────┘
                 ↓
   [Sent to Patient — in-app / email / SMS / WhatsApp]
                 ↓
   [Prescription appears in Patient History + Doctor's Records]
```

---

## 5. Functional Requirements

### 5.1 Master Agent (Input Capture)
- FR-1.1: Accept **voice input** via microphone with start/stop/pause recording controls
- FR-1.2: Accept **text input** as an alternative or supplement (typed notes)
- FR-1.3: Real-time waveform/visual feedback while recording
- FR-1.4: Support recording pause/resume without losing session
- FR-1.5: Allow doctor to attach a patient profile (search existing or create new) before/after dictation
- FR-1.6: Support multi-language speech input (English, Hindi, Punjabi — configurable)

### 5.2 Transcription
- FR-2.1: Convert voice to text in near real-time (streaming) with a finalized transcript on stop
- FR-2.2: Display live transcript as doctor speaks (scrolling captions)
- FR-2.3: Allow manual correction of transcript text before processing
- FR-2.4: Timestamp segments for traceability
- FR-2.5: Store raw transcript alongside structured output for audit

### 5.3 AI Processing / Extraction
- FR-3.1: Parse transcript into structured fields:
  - Chief complaints / symptoms
  - Diagnosis / clinical impression
  - Medicines: name, strength, dosage, frequency, duration, timing (before/after food), route
  - Investigations/tests advised
  - General advice / precautions
  - Follow-up date/interval
- FR-3.2: Flag low-confidence extractions visually (e.g., highlighted in amber) for doctor attention
- FR-3.3: Suggest standard drug names from a medicine database (autocomplete/validation) to catch mis-transcriptions
- FR-3.4: Detect potential drug interactions or dosage anomalies and warn doctor (soft warning, non-blocking)

### 5.4 Prescription Draft & Review
- FR-4.1: Present an editable, structured prescription form pre-filled from AI extraction
- FR-4.2: Doctor can add/remove/edit any medicine row, symptom, or note
- FR-4.3: Doctor can regenerate AI draft from transcript if unsatisfied
- FR-4.4: Clinic/doctor letterhead, registration number, signature (digital) included on final prescription
- FR-4.5: Version history retained if prescription is edited after generation

### 5.5 Save & Storage (MongoDB)
- FR-5.1: On confirmation, save structured prescription document to MongoDB with:
  - Patient reference, doctor reference, timestamp
  - Raw transcript + structured fields
  - Status (draft/finalized/sent)
- FR-5.2: All records timestamped and versioned; never hard-deleted (soft delete/archive only)
- FR-5.3: Support fast retrieval by patient, doctor, date range, or medicine name

### 5.6 Send to Patient
- FR-6.1: Send finalized prescription via chosen channel(s): in-app notification, email (PDF attached), SMS link, WhatsApp
- FR-6.2: Patient-facing prescription view: clean, readable, mobile-first, with medicine schedule reminders (optional toggle)
- FR-6.3: Delivery status tracking (sent/delivered/viewed)

### 5.7 Medicine Receipt
- FR-7.1: Auto-generate itemized medicine receipt from the prescription (name, quantity, dosage duration → computed quantity, unit price if configured, total)
- FR-7.2: Downloadable/shareable as PDF
- FR-7.3: Optionally routable to a linked/partner pharmacy
- FR-7.4: Clinic branding + consultation fee line (optional, configurable)

### 5.8 History & Search
- FR-8.1: Doctor dashboard listing recent consultations/prescriptions with search/filter
- FR-8.2: Patient prescription history view (their own record)
- FR-8.3: Full-text search across transcripts and structured fields

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Transcript should stream with <1.5s latency; full prescription draft generated within 5s of stopping dictation |
| **Accuracy** | ≥95% word accuracy for clinical speech; medicine name validation against a standard drug database |
| **Security** | End-to-end encryption in transit (TLS); encryption at rest for MongoDB; role-based access control (Doctor/Admin/Patient) |
| **Compliance** | Design with HIPAA-equivalent / India's DPDP Act & telemedicine guideline principles in mind — audit logs, consent capture, data minimization |
| **Availability** | 99.5% uptime target for core prescription flow |
| **Scalability** | Support concurrent multi-doctor usage in a clinic; horizontal scaling of transcription/AI service |
| **Accessibility** | WCAG 2.1 AA — keyboard navigable, screen-reader labels, sufficient contrast |
| **Auditability** | Every prescription traceable to raw transcript + AI confidence scores + edit history |

---

## 7. System Actors & Permissions

| Role | Permissions |
|---|---|
| Doctor | Create/edit/finalize/send prescriptions; view own patients' history |
| Admin/Receptionist | Manage patient records, view prescription status, resend |
| Patient | View/download own prescriptions & receipts only |
| Pharmacist (future) | View receipts routed to them; mark fulfilled |

---

## 8. High-Level Tech Assumptions
- Frontend: React (web) — this document's UI is being designed for React
- Backend: Node.js/Express or similar, MongoDB as primary data store
- Speech-to-Text: Cloud STT engine (e.g., Whisper-based or provider API) with medical vocabulary tuning
- NLU/Extraction: LLM-based structured extraction (JSON schema-constrained output)
- Notifications: Email/SMS/WhatsApp Business API integration
- PDF Generation: Server-side rendering for prescription/receipt PDFs

---

## 9. Success Metrics (KPIs)
- Average time from "stop recording" to "prescription sent": target < 45 seconds
- Doctor edit rate per prescription (lower = better AI accuracy): target < 15% fields edited
- Patient open/view rate of sent prescriptions: target > 90%
- Transcription word error rate: target < 5%
- Doctor satisfaction (CSAT) on speed vs. manual writing: target > 4.5/5

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Mis-transcribed medicine names → dosage errors | Drug-name validation against database + doctor mandatory review step before send |
| Doctor over-trusts AI draft, skips review | Require explicit "Confirm & Save" action; highlight AI-generated fields distinctly until confirmed |
| Data privacy breach of medical records | Encryption, RBAC, audit logs, minimal data retention policy |
| Poor accuracy with accents/background noise (clinic environment) | Noise-cancellation preprocessing, manual transcript correction always available |
| Patient doesn't receive prescription (bad number/email) | Multi-channel delivery + in-app fallback + delivery status tracking |

---

## 11. Out of Scope for v1
- Video consultation integration
- Insurance/claims processing
- Full pharmacy inventory management
- Multi-clinic franchise management dashboard

---

## 12. Open Questions
- Which STT/LLM providers are approved for medical data (compliance review needed)?
- Is WhatsApp Business API available/approved for the target region?
- Will medicine pricing be manually configured per clinic or pulled from a pharmacy API?
- Single-doctor clinic vs. multi-doctor hospital — does v1 need multi-clinic tenancy?

---

