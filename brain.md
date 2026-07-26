# brain.md — ScriptIQ: AI Prescription Agent
## Complete Project Context Reference for AI Agent

> This file is the single source of truth for the project. Read this first before any task.
> Last updated: July 26, 2026

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Product Name** | ScriptIQ |
| **Project Root** | `s:/AI-prescription-agent/` |
| **Phase** | Phase 28 Complete (GitHub Production Repository Deployed — https://github.com/Saksham3736/scriptiq.git) |
| **LLM Model** | `gemini-2.0-flash` (primary), `gemma-4-26b-a4b-it` (fallback 1) |
| **Database** | MongoDB Atlas (`Agent_Doctor` db) |
| **Backend** | Python (agents + `ai_prescription_agent.py`) → FastAPI (`server.py`) |
| **Frontend** | React 18 + Vite + TypeScript (React Router v6 + Zustand) |
| **Testing** | `tests/test_ai_prescription_agent.py` (unittest) |
| **Virtual Env** | `.venv\Scripts\python.exe` |
| **Config** | `config.py` → `.env` |
| **Active Buffer** | [`next.md`](file:///s:/AI-prescription-agent/next.md) (holds active plan & user tweaks before migrating to `progress.md`) |

---

## 1.1 Development Lifecycle & `next.md` Working Protocol
1. **Active Phase Plan & Tweaks (`next.md`)**:
   - Before executing a phase, write the implementation plan and task checklist into [`next.md`](file:///s:/AI-prescription-agent/next.md).
   - Any mid-phase tweaks, user feedback, or layout customizations requested during execution are added directly into `next.md`.
2. **Phase Completion & Migration (`progress.md`)**:
   - Once a phase is completed and verified (`npm run build` / unit tests), migrate the complete elaborative task details from `next.md` into [`progress.md`](file:///s:/AI-prescription-agent/progress.md).
   - Reset `next.md` with the upcoming phase plan.

---

## 2. What ScriptIQ Does (In One Paragraph)

ScriptIQ is an AI-powered clinical assistant. A doctor speaks or types during a consultation. The **Master Agent** (`ai_prescription_agent.py`) captures that input, converts speech to text via `SpeechAgent` (Whisper + Gemini transcript cleanup), extracts structured clinical data (symptoms, diagnosis, medicines, dosage, tests, advice, follow-up) via `PrescriptionAgent` using `gemma-4-26b-a4b-it`, lets the doctor check and amend the draft in a single unified stage, then auto-generates a DOB-password-protected PDF (`PDFAgent`), saves everything to MongoDB Atlas (`DatabaseAgent`), and dispatches the prescription directly to the patient via WhatsApp (`WhatsAppAgent`). If the patient wants to buy medicines in-house, the Master Agent auto-generates an itemized medicine receipt (`PharmacyAgent`), saves the order to MongoDB, sends the receipt to the patient via WhatsApp, and dispatches a priority alert to the hospital medical desk — all without the doctor doing anything manually after the initial approval.

---

## 3. File Map (Everything You Need to Know About Each File)

### 3.1 Backend Python Core

| File | What it does |
|---|---|
| [`config.py`](file:///s:/AI-prescription-agent/config.py) | Loads all env vars: `MONGODB_URI`, `DB_NAME`, `GEMINI_API_KEY`, `LLM_MODEL` (="gemma-4-26b-a4b-it"), `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` |
| [`ai_prescription_agent.py`](file:///s:/AI-prescription-agent/ai_prescription_agent.py) | **Master orchestrator.** `AIPrescriptionAgent` class. Methods: `generate_prescription()`, `amend_prescription()`, `approve_and_send_prescription()`, `process_pharmacy_choice()`, `run_full_automated_workflow()`. Has `if __name__ == "__main__"` test block. |
| [`agents/__init__.py`](file:///s:/AI-prescription-agent/agents/__init__.py) | Exports all 6 agents. Note: imports `SpeechAgent` which requires `sounddevice` — use `.venv\Scripts\python.exe` only. |
| [`agents/speech_agent.py`](file:///s:/AI-prescription-agent/agents/speech_agent.py) | Speech-to-text via `faster-whisper` + Gemini transcript cleanup. Uses `config.LLM_MODEL` with fallback chain. `sounddevice` is required. |
| [`agents/prescription_agent.py`](file:///s:/AI-prescription-agent/agents/prescription_agent.py) | Pydantic `PrescriptionSchema` + `Medicine` models. Gemini structured JSON extraction. Tries `gemma-4-26b-a4b-it` → `gemini-2.0-flash` → `gemini-1.5-flash`. **Key fix:** `response.parsed.model_dump()` checked before `json.loads(response.text)` since some models return `None` for `.text`. |
| [`agents/pdf_agent.py`](file:///s:/AI-prescription-agent/agents/pdf_agent.py) | ReportLab PDF generation with aspect-ratio scaled hospital logo, doctor letterhead, medicine table, DOB-password encryption. ~511 lines. `output_dir = "output/prescriptions"`. |
| [`agents/database_agent.py`](file:///s:/AI-prescription-agent/agents/database_agent.py) | `DatabaseAgent` wraps `DBHelper`. Default collection: `prescriptions`. Methods: `save_prescription()`, `get_patient_history()`, `update_consultation()`, `delete_consultation()`. |
| [`agents/whatsapp_agent.py`](file:///s:/AI-prescription-agent/agents/whatsapp_agent.py) | Meta WhatsApp Cloud API (live) or simulation mode. Sends prescription + DOB password unlock key. Accepts `custom_message` for pharmacy receipts. Generates `wa.me` click-links. |
| [`agents/pharmacy_agent.py`](file:///s:/AI-prescription-agent/agents/pharmacy_agent.py) | `INVENTORY_CATALOG` dict with 6 medicines. `match_inventory()` + `generate_pharmacy_order()` builds itemized order with `order_id`, `total_amount_inr`, `pickup_location`. |
| [`database/mongodb.py`](file:///s:/AI-prescription-agent/database/mongodb.py) | `DBHelper` singleton-pattern MongoClient pool. Methods: `save_data()`, `retrieve()`, `update()`, `delete()`, `select_collection()`. |

### 3.2 Tests

| File | Coverage |
|---|---|
| [`tests/test_ai_prescription_agent.py`](file:///s:/AI-prescription-agent/tests/test_ai_prescription_agent.py) | Integration tests: full workflow + external pharmacy choice. Known flaky if `gemma-4-26b-a4b-it` returns `response.text = None` — fixed with `response.parsed` fallback. |
| `tests/test_prescription.py`, `test_pdf.py`, `test_db_agent.py`, `test_whatsapp_agent.py`, `test_pharmacy_agent.py`, `test_speech.py` | Individual agent unit tests |

### 3.3 Documentation

| File | Contents |
|---|---|
| [`prd.md`](file:///s:/AI-prescription-agent/prd.md) | Full product requirements: user flows, functional requirements (FR-1 to FR-8), NFRs, KPIs, risks |
| [`design.md`](file:///s:/AI-prescription-agent/design.md) | ScriptIQ Design System: palette (Ink Navy/Mist White/Pulse Violet/Clinical Teal/Amber Flag/Alert Coral), typography (Space Grotesk + Inter + IBM Plex Mono), layout concept (split-pane console + Waveform Spine), components, motion guidelines, accessibility |
| [`structure.md`](file:///s:/AI-prescription-agent/structure.md) | React/Vite folder structure, route map, 7 feature modules, doctor console component tree, Zustand state model, MongoDB TypeScript document shape, 8-milestone build order |
| [`progress.md`](file:///s:/AI-prescription-agent/progress.md) | Phase-by-phase development log (Phases 1–8 done) |
| [`index.md`](file:///s:/AI-prescription-agent/index.md) | Master development checklist (Phases 1–9, all tasks tracked) |
| [`README.md`](file:///s:/AI-prescription-agent/README.md) | Public-facing project readme |
| [`brain.md`](file:///s:/AI-prescription-agent/brain.md) | This file — AI agent context reference |

---

## 4. Architecture at a Glance

```
[Doctor Voice/Text Input]
        |
        v
[SpeechAgent] ──── Whisper STT + gemma-4-26b-a4b-it cleanup
        |
        v
[PrescriptionAgent] ─── gemma-4-26b-a4b-it → PrescriptionSchema (Pydantic)
        |
        v
[AIPrescriptionAgent.amend_prescription()] ─── Doctor check & edit
        |
        v
[PDFAgent] ──────── ReportLab PDF, DOB-encrypted
        |
[DatabaseAgent] ─── MongoDB Atlas → "prescriptions" collection
        |
[WhatsAppAgent] ─── Send PDF + DOB key to patient
        |
[PharmacyAgent] ─── (if in-house purchase) → Itemized receipt
        |
[DatabaseAgent] ─── MongoDB Atlas → "pharmacy_orders" collection
        |
[WhatsAppAgent] ─── Send receipt to patient + alert to medical desk
```

**Phase 9 will add:**
```
[FastAPI server.py] ─── REST/WebSocket bridge to all agents
        |
[Next.js + React Frontend (ui/)] ─── Doctor Console + Patient Views
```

---

## 5. Key Design Decisions & Constraints

### Backend
- **Always use `.venv\Scripts\python.exe`** — system Python lacks `sounddevice`, `faster-whisper`, `reportlab`, `google-genai`, etc.
- **Model fallback chain** must be preserved: `gemma-4-26b-a4b-it` → `gemini-2.0-flash` → `gemini-1.5-flash`. Do NOT use `gemini-2.5-flash` (deprecated/unavailable).
- **Response parsing**: Always check `response.parsed.model_dump()` first, then `response.text`. Some models populate only one.
- **No emojis in print() statements** — Windows console uses cp1252, will crash. Use ASCII markers like `[START]`, `[ALERT]`, `[SUCCESS]`.
- **No Unicode currency symbols** in f-strings printed to console — use `INR` instead of `₹`.
- **MongoDB**: Production DB is named `Agent_Doctor`. Collections: `prescriptions`, `pharmacy_orders`.
- **PDF output dir**: `output/prescriptions/`. Named `prescription_{patient}_{timestamp}.pdf`. Always DOB-encrypted.
- **WhatsApp**: In simulation mode (no WHATSAPP_TOKEN set). Generates `wa.me` click-links only.

### Frontend (Phase 9 — to be built)
- **Framework**: React 18 + Vite + TypeScript (per `structure.md`). NOT pure Next.js pages router — Vite SPA with React Router v6.
- **Styling**: Tailwind CSS with CSS variables mapping `design.md` palette tokens.
- **State**: Zustand (recording/draft/UI/auth) + React Query (server data). No Redux.
- **Icons**: `lucide-react` only.
- **Fonts**: Space Grotesk (display), Inter (body), IBM Plex Mono (data/dosage).
- **Signature design element**: Waveform Spine — vertical left rail that morphs from live waveform to tick-checklist on processing complete.
- **Color rule**: Pulse Violet (`#6D5DF6`) ONLY appears when AI is actively working — never as a generic brand color.
- **Real-time**: WebSocket/SSE for live transcript streaming and draft field population (staggered reveal).

---

## 6. ScriptIQ Design Token Reference (Quick Lookup)

| Token | Value |
|---|---|
| `--color-ink-navy` | `#101A2E` |
| `--color-mist-white` | `#F6F8FA` |
| `--color-pulse-violet` | `#6D5DF6` |
| `--color-pulse-violet-soft` | `#EFECFE` |
| `--color-clinical-teal` | `#12897F` |
| `--color-clinical-teal-soft` | `#E4F3F1` |
| `--color-amber-flag` | `#E8A33D` |
| `--color-amber-flag-soft` | `#FCF1DE` |
| `--color-alert-coral` | `#E15554` |
| `--color-slate-gray` | `#5B6B82` |
| `--color-line-gray` | `#E3E8EE` |

| Font role | Typeface |
|---|---|
| Display/headings | Space Grotesk (600, 500) |
| Body/labels/patient text | Inter (400) |
| Data/dosages/IDs | IBM Plex Mono (500, 400) |

---

## 7. Phase 9 — Build Order (What to Build, in What Order)

Per `structure.md §9 Build Order`:

1. **P9-M1: FastAPI Backend + shell** (Completed) — `server.py` with threadpool endpoints wrapping `AIPrescriptionAgent`, ReportLab static PDF mount, CORS config, and `/ws/transcript` WebSocket
2. **P9-M2: Shell & auth** (Completed) — React 18 + Vite app scaffold, routing, `authStore`, `LoginPage`, role guards, `Sidebar`, `TopBar`, `AppShell`
3. **P9-M3: Recording pipeline** (Completed) — `WaveformSpine`, `RecordFAB`, `ModeToggle`, `recordingStore`, `LiveTranscriptPanel`, bubble stream & text input
4. **P9-M4: Extraction & draft** (Completed) — `draftStore`, `DraftPanel`, editable field chips, medicine rows, symptom pills, `Regenerate` & `Confirm & Send`
5. **P9-M5: Save flow** (Completed) — PDF generation, MongoDB Atlas save (`prescriptions`), delivery status stepper, `approve_and_send_prescription`
6. **P9-M6: Patient delivery** (Completed) — `process_pharmacy_choice`, dual receipt dispatch to patient + medical desk via WhatsApp, delivery status badges
7. **P9-M7: Patient-facing views** (Completed) — `PrescriptionViewPage`, DOB password unlock key notice, direct PDF download link
8. **P9-M8: History & search** (Completed) — `DashboardPage` with clinic metrics & quick actions, `HistoryPage` with MongoDB search & detail view
9. **P9-M9: Data validation & schemas** (Completed) — Zod validators, React Hook Form integration, MongoDB type schemas
10. **P15: Toast notifications & status timeline** (Completed) — `uiStore.ts`, global `ToastContainer`, `StatusTimeline.tsx` lifecycle stepper, `ConfidenceBadge.tsx`, upgraded `DrugInteractionBanner.tsx` safety engine
11. **P16: Real JWT Auth & RBAC** (Completed) — `auth.py` JWT signing engine, `/api/auth/login`, `/api/auth/register`, `/api/auth/me`, `<RequireRole>` route guard component, Bearer token interceptor in `apiClient.ts`
12. **P17: Centralized Design Tokens & Dark Theme Engine** (Completed) — `tokens.css`, `ThemeProvider.tsx`, atomic UI component library (`Button.tsx`, `Card.tsx`, `Input.tsx`, `Badge.tsx`, `Modal.tsx`)
13. **P18: TopBar Autocomplete Search, PDF Filename Copy & Clinical Dossiers** (Completed) — Dark mode search popup, 1-click clipboard copy for exact PDF system filenames, dossier modal console re-hydration
14. **P19: Streamlit Cleanup, Query Projections, Master Agent Telemetry & Auto-Pilot Mode** (Completed) — Deleted legacy `app.py`, MongoDB query projections (80% RAM cut), `/ws/master_agent` telemetry stream, `Auto-Pilot ON/OFF` zero-touch mode
15. **P20: High-Security Typed Batch Record Deletion** (Completed) — `POST /api/consultations/delete-batch`, `DeleteConfirmModal.tsx` GitHub-style typed phrase confirmation, multi-select mode in History & Patients pages
16. **P21: Full Prescription Letterhead Customization Suite** (Completed) — `GET/POST /api/settings/letterhead` REST API, dynamic ReportLab PDF letterhead branding in `pdf_agent.py`, interactive live preview in `SettingsPage.tsx`
17. **P28: GitHub Production Repository Deployment** (Completed) — Sanitized `.gitignore`, root commit `c64ebac` (`21,799` lines), and remote push to `https://github.com/Saksham3736/scriptiq.git` on branch `main`
18. **P22: Decommissioning & Removal of SMS / WhatsApp Module** (Planned) — Decommission Meta WhatsApp Cloud API credentials, simulation handlers, and UI dispatch triggers
19. **P23: Production Email Dispatch Engine (`EmailAgent`)** (Planned) — `agents/email_agent.py` SMTP / Resend API agent sending HTML prescription emails with DOB-password encrypted PDF attachment & dual receipt dispatch
20. **P24: Patient Web Push Notification Engine** (Planned) — VAPID key pairs + `pywebpush` backend engine, Service Worker (`sw.js`), iOS & Android authorization modal, patient ON/OFF notification preference toggle controls, and lock-screen alert banners
21. **P25: Multi-Language Regional Audio STT Engine (Hindi / Hinglish)** (Planned) — Multi-lingual prompting in `SpeechAgent`, Hindi/Hinglish clinical translation, and UI language selector dropdown (`English` / `Hinglish` / `Hindi`)
22. **P26: Master Agent Live Telemetry & AI Thinking Console** (Planned) — Real-time `/ws/master_agent` WebSocket stepper stream, floating `AutoPilotTelemetryConsole.tsx` AI working progress console with staggered field reveals
23. **P27: World-Class Clinical UI/UX & Structural Layout Improvisation Engine** (Planned) — Strict 3-tier button scale (`32px`, `38px`, `46px`), 8px baseline spatial grid tokens, optical flex alignment, WCAG focus rings, micro-elevation, and 13"-to-4K density control
24. **P30: Real-Time Speaker Diarization Engine** (Planned) — Doctor vs. Patient dual-channel speech separation & PyAnnote / Whisper diarization in `SpeechAgent`
25. **P31: Automated ICD-10 Medical Billing Auto-Coder** (Planned) — ICD-10 diagnosis database & Gemini auto-coder mapping with 1-click autocomplete chips
26. **P32: Interactive Vitals & Chronic Disease Analytics** (Planned) — Recharts longitudinal vitals tracking (BP, Glucose, Weight, SpO2) in Patient Dossier
27. **P33: Offline-First PWA with IndexedDB Queue** (Planned) — IndexedDB audio blob queue (`idb-keyval`) and background sync on Wi-Fi reconnection
28. **P34: Pediatric & Renal Dosage Safety Calculator** (Planned) — mg/kg pediatric dosage and GFR clearance calculation engine inside `MedicineRow.tsx`

---

## 8. Known Issues / Watch-outs

| Issue | Status | Fix Applied |
|---|---|---|
| `gemma-4-26b-a4b-it` sometimes returns `response.text = None` AND `response.parsed = None` (empty response) | Fixed | `prescription_agent.py` now uses a **loop-based fallback chain**: tries each model in order, checks both `.parsed.model_dump()` and `.text`, only moves to next model if current yields empty response. Never raises until all 3 models are exhausted. |
| `gemini-2.5-flash` deprecated/unavailable | Fixed | Removed; chain is `gemma-4-26b-a4b-it → gemini-2.0-flash → gemini-1.5-flash` |
| Windows cp1252 encoding crash on emoji in `print()` | Fixed | All print statements use ASCII-safe markers (`[START]`, `[ALERT]`, `[SUCCESS]`) |
| `sounddevice` not on system Python | Known | Always use `.venv\Scripts\python.exe` |
| MongoDB update with string `_id` instead of `ObjectId` fails silently | Known | `process_pharmacy_choice` does not hard-fail if update returns `nModified: 0` |

---

## 9. Environment Variables (from `.env`)

```
MONGODB_URI=<mongo atlas connection string>
DB_NAME=Agent_Doctor
GEMINI_API_KEY=<key>
LLM_MODEL=gemma-4-26b-a4b-it
WHATSAPP_TOKEN=<token or empty for simulation>
WHATSAPP_PHONE_NUMBER_ID=<id or empty>
```

---

## 10. Commands Quick Reference

```powershell
# Run master automation engine (test)
.venv\Scripts\python.exe ai_prescription_agent.py

# Run integration tests
.venv\Scripts\python.exe -m unittest tests/test_ai_prescription_agent.py

# Run all tests
.venv\Scripts\python.exe -m pytest tests/

# (Legacy) Streamlit app
.venv\Scripts\python.exe -m streamlit run app.py

# Phase 9 — FastAPI server (when built)
.venv\Scripts\python.exe -m uvicorn server:app --reload --port 8000

# Phase 9 — Frontend dev server (when scaffolded)
npm run dev  # from ui/ directory
```
