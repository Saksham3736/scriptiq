# ScriptIQ Active Working Buffer — `next.md`

> **Workflow Rule**: This file holds the active implementation plan, step-by-step task breakdown, and mid-phase user tweaks for the current phase being executed. Once the phase is fully completed and verified, its contents are migrated/appended into `progress.md`.

---

## 🛠️ Active Phase: Phase 22 — Decommissioning & Removal of SMS / WhatsApp Module `[PRIORITY: HIGH - REFACTOR]`

### 📋 Planned Tasks & Implementation Strategy (Phase Definition Only — No Implementation Yet):
1. **Decommission WhatsApp / SMS Dependencies**:
   - Decommission legacy Meta WhatsApp Cloud API credentials and simulation handlers in `agents/whatsapp_agent.py`.
   - Remove WhatsApp dispatch triggers from `ai_prescription_agent.py` workflow orchestrator and `server.py`.

2. **Clean Up Settings & UI Components**:
   - Remove WhatsApp tab controls in `SettingsPage.tsx` and WhatsApp badges in `DraftPanel.tsx` and `DashboardPage.tsx`.

---

## 🛠️ Upcoming Phase: Phase 23 — Production Email Dispatch Engine (`EmailAgent`) `[PRIORITY: HIGH - COMMUNICATION]`

### 📋 Planned Tasks & Implementation Strategy (Phase Definition Only — No Implementation Yet):
1. **Build `EmailAgent` (`agents/email_agent.py`)**:
   - Create Python SMTP / Resend API email agent sending styled HTML prescription emails.
   - Attach DOB-password-encrypted ReportLab prescription PDFs automatically.

2. **Backend & Frontend Integration**:
   - Build REST endpoints `POST /api/prescription/send-email` and `POST /api/pharmacy/email-receipt` in `server.py`.
   - Add Email tab controls in `SettingsPage.tsx`, patient email input fields in `DraftPanel.tsx`, and 1-click **Send Email Prescription** CTA.
   - Implement dual receipt dispatch sending prescription receipts to both Patient Email and Hospital Pharmacy Desk.

---

## 🔔 Upcoming Phase: Phase 24 — Patient Web Push Notification Engine (Service Worker + VAPID Keys) `[PRIORITY: HIGH - NOTIFICATIONS]`

### 📋 Planned Tasks & Implementation Strategy (Phase Definition Only — No Implementation Yet):
1. **Backend Push Engine (`pywebpush`)**:
   - Generate VAPID public/private keys and add backend push notification triggers in `server.py`.
   - Implement REST endpoints (`POST /api/notifications/subscribe`, `POST /api/notifications/toggle`) persisting push subscriptions & preference ON/OFF toggle states in MongoDB Atlas.

2. **Frontend Service Worker & Universal Device Authorization**:
   - Register browser Service Worker (`public/sw.js`) handling background push events and native phone/desktop OS banners.
   - Build **Universal iOS & Android Authorization Modal**: Tailored permission prompt with OS detector (`iOS / Android`) complying with Apple Safari user-gesture standards.
   - Build **Patient Notification Preference Control (ON/OFF Toggle)**: Allows patients to log in and toggle push alerts ON/OFF at any time.
   - Trigger instant lock-screen phone alerts when prescriptions or pharmacy receipts are generated.

---

## 🌐 Upcoming Phase: Phase 25 — Multi-Language Regional Audio STT Engine (Hindi / Hinglish) `[PRIORITY: HIGH - REGIONAL CLINICAL STT]`

### 📋 Planned Tasks & Implementation Strategy (Phase Definition Only — No Implementation Yet):
1. **Multi-Lingual STT Engine & Prompting**:
   - Upgrade `SpeechAgent` (`agents/speech_agent.py`) with regional multi-lingual prompting & Hindi/Hinglish clinical term translation.
   - Ensure Gemini LLM extraction engine parses mixed Hindi/English doctor audio seamlessly into clean structured JSON.
2. **Frontend Language Selector**:
   - Add Language Selector dropdown (`English` / `Hinglish` / `Hindi`) in `LiveTranscriptPanel.tsx` and `TopBar.tsx`.

## ⚡ Upcoming Phase: Phase 26 — Master Agent Live Telemetry & AI Thinking Console `[PRIORITY: HIGH - AI TRANSPARENCY]`

### 📋 Planned Tasks & Implementation Strategy (Phase Definition Only — No Implementation Yet):
1. **Backend WebSocket Stream (`server.py` → `/ws/master_agent`)**:
   - Upgrade `/ws/master_agent` endpoint to stream real-time step execution messages as each agent runs (`SpeechAgent` -> `PrescriptionAgent` -> `PDFAgent` -> `DatabaseAgent` -> `EmailAgent` -> `PharmacyAgent`).
2. **Frontend UI Telemetry Console (`AutoPilotTelemetryConsole.tsx`)**:
   - Build floating glassmorphism UI console in `DoctorConsolePage.tsx` displaying step-by-step AI working progress (e.g. `[✓] Step 1/6: Transcribing audio`, `[⚡] Step 2/6: Extracting JSON with gemma-4-26b...`, `[ ] Step 3/6: Generating PDF...`).
   - Implement staggered field revealing animations as each step completes.

---

## 🎨 Upcoming Phase: Phase 27 — World-Class Clinical UI/UX & Structural Layout Improvisation Engine `[PRIORITY: HIGH - UI/UX ERGONOMICS]`

### 📋 Planned Tasks & Implementation Strategy (Phase Definition Only — No Implementation Yet):
1. **Button Scaling & Spatial Grid Token System**:
   - Enforce 3-tier button scale (`32px` Sm, `38px` Md, `46px` Lg CTAs) across all pages.
   - Enforce 8px Baseline Grid token system (`var(--space-2)`, `var(--space-4)`, `var(--space-6)`) for cards, padding, and gaps.
   - Apply multi-layered ambient elevation shadows (`box-shadow`) and 1px translucent micro-borders.

2. **Optical Alignment & Micro-Interactions**:
   - Flex optical alignment (`inline-flex`, `align-items: center`, `gap: 6px`) and icon sizing (`14px` inside buttons, `16px` in headers, `20px` in hero banners).
   - High-contrast WCAG 2.1 AA focus rings (`:focus-visible`) and snappy `100ms ease-out` hover state transitions.

3. **Viewport Density Optimization**:
   - Responsive density scaling for 13" laptop screens (zero-scroll fitted 3-pane console) up to 27" 4K displays.

---

## 🗺️ Rearranged Future Phases & Enterprise Roadmap

### 🚀 Phase 26: Cloud CI/CD & Production Environment Config `[PRIORITY: MEDIUM]` *(Docker Deferred)*
- Environment variables setup (`VITE_API_URL`, `VITE_WS_URL`) & CORS/HTTPS headers in `server.py`.
- GitHub Actions CI pipeline (`.github/workflows/ci.yml`) for automated linting, type-checks (`tsc`), frontend build (`npm run build`), and Python integration tests.

### ⚡ Phase 27: Performance, Caching & Offline Resilience `[PRIORITY: MEDIUM]`
- Response caching with Redis / in-memory LRU for common drug dosages and catalog queries.
- Service Worker & IndexedDB offline audio blob recording queue for offline consultation capture.

### 🏥 Phase 28: Electronic Health Record (EHR) / HL7 FHIR Standard Export `[PRIORITY: FUTURE]`
- Build `fhirExporter.py` converting prescriptions to HL7 / FHIR R4 JSON standard resources.
- REST endpoint `GET /api/prescription/:id/fhir` for hospital EHR system integration.

### 🔐 Phase 29: E-Prescription Aadhaar Digital Signature (e-Sign) `[PRIORITY: FUTURE]`
- Aadhaar e-Sign / PKI digital signature verification module for Indian Telemedicine Guidelines 2020 compliance.

### 🎙️ Phase 30: Real-Time Speaker Diarization Engine `[PRIORITY: HIGH - CLINICAL CONTEXT]`
- Dual-channel audio stream separation & PyAnnote / Whisper diarization in `SpeechAgent`.
- Colored dual-bubble transcript stream in `LiveTranscriptPanel.tsx` (`[Doctor]` vs `[Patient]`).

### ⚡ Phase 31: Automated ICD-10 Medical Billing Auto-Coder `[PRIORITY: HIGH - HOSPITAL BILLING]`
- ICD-10 clinical diagnosis code database & Gemini auto-coder mapping in `PrescriptionAgent`.
- 1-Click ICD-10 autocomplete chips and differential diagnosis popover in `DraftPanel.tsx`.

### 📊 Phase 32: Interactive Vitals & Chronic Disease Progression Analytics `[PRIORITY: HIGH - CLINICAL TRENDS]`
- Recharts interactive vitals tracking (BP, HbA1c, Blood Glucose, Weight, SpO2) across historical consultations.
- Patient Dossier health progression trends dashboard in `PatientsPage.tsx`.

### 📴 Phase 33: Offline-First PWA with IndexedDB Audio Sync Queue `[PRIORITY: HIGH - OFFLINE RESILIENCE]`
- Service Worker offline caching & IndexedDB storage queue (`idb-keyval`) for audio blobs when clinic Wi-Fi drops.
- Automatic background sync engine pushing offline consultations to MongoDB Atlas upon network reconnection.

### 💊 Phase 34: Pediatric & Renal Clinical Dosage Safety Calculator `[PRIORITY: HIGH - PATIENT SAFETY]`
- mg/kg pediatric dosage and GFR renal clearance calculation engine based on patient age, weight, and diagnosis.
- Safe dosage range indicators and clinical warning badges directly inside `MedicineRow.tsx`.

---

## 📝 User Tweaks & Mid-Phase Adjustments:
*(User tweaks and custom requirements suggested during execution will be appended here.)*

---

## 🏁 Phase Completion Status:
- [ ] Task Implementation
- [ ] Verification & Build (`npm run build`)
- [ ] Migration to `progress.md`
