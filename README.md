# 🩺 ScriptIQ: World-Class Agentic AI Prescription & Pharmacy POS Suite

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**ScriptIQ** is an enterprise-grade, privacy-first **Agentic AI Medical Consultation & Pharmacy POS Platform**. Powered by a multi-agent orchestration architecture, ScriptIQ allows doctors to convert natural clinical dialogue into structured, compliant digital prescriptions in **under 3 seconds** while automatically bridging pharmacy fulfillment, thermal receipt printing, and omni-channel patient delivery.

---

## 🌟 Key Platform Capabilities

* **🎙️ Multimodal Clinical Speech-to-Text (`SpeechAgent`)**: Transcribes English, Hindi, and Hinglish clinical speech in real-time using Gemini 2.0 Multimodal Audio + localized Whisper (`small` model) with medical vocabulary injection (`Dolo 650`, `Pan 40`, `PCM`, `TDS`).
* **🧠 Multi-Model Fallback Chain (`PrescriptionAgent`)**: Extracts validated JSON schemas using an intelligent multi-model fallback chain (`gemini-2.0-flash` → `gemma-4-26b-a4b-it` → regex heuristic parser) ensuring <3 second latency and 0% downtime.
* **🔒 DOB Password Encrypted PDF Generation (`PDFAgent`)**: Produces high-resolution ReportLab PDFs formatted with customized clinic letterheads, doctor credentials, and patient demographics tables (`Age / Gender: 50 Yrs / Female`) protected with Date-of-Birth password encryption (`StandardEncryption`).
* **🧾 In-House Pharmacy POS & 80mm Thermal Printing (`ReceiptsManagementPage`)**: Complete Point-of-Sale billing workspace featuring itemized medicine cart, 5% GST tax calculation, 0-50% discount overrides, 1-Click `⚡ Load Recent Prescription` pre-loader, Indian UPI QR generator, and scoped 80mm thermal receipt print engine.
* **🌐 Standalone Official Receipt View (`ReceiptViewPage`)**: Branded receipt view URL (`/receipt/:orderId`) with hospital letterhead header, system verification stamp, authorized doctor signature, and scoped A4 print isolation (`?autoprint=true`).
* **⚡ Dockable Real-Time Telemetry Console (`AutoPilotTelemetryConsole`)**: Sidebar-dockable live telemetry drawer broadcasting step-by-step master agent reasoning (`Step 1/7` to `Step 7/7`) over WebSockets.
* **📱 Omni-Channel Digital Dispatch (`EmailAgent` & `PushAgent`)**: Dispatches DOB-password-encrypted prescription PDFs via Gmail SMTP TLS (`saksham2435157@gmail.com`) and lock-screen Web Push notifications to patient smartphones.
* **⚠️ Clinical Safety & Drug Interaction Engine (`DrugInteractionBanner`)**: Real-time safety checks warning against multi-NSAID co-prescribing, dual antibiotics, or missing PPI gastric protection.

---

## 🏗️ Master Agent System Architecture

```mermaid
flowchart TD
    subgraph Input [1. Clinical Audio & Intake]
        A[Doctor Voice Input / Audio Mic] -->|Audio Stream| B(SpeechAgent STT)
        A2[Patient Intake Space] -->|Typed/Voice Intake| B
    end

    subgraph Orchestrator [2. Master Agent Telemetry Pipeline]
        B -->|Raw Transcript| C{MasterAgent Orchestrator}
        C -->|Step 1/7: STT| D[PrescriptionAgent Extraction]
        D -->|Multi-Model Fallback| E[Gemini 2.0 Flash / Gemma 4]
        E -->|Validated JSON Schema| F[Doctor Console Draft Editor]
    end

    subgraph Output [3. Fulfillment & Omni-Channel Delivery]
        F -->|Doctor Approval| G(PDFAgent)
        G -->|DOB Encrypted PDF| H[(MongoDB Atlas)]
        H -->|Auto-Bridge| I(Pharmacy POS Engine)
        H -->|SMTP TLS| J(EmailAgent)
        H -->|VAPID Push| K(PushAgent)
        I -->|80mm Thermal Print| L[Hospital Counter #1 POS]
        J -->|Encrypted Email| M[Patient Inbox]
        K -->|Lock-Screen Alert| N[Patient Smartphone]
    end
```

---

## 💻 Workspaces & Application Routes

| Workspace Name | Route | Target User | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Doctor Consultation Console** | [`/console`](file:///s:/AI-prescription-agent/ui/src/pages/DoctorConsolePage.tsx) | Doctor | 3-Pane clinical layout (`WaveformSpine`, `LiveTranscriptPanel`, `DraftPanel`), zero-scroll 100vh viewport, patient intake space. |
| **Patient Receipts & POS Portal** | [`/receipts`](file:///s:/AI-prescription-agent/ui/src/pages/ReceiptsManagementPage.tsx) | Pharmacist / Staff | POS billing cart, 5% GST, discounts, 1-Click `⚡ Load Recent Prescription`, UPI QR code generator, 80mm thermal print isolation. |
| **Standalone Official Receipt** | [`/receipt/:orderId`](file:///s:/AI-prescription-agent/ui/src/pages/ReceiptViewPage.tsx) | Patient / Doctor | Branded receipt view URL (`PHARM-XXXX`) with hospital letterhead, doctor credentials, system stamp, signature, and A4 print isolation (`?autoprint=true`). |
| **Clinical History & Audit Trail** | [`/history`](file:///s:/AI-prescription-agent/ui/src/pages/HistoryPage.tsx) | Doctor / Admin | Searchable audit log with Age/Gender badges (`50 Yrs / Female`), dual-tab prescription vs. raw transcript views, CSV export, batch deletion. |
| **Patient Directory & Dossier** | [`/patients`](file:///s:/AI-prescription-agent/ui/src/pages/PatientsPage.tsx) | Doctor / Admin | Central patient directory, consultation history timelines, and 1-click patient health dossier inspection. |
| **Operations Dashboard** | [`/dashboard`](file:///s:/AI-prescription-agent/ui/src/pages/DashboardPage.tsx) | Admin | Real-time consultation analytics, sub-agent pipeline health monitors, recent consultation logs, and system status gauges. |
| **System & Letterhead Settings** | [`/settings`](file:///s:/AI-prescription-agent/ui/src/pages/SettingsPage.tsx) | Admin / Doctor | 5-tab settings application covering Profile, PDF Letterhead Customization (with live canvas preview), Email SMTP, Push Notifications, and Receipt Template settings. |
| **Patient Self-Service Portal** | [`/patient`](file:///s:/AI-prescription-agent/ui/src/pages/PatientPortal.tsx) | Patient | Self-service dashboard with OTP login, active prescription timeline, visual time-of-day medication schedule, and 1-click DOB password unlock. |

---

## 🛠️ Technology Stack

```
AI-prescription-agent/
├── server.py                   # FastAPI ASGI backend, REST APIs & WebSockets (/ws/transcript, /ws/master_agent)
├── ai_prescription_agent.py     # Master Orchestrator Pipeline (7-Step Telemetry Workflow)
├── auth.py                     # Standard-library HMAC-SHA256 JWT & RBAC Engine
├── push_agent.py               # VAPID Web Push Notification Engine (pywebpush)
├── agents/                     # AI Sub-Agent Microservices
│   ├── speech_agent.py         # Gemini Multimodal Audio STT & Local Whisper Parser
│   ├── prescription_agent.py   # Multi-Model Fallback LLM Structured JSON Extractor
│   ├── pdf_agent.py            # ReportLab PDF Generator with DOB Password Encryption
│   ├── database_agent.py       # MongoDB Atlas CRUD Collections Helper
│   ├── email_agent.py          # Gmail SMTP TLS HTML Email Dispatcher
│   └── pharmacy_agent.py       # In-House Pharmacy POS Receipt Formatter
├── database/
│   └── db_helper.py            # Thread-Safe PyMongo Shared Connection Pool
└── ui/                         # Frontend SPA Application
    ├── src/pages/              # 10 Full Application Workspaces
    ├── src/components/         # 25+ Modular UI Components (draft, telemetry, layout, recording, delivery, ui)
    ├── src/store/              # Zustand Stores (draftStore, recordingStore, authStore, uiStore)
    └── src/hooks/              # Custom React Hooks & Type-Safe API Client
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Python**: `3.10` or higher
- **Node.js**: `18.0` or higher
- **MongoDB**: Atlas Cluster or local MongoDB instance

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/Saksham3736/scriptiq.git
cd scriptiq

# Create and activate Python virtual environment
python -m venv .venv
.venv\Scripts\activate  # On Linux/Mac: source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Credentials
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=ai_prescription

# AI Model Credentials
GEMINI_API_KEY=your_google_gemini_api_key

# Authentication & Encryption
JWT_SECRET_KEY=your_secure_jwt_secret_key

# Email SMTP Credentials
SMTP_EMAIL=saksham2435157@gmail.com
SMTP_PASSWORD=your_gmail_app_password
```

### 3. Launch Backend API Server

```bash
.venv\Scripts\python.exe -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```
*Backend interactive REST API documentation will be live at `http://localhost:8000/docs`.*

### 4. Frontend SPA Setup & Launch

Open a second terminal window:

```bash
cd ui
npm install
npm run dev
```
*Frontend clinical dashboard will be live at `http://localhost:5173`.*

---

## 📊 Comprehensive System Documentation

For in-depth architectural specifications and implementation roadmaps, refer to:

- 📄 **[availability_of_features.md](file:///s:/AI-prescription-agent/availability_of_features.md)** — Complete 4-part file-by-file feature inventory.
- 📋 **[index.new.md](file:///s:/AI-prescription-agent/index.new.md)** — Master 53-phase chronological development index.
- 📈 **[progress.md](file:///s:/AI-prescription-agent/progress.md)** — Detailed project progress and milestone log.
- 🧠 **[brain.md](file:///s:/AI-prescription-agent/brain.md)** — System architecture log and technical decisions.

---

## 📜 License & Privacy Compliance

ScriptIQ is distributed under the MIT License. Built to comply with global healthcare privacy standards (HIPAA / Telemedicine Guidelines 2020) via mandatory Date-of-Birth PDF encryption and zero-trace audio streaming.
