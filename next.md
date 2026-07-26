# ScriptIQ Active Working Buffer — `next.md`

> **Workflow Rule**: This file holds the active implementation plan, step-by-step task breakdown, and mid-phase user tweaks for the current phase being executed. Once the phase is fully completed and verified, its contents are migrated/appended into `progress.md`.

---

## 🛠️ Active Phase: Phase 25 — Full Patient Portal Web Application Suite `[PRIORITY: HIGH - PATIENT PORTAL]`

### 📋 Planned Tasks & Implementation Strategy:

#### 1. **Phase 25A: Patient Phone Authentication & Profile Dashboard**
- Build patient phone/OTP login screen (`/patient/login`) and session auth store.
- Build Patient Dashboard (`/patient/dashboard`) displaying active prescriptions, doctor contacts, and clinic notification status.

#### 2. **Phase 25B: Prescription & Lab Test History Viewer**
- Interactive patient timeline of past consultations and DOB-decrypted PDF download CTA buttons.
- Active medication schedule view and daily dosage reminders.

#### 3. **Phase 25C: Push Notification & Communication Preferences Center**
- Interactive preference toggles for Web Push, Email, and SMS notifications.
- Device & browser subscription manager allowing patients to view and revoke subscribed devices.

#### 4. **Phase 25D: Instant Welcome Push Notification & Auto-Verification**
- `[x]` Automatic instant welcome push notification upon subscribing (`Welcome to ScriptIQ Patient Portal! 🎉`).
- `[x]` Instant test notification button (`🔔 Send Test Push Notification`) directly inside the Patient Portal UI.

---

## 🌐 Upcoming Phase: Phase 26 — Multi-Language Regional Audio STT Engine (Hindi / Hinglish) `[PRIORITY: HIGH - REGIONAL CLINICAL STT]`

### 📋 Planned Tasks & Implementation Strategy:
1. **Multi-Lingual STT Engine & Prompting**:
   - Upgrade `SpeechAgent` (`agents/speech_agent.py`) with regional multi-lingual prompting & Hindi/Hinglish clinical term translation.
   - Ensure Gemini LLM extraction engine parses mixed Hindi/English doctor audio seamlessly into clean structured JSON.
2. **Frontend Language Selector**:
   - Add Language Selector dropdown (`English` / `Hinglish` / `Hindi`) in `LiveTranscriptPanel.tsx` and `TopBar.tsx`.

---

## ⚡ Upcoming Phase: Phase 27 — Master Agent Live Telemetry & AI Thinking Console `[PRIORITY: HIGH - AI TRANSPARENCY]`

### 📋 Planned Tasks & Implementation Strategy:
1. **Backend WebSocket Stream (`server.py` → `/ws/master_agent`)**:
   - Upgrade `/ws/master_agent` endpoint to stream real-time step execution messages as each agent runs (`SpeechAgent` -> `PrescriptionAgent` -> `PDFAgent` -> `DatabaseAgent` -> `EmailAgent` -> `PharmacyAgent`).
2. **Frontend UI Telemetry Console (`AutoPilotTelemetryConsole.tsx`)**:
   - Build floating glassmorphism UI console in `DoctorConsolePage.tsx` displaying step-by-step AI working progress (e.g. `[✓] Step 1/6: Transcribing audio`, `[⚡] Step 2/6: Extracting JSON with gemma-4-26b...`, `[ ] Step 3/6: Generating PDF...`).

---

## 🎙️ Completed Phase: Phase 28 — Dedicated Patient Demographics & Clinical Intake Space in Doctor Console
- `[x]` Voice & Typed patient intake space component (`PatientIntakeSpace.tsx`).
- `[x]` Heuristic speech parser extracting patient name, age, gender, DOB, phone, and chief complaints into `draftStore`.

---

## 📝 User Tweaks & Mid-Phase Adjustments:
- Re-ordered Patient Portal Web Suite to **Phase 25** (immediately following Phase 24 Web Push Notification Engine).
- Added instant welcome notification on subscription and in-UI test push button.

---

## 🏁 Phase Completion Status:
- [ ] Phase 25 Implementation
- [ ] Verification & Build (`npm run build`)
- [ ] Migration to `progress.md`
