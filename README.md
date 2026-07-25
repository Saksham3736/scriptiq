# 🩺 AI Prescription Assistant

An Agentic AI application designed to help doctors generate digital prescriptions using voice commands during consultation, structure medical records with Gemini AI, render printable ReportLab PDFs, persist documents in MongoDB Atlas, deliver prescriptions to patients via Meta WhatsApp Cloud API, and fulfill orders with the in-house hospital pharmacy.

---

## 🌟 Key Features

* **🎙️ Agent 1: Speech Agent (`agents/speech_agent.py`)** — Audio recording via `sounddevice`, transcription via `faster-whisper`, and medical text cleanup using Gemini API.
* **📝 Agent 2: Prescription Agent (`agents/prescription_agent.py`)** — Pydantic schema validation (`PrescriptionSchema`) and Gemini API structured output extraction (diagnosis, medicines list, dosage, duration, general advice, follow-up).
* **📄 Agent 3: PDF Agent (`agents/pdf_agent.py`)** — Printable prescription PDF document generation using `reportlab` with doctor letterhead, patient table, and signature block.
* **💾 Agent 4: Database Agent (`agents/database_agent.py`)** — MongoDB Atlas database persistence and patient consultation history search.
* **🚀 Agent 5: WhatsApp Agent (`agents/whatsapp_agent.py`)** — E.164 phone validation, PDF attachment verification, Meta WhatsApp Cloud API delivery, and simulation fallback mode.
* **🏥 Agent 6: Pharmacy Agent (`agents/pharmacy_agent.py`)** — In-house hospital pharmacy inventory matching (`INVENTORY_CATALOG`), item stock status, total INR pricing, and pharmacy order fulfillment.
* **💻 Main Streamlit Dashboard (`app.py`)** — Unified step-by-step doctor workspace UI with live system status badges and patient search drawer.

---

## 🏗️ Project Architecture

```
Doctor Consultation Voice Input
         │
         ▼
[ Speech Agent (Agent 1) ] ──► Whisper & Gemini Text Cleaning
         │
         ▼
[ Prescription Agent (Agent 2) ] ──► Structured JSON Schema Extraction
         │
         ▼
[ Doctor Review & Approval ]
         │
         ▼
[ PDF Agent (Agent 3) ] ──► Printable PDF Document (ReportLab)
         │
         ▼
[ Database Agent (Agent 4) ] ──► MongoDB Atlas Storage
         │
         ├───────────────────────────────┐
         ▼                               ▼
[ WhatsApp Agent (Agent 5) ]   [ Pharmacy Agent (Agent 6) ]
(Patient Mobile Delivery)      (Hospital Inventory Order)
```

---

## 🛠️ Tech Stack

* **Frontend Dashboard**: React + Vite (TypeScript, CSS Variables, Lucide, WebSockets)
* **Backend API**: FastAPI + Uvicorn (Lifespan Singleton, WebSockets, REST)
* **AI Model**: Google Gemini API (`google-genai` SDK)
* **Speech to Text**: `faster-whisper`
* **Database**: MongoDB Atlas (`pymongo` with query projections)
* **PDF Generation**: ReportLab
* **WhatsApp Cloud API**: Meta Graph API (`requests`)
* **Data Validation**: Pydantic v2

---

## 🚀 Quick Start & Installation

### 1. Clone & Setup Virtual Environment

```powershell
python -m venv .venv
.venv\Scripts\activate
```

### 2. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 3. Environment Configuration (`.env`)

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=Training
DB_NAME=ai_prescription

GEMINI_API_KEY=your_gemini_api_key_here

WHATSAPP_TOKEN=your_whatsapp_token_here
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id_here
```

### 4. Run the FastAPI Backend Server

```powershell
.venv\Scripts\python.exe -m uvicorn server:app --host 0.0.0.0 --port 8000
```

The API server will run on `http://localhost:8000` (Interactive API docs at `http://localhost:8000/docs`).

### 5. Run the React / Vite Web UI Application

```powershell
cd ui
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open your browser at `http://localhost:5173`.

---

## 🧪 Module Testing Suite (`tests/`)

Run standalone test scripts for each agent from the `tests/` directory:

```powershell
# Test Speech Agent
.venv\Scripts\python.exe tests/test_speech.py

# Test Prescription Agent
.venv\Scripts\python.exe tests/test_prescription.py

# Test PDF Agent
.venv\Scripts\python.exe tests/test_pdf.py

# Test Database Agent (MongoDB Atlas)
.venv\Scripts\python.exe tests/test_db_agent.py

# Test WhatsApp Agent
.venv\Scripts\python.exe tests/test_whatsapp_agent.py

# Test Pharmacy Agent
.venv\Scripts\python.exe tests/test_pharmacy_agent.py
```

---

## 📁 Repository Structure

```
AI-Prescription-Assistant/
├── server.py                   # High-Performance FastAPI Backend Server
├── config.py                   # Environment configuration loader
├── requirements.txt            # Python dependencies
├── .env                        # Local environment variables
│
├── ui/                         # Production React + Vite Web App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.ts
│
├── agents/                     # All 6 AI Agents Package
│   ├── __init__.py
│   ├── speech_agent.py
│   ├── prescription_agent.py
│   ├── pdf_agent.py
│   ├── database_agent.py
│   ├── whatsapp_agent.py
│   └── pharmacy_agent.py
│
├── tests/                      # Unit & Integration Test Suite
├── database/                   # MongoDB Connection Helper
├── templates/                  # Letterhead HTML templates
├── assets/                     # Hospital branding assets
└── output/                     # Generated PDFs & Audio output
```
