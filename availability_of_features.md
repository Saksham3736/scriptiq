# 🚀 System Feature Inventory: `availability_of_features.md`

This document provides a comprehensive, file-by-file feature inventory of the entire **ScriptIQ AI Prescription System**.

---

## 🏛️ PART 1: Core Backend Engines, Server APIs & AI Sub-Agents

### 1. Root Backend & Orchestrator Engines

#### ⚡ Master Agent Orchestrator Pipeline
* **File**: [`ai_prescription_agent.py`](file:///s:/AI-prescription-agent/ai_prescription_agent.py)
* **Feature Description**: 
  - Combines all 6 sub-agents (`Speech`, `Prescription`, `PDF`, `Database`, `Email`, `Pharmacy`) into a unified 7-step automated workflow (`run_full_automated_workflow`).
  - Manages the LLM multi-model fallback chain (`gemini-2.0-flash` → `gemma-4-26b-a4b-it` → heuristic fallback) under 3 seconds.
  - Passes patient demographics (`name`, `age`, `gender`, `phone`, `dob`, `email`) across all stages without dropping fields.
  - Emits real-time WebSocket telemetry progress events (`emit_telemetry`) to the frontend console.

#### 🌐 FastAPI Production Server & REST API Hub
* **File**: [`server.py`](file:///s:/AI-prescription-agent/server.py)
* **Feature Description**:
  - Serves 20+ REST API endpoints for consultation processing, prescription approval, pharmacy receipts, patient notifications, letterhead settings, and authentication.
  - Houses two real-time WebSockets: `/ws/transcript` (for audio STT streaming) and `/ws/master_agent` (for live telemetry streaming).
  - Enforces Pydantic request models (`ProcessConsultationRequest`, `ApprovePrescriptionRequest`, `PharmacyReceiptRequest`) with strict demographic field validation.
  - Exposes `GET /api/consultations/recent` for 1-click POS receipt loading.

#### 🔒 JWT Security & Authentication Engine
* **File**: [`auth.py`](file:///s:/AI-prescription-agent/auth.py)
* **Feature Description**:
  - Standard-library HMAC-SHA256 JWT token generation, verification, and password hashing without external binary dependencies.
  - Enforces Role-Based Access Control (RBAC) across `doctor`, `admin`, and `patient` user roles.

#### 📲 Web Push Notification Engine
* **File**: [`push_agent.py`](file:///s:/AI-prescription-agent/push_agent.py)
* **Feature Description**:
  - VAPID key generator and browser Web Push notification dispatcher (`pywebpush`).
  - Sends lock-screen phone alerts to patient smartphones when prescriptions or pharmacy receipts are generated.

#### ⚙️ Global Project Configuration & Path Constants
* **File**: [`config.py`](file:///s:/AI-prescription-agent/config.py)
* **Feature Description**:
  - Centralized environment variable loader (`.env`), directory paths (`output/prescriptions`, `output/receipts`), and Gemini API model preferences.

---

### 2. AI Sub-Agents (`agents/`)

#### 🎙️ Speech Recognition Sub-Agent
* **File**: [`agents/speech_agent.py`](file:///s:/AI-prescription-agent/agents/speech_agent.py)
* **Feature Description**:
  - Multimodal Gemini audio STT parser and local Whisper (`small` model) audio transcript decoder.
  - Supports English, Hindi, and Hinglish clinical speech with automated term translation and medical vocabulary injection (e.g. `Dolo 650`, `Pan 40`, `PCM`, `TDS`).

#### 📝 Structured Prescription Extraction Sub-Agent
* **File**: [`agents/prescription_agent.py`](file:///s:/AI-prescription-agent/agents/prescription_agent.py)
* **Feature Description**:
  - Extracts structured JSON prescriptions (medicines, strength, dosage, frequency, duration, precautions, tests, follow-up, age, gender, complaints) from consultation transcripts.
  - Includes regex heuristic fallback parser when LLM generation is unavailable or rate-limited.

#### 📄 ReportLab PDF Generation Sub-Agent
* **File**: [`agents/pdf_agent.py`](file:///s:/AI-prescription-agent/agents/pdf_agent.py)
* **Feature Description**:
  - Generates high-resolution, print-ready PDF prescriptions featuring custom clinic letterheads, doctor credentials, and patient demographics tables (`Age / Gender: {age} Yrs / {gender}`).
  - Enforces automatic patient DOB password encryption (`StandardEncryption`) on all PDF exports.

#### 🗄️ Database Storage Sub-Agent
* **File**: [`agents/database_agent.py`](file:///s:/AI-prescription-agent/agents/database_agent.py)
* **Feature Description**:
  - MongoDB Atlas collection helper managing CRUD operations for `prescriptions`, `pharmacy_orders`, `settings`, and `users`.

#### 📧 HTML Email Dispatch Sub-Agent
* **File**: [`agents/email_agent.py`](file:///s:/AI-prescription-agent/agents/email_agent.py)
* **Feature Description**:
  - Production Gmail SMTP TLS email dispatcher (`saksham2435157@gmail.com`).
  - Sends styled HTML prescription emails with DOB-password-encrypted PDF attachments to patients and hospital desks.

#### 🛒 In-House Pharmacy Dispatch Sub-Agent
* **File**: [`agents/pharmacy_agent.py`](file:///s:/AI-prescription-agent/agents/pharmacy_agent.py)
* **Feature Description**:
  - Formats pharmacy purchase receipts (`PHARM-YYYYMMDD-XXXX`) and dispatches dispense alerts to hospital medical desk counter 1/2.

---

### 3. Database Connection Helper (`database/`)

#### 🔌 Shared MongoDB Connection Pool Helper
* **File**: [`database/db_helper.py`](file:///s:/AI-prescription-agent/database/db_helper.py)
* **Feature Description**:
  - Thread-safe PyMongo connection manager handling database handles, collection selections, and CRUD operations.

---

## 💻 PART 2: Frontend SPA Application Pages (`ui/src/pages/`)

#### 🩺 Doctor Consultation Console Page
* **File**: [`ui/src/pages/DoctorConsolePage.tsx`](file:///s:/AI-prescription-agent/ui/src/pages/DoctorConsolePage.tsx)
* **Feature Description**:
  - 3-Pane clinical interface combining Audio Recording (`WaveformSpine`), Live Transcript (`LiveTranscriptPanel`), and Editable Prescription Draft (`DraftPanel`).
  - Features zero-scroll 100vh viewport fitting and real-time WebSocket connection handling.

#### 📊 Control Center Operations Dashboard Page
* **File**: [`ui/src/pages/DashboardPage.tsx`](file:///s:/AI-prescription-agent/ui/src/pages/DashboardPage.tsx)
* **Feature Description**:
  - Real-time consultation analytics, sub-agent pipeline health monitors, recent consultation logs, and system status gauges.

#### 📜 Consultation Clinical History & Audit Trail Page
* **File**: [`ui/src/pages/HistoryPage.tsx`](file:///s:/AI-prescription-agent/ui/src/pages/HistoryPage.tsx)
* **Feature Description**:
  - Searchable list of past consultations with Age & Gender badges (`50 Yrs / Female`), dual-tab prescription vs. raw transcript views, CSV export, and GitHub-style batch deletion safeguard.

#### 👥 Patient Directory & Clinical Dossier Hub Page
* **File**: [`ui/src/pages/PatientsPage.tsx`](file:///s:/AI-prescription-agent/ui/src/pages/PatientsPage.tsx)
* **Feature Description**:
  - Interactive directory of registered patients, consultation history timelines, and 1-click patient dossier modal inspection.

#### 🧾 In-House Pharmacy & POS Suite Page
* **File**: [`ui/src/pages/ReceiptsManagementPage.tsx`](file:///s:/AI-prescription-agent/ui/src/pages/ReceiptsManagementPage.tsx)
* **Feature Description**:
  - Point-of-Sale billing workspace with itemized medicine cart, 5% GST tax calculation, 0-50% discount overrides, 1-Click `⚡ Load Recent Prescription` pre-loader, Indian UPI QR generator, batch deletion, and isolated 80mm thermal receipt printer engine.

#### 🌐 Standalone Official Patient Receipt View Page
* **File**: [`ui/src/pages/ReceiptViewPage.tsx`](file:///s:/AI-prescription-agent/ui/src/pages/ReceiptViewPage.tsx)
* **Feature Description**:
  - Standalone branded receipt view URL (`/receipt/:orderId`). Renders hospital letterhead header, doctor credentials, patient info, itemized table, hospital verification stamp, doctor signature, and scoped A4 print isolation (`?autoprint=true`).

#### 📄 Standalone Prescription PDF Preview Page
* **File**: [`ui/src/pages/PrescriptionViewPage.tsx`](file:///s:/AI-prescription-agent/ui/src/pages/PrescriptionViewPage.tsx)
* **Feature Description**:
  - Web viewer URL (`/prescription/:id`) displaying official PDF letterhead prescriptions with 1-click print and download buttons.

#### ⚙️ 5-Tab Application & Letterhead Settings Page
* **File**: [`ui/src/pages/SettingsPage.tsx`](file:///s:/AI-prescription-agent/ui/src/pages/SettingsPage.tsx)
* **Feature Description**:
  - 5-tab settings application covering Profile, PDF Letterhead Customization (with live interactive preview canvas), Email SMTP, Push Notifications, and Thermal Receipt Template settings.

#### 🔑 Authentication & Login Page
* **File**: [`ui/src/pages/LoginPage.tsx`](file:///s:/AI-prescription-agent/ui/src/pages/LoginPage.tsx)
* **Feature Description**:
  - Role selection login portal (`Doctor`, `Admin`, `Patient`) with password eye show/hide toggle and JWT token storage.

#### 📱 Patient Web Portal Suite Page
* **File**: [`ui/src/pages/PatientPortal.tsx`](file:///s:/AI-prescription-agent/ui/src/pages/PatientPortal.tsx)
* **Feature Description**:
  - Patient self-service dashboard with OTP login, active prescription timeline, visual time-of-day medication schedule (🌅 Morning, ☀️ Afternoon, 🌙 Evening), 1-click DOB password unlock, and Web Push toggle.

---

## 🧩 PART 3: Modular UI Components & Feature Sub-Systems (`ui/src/components/`)

### 1. Prescription Draft Sub-System (`ui/src/components/draft/`)

#### 📝 Draft Editor Panel
* **File**: [`ui/src/components/draft/DraftPanel.tsx`](file:///s:/AI-prescription-agent/ui/src/components/draft/DraftPanel.tsx)
* **Feature Description**:
  - Central editable prescription form in Doctor Console. Contains Patient Info grid (Name, Phone, Age, Gender, Email), Diagnosis, Symptoms chips, Medicine list, Tests, and Advice.

#### 🗣️ Voice & Typed Patient Intake Space
* **File**: [`ui/src/components/draft/PatientIntakeSpace.tsx`](file:///s:/AI-prescription-agent/ui/src/components/draft/PatientIntakeSpace.tsx)
* **Feature Description**:
  - Dual Voice & Typed intake space allowing doctors to speak or type patient details for instant heuristic pre-hydration into `draftStore`.

#### 🤖 Live AI Extraction Shimmer & Telemetry Active Banner
* **File**: [`ui/src/components/draft/AIDraftExtractionBanner.tsx`](file:///s:/AI-prescription-agent/ui/src/components/draft/AIDraftExtractionBanner.tsx)
* **Feature Description**:
  - Dual-state top banner: Displays an animated shimmer progress bar and live steps during extraction, and transitions to `"🤖 AI Telemetry Active & Monitoring"` status pill with 1-click sidebar drawer trigger.

#### 💊 Editable Medicine Item Row
* **File**: [`ui/src/components/draft/MedicineRow.tsx`](file:///s:/AI-prescription-agent/ui/src/components/draft/MedicineRow.tsx)
* **Feature Description**:
  - Controlled form row for individual medicines (Name, Dosage, Frequency, Duration, Timing, Notes).

#### ⚠️ Clinical Drug Interaction Banner
* **File**: [`ui/src/components/draft/DrugInteractionBanner.tsx`](file:///s:/AI-prescription-agent/ui/src/components/draft/DrugInteractionBanner.tsx)
* **Feature Description**:
  - Real-time clinical safety engine warning against multi-NSAID co-prescribing, dual antibiotics, or missing PPI gastric protection.

#### 🏷️ Editable Field Chip
* **File**: [`ui/src/components/draft/FieldChip.tsx`](file:///s:/AI-prescription-agent/ui/src/components/draft/FieldChip.tsx)
* **Feature Description**: Reusable styled input chip for clinical fields with focus glow rings.

#### 🎯 AI Extraction Confidence Badge
* **File**: [`ui/src/components/draft/ConfidenceBadge.tsx`](file:///s:/AI-prescription-agent/ui/src/components/draft/ConfidenceBadge.tsx)
* **Feature Description**: Visual confidence score indicator badge (`92% AI Accuracy`).

---

### 2. Telemetry & Master Agent Console (`ui/src/components/telemetry/`)

#### ⚡ Dockable Sidebar AI Telemetry Drawer
* **File**: [`ui/src/components/telemetry/AutoPilotTelemetryConsole.tsx`](file:///s:/AI-prescription-agent/ui/src/components/telemetry/AutoPilotTelemetryConsole.tsx)
* **Feature Description**:
  - Sidebar-dockable telemetry drawer displaying step-by-step AI master agent reasoning (`Step 1/7` to `Step 7/7`). Auto-expands on active WebSocket execution events.

---

### 3. Layout Navigation & Headers (`ui/src/components/layout/`)

#### 🧭 Primary Application Navigation Rail
* **File**: [`ui/src/components/layout/Sidebar.tsx`](file:///s:/AI-prescription-agent/ui/src/components/layout/Sidebar.tsx)
* **Feature Description**:
  - Vertical navigation sidebar with links for New Consult, Dashboard, Patient Receipts Portal (`/receipts`), History, Patients, and Settings, plus bottom-left user account menu and **`⚡ AI Telemetry`** toggle button.

#### 🔝 Header Control Bar & Capsules
* **File**: [`ui/src/components/layout/TopBar.tsx`](file:///s:/AI-prescription-agent/ui/src/components/layout/TopBar.tsx)
* **Feature Description**:
  - Top control bar housing `PatientSearchAutocomplete`, Zero-Touch Auto-Pilot toggle, Language Selector (`English`/`Hinglish`/`Hindi`), Theme Switcher, and Notifications Popover.

#### 🔍 Patient Search Autocomplete
* **File**: [`ui/src/components/layout/PatientSearchAutocomplete.tsx`](file:///s:/AI-prescription-agent/ui/src/components/layout/PatientSearchAutocomplete.tsx)
* **Feature Description**:
  - Fast search input in header for 1-click patient record pre-hydration into the console.

---

### 4. Audio Recording & Speech Sub-System (`ui/src/components/recording/`)

#### 🌊 Dynamic Waveform Audio Spine
* **File**: [`ui/src/components/recording/WaveformSpine.tsx`](file:///s:/AI-prescription-agent/ui/src/components/recording/WaveformSpine.tsx)
* **Feature Description**:
  - Visual audio waveform meter with real-time mic dB level ripple animations (`pulse-ring`).

#### 💬 Live Speech Audio Transcript Panel
* **File**: [`ui/src/components/recording/LiveTranscriptPanel.tsx`](file:///s:/AI-prescription-agent/ui/src/components/recording/LiveTranscriptPanel.tsx)
* **Feature Description**:
  - Dual-column transcript panel with live speech-to-text audio stream, language selector, and manual edit mode.

#### 🎙️ Microphone Recording Controls
* **File**: [`ui/src/components/recording/AudioRecorderControls.tsx`](file:///s:/AI-prescription-agent/ui/src/components/recording/AudioRecorderControls.tsx)
* **Feature Description**:
  - Record, Pause, Stop, and Extract action buttons with timer counter.

---

### 5. Delivery, Modals & Dialogs (`ui/src/components/delivery/`)

#### 📩 Send Prescription & Dispatch Modal
* **File**: [`ui/src/components/delivery/SendPrescriptionModal.tsx`](file:///s:/AI-prescription-agent/ui/src/components/delivery/SendPrescriptionModal.tsx)
* **Feature Description**:
  - Modal for approving prescriptions, selecting pharmacy fulfillment (In-House vs External), and dispatching Email + Web Push notifications.

#### 🛡️ GitHub-Style Batch Delete Confirmation Safeguard
* **File**: [`ui/src/components/delivery/DeleteConfirmModal.tsx`](file:///s:/AI-prescription-agent/ui/src/components/delivery/DeleteConfirmModal.tsx)
* **Feature Description**:
  - Typed confirmation safety modal requiring users to type a verification phrase before executing batch deletions.

#### 💳 Process Refund & Return Credit Voucher Modal
* **File**: [`ui/src/components/delivery/ProcessReturnModal.tsx`](file:///s:/AI-prescription-agent/ui/src/components/delivery/ProcessReturnModal.tsx)
* **Feature Description**:
  - Process partial or full drug returns, restock inventory, and issue Credit Vouchers (`REFUND-YYYYMMDD-XXXX`).

#### ✏️ Live POS Receipt Edit Modal
* **File**: [`ui/src/components/delivery/EditReceiptModal.tsx`](file:///s:/AI-prescription-agent/ui/src/components/delivery/EditReceiptModal.tsx)
* **Feature Description**:
  - Pharmacist modal for editing items, adjusting quantities, overriding unit prices, and applying discounts.

#### 🔍 Interactive Receipt Detail Viewer Modal
* **File**: [`ui/src/components/delivery/ReceiptDetailModal.tsx`](file:///s:/AI-prescription-agent/ui/src/components/delivery/ReceiptDetailModal.tsx)
* **Feature Description**:
  - Detailed popover showing receipt items, GST calculations, pickup location, thermal printing, and PDF export buttons.

---

### 6. Atomic UI & Skeleton Boneyard (`ui/src/components/ui/`)

#### 🔔 Toast Overlay Container
* **File**: [`ui/src/components/ui/ToastContainer.tsx`](file:///s:/AI-prescription-agent/ui/src/components/ui/ToastContainer.tsx)
* **Feature Description**: Global notification toast overlay manager for success, warning, error, and info alerts.

#### 💀 Skeleton Boneyard Components
* **File**: [`ui/src/components/ui/Boneyard.tsx`](file:///s:/AI-prescription-agent/ui/src/components/ui/Boneyard.tsx)
* **Feature Description**: Translucent animated shimmer skeleton placeholders (`BoneCard`, `BoneText`, `BoneDraftPanel`, `BoneHistoryItem`).

---

## 🗃️ PART 4: State Management Stores & Custom React Hooks

### 1. Zustand State Stores (`ui/src/store/`)

* **[`draftStore.ts`](file:///s:/AI-prescription-agent/ui/src/store/draftStore.ts)**: Preserves editable draft state (`patient_name`, `age`, `gender`, `phone`, `email`, `symptoms`, `medicines`, `diagnosis`).
* **[`recordingStore.ts`](file:///s:/AI-prescription-agent/ui/src/store/recordingStore.ts)**: Manages mic recording status (`idle`, `recording`, `paused`, `processing`), audio blobs, and transcript text.
* **[`authStore.ts`](file:///s:/AI-prescription-agent/ui/src/store/authStore.ts)**: Manages JWT authentication tokens, active user profile, and user role (`doctor`, `admin`, `patient`).
* **[`uiStore.ts`](file:///s:/AI-prescription-agent/ui/src/store/uiStore.ts)**: Manages global dark/light theme, active toast notifications, telemetry drawer open/close state (`isTelemetryOpen`), and auto-pilot toggles.

---

### 2. Custom React Hooks & HTTP Client (`ui/src/hooks/`)

* **[`useSavePrescription.ts`](file:///s:/AI-prescription-agent/ui/src/hooks/useSavePrescription.ts)**: Approves and persists prescriptions to MongoDB Atlas and generates encrypted ReportLab PDFs.
* **[`useExtraction.ts`](file:///s:/AI-prescription-agent/ui/src/hooks/useExtraction.ts)**: Sends speech audio transcripts to `/api/consultation/process` for structured AI extraction.
* **[`useSendPrescription.ts`](file:///s:/AI-prescription-agent/ui/src/hooks/useSendPrescription.ts)**: Manages patient email and Web Push dispatch triggers.
* **[`useReceipt.ts`](file:///s:/AI-prescription-agent/ui/src/hooks/useReceipt.ts)**: Derives and generates itemized pharmacy receipts from prescription IDs.
* **[`apiClient.ts`](file:///s:/AI-prescription-agent/ui/src/services/apiClient.ts)**: Type-safe fetch wrapper with JWT Bearer token authorization interceptors.
