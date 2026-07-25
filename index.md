# AI Prescription Agent - Master Development Index & Priority Roadmap

## Legend & Priority Tags:
- `[PRIORITY: CRITICAL - CORE]`: Mandatory core architectural infrastructure, AI engines, data persistence, and security.
- `[PRIORITY: HIGH]`: Essential system quality, data contracts, theme architecture, and cloud deployment.
- `[PRIORITY: MEDIUM]`: Advanced workflow automation, offline caching, and master console UI extensions.
- `[RECOMMENDED / OPTIONAL BONUS]`: Recommended bonus extensions for regional multi-lingual STT, EHR compliance, and automated reminders.

---

## Phase 1: Project Initialization `[PRIORITY: CRITICAL - CORE]`

- [x] Step 1: Create Project
  - [x] Create project folder
  - [x] Open project in VS Code
  - [x] Open integrated terminal

- [x] Step 2: Python Environment
  - [x] Verify Python installation
  - [x] Create virtual environment
  - [x] Activate virtual environment
  - [x] Upgrade pip
  - [x] Select VS Code interpreter

- [x] Step 3: Project Structure
  - [x] Create root files
  - [x] Create agents folder
  - [x] Create database folder
  - [x] Create templates folder
  - [x] Create assets folder
  - [x] Create output folder
  - [x] Create docs folder
  - [x] Configure .gitignore

---

## Phase 2: Dependency Setup `[PRIORITY: CRITICAL - CORE]`

- [x] Step 4: Install Core Libraries
  - [x] Install Gemini SDK
  - [x] Install Environment Variable Library
  - [x] Install PDF Library
  - [x] Install MongoDB Library
  - [x] Install HTML Template Engine
  - [x] Install Image Processing Library
  - [x] Install Utility Libraries

- [x] Step 5: Project Configuration
  - [x] Create requirements.txt
  - [x] Configure .env
  - [x] Configure config.py
  - [x] Store API keys
  - [x] Configure project constants

---

## Phase 3: Database Module `[PRIORITY: CRITICAL - CORE]`

- [x] Step 6: MongoDB Setup
  - [x] Create MongoDB connection
  - [x] Test database connection
  - [x] Create database helper methods
  - [x] Insert document method
  - [x] Retrieve document method
  - [x] Update document method
  - [x] Delete document method

---

## Phase 4: AI Agent Development `[PRIORITY: CRITICAL - CORE]`

### Agent 1 - Speech Agent
- [x] Step 7: Speech Agent
  - [x] Create speech agent
  - [x] Load Gemini model
  - [x] Create speech prompt
  - [x] Convert speech text
  - [x] Return structured consultation

### Agent 2 - Prescription Agent
- [x] Step 8: Prescription Agent
  - [x] Create prescription agent
  - [x] Design prescription prompt
  - [x] Generate medicine details
  - [x] Generate dosage
  - [x] Generate precautions
  - [x] Return structured prescription JSON

### Agent 3 - PDF Agent
- [x] Step 9: PDF Agent
  - [x] Create HTML template
  - [x] Load doctor details
  - [x] Load hospital assets
  - [x] Populate prescription
  - [x] Generate PDF
  - [x] Save PDF

### Agent 4 - Database Agent
- [x] Step 10: Database Agent
  - [x] Connect with MongoDB
  - [x] Save prescription
  - [x] Save patient details
  - [x] Retrieve prescription history

### Agent 5 - WhatsApp Agent
- [x] Step 11: WhatsApp Agent
  - [x] Create WhatsApp agent
  - [x] Configure WhatsApp API credentials
  - [x] Create message template
  - [x] Send prescription link to patient

### Agent 6 - Pharmacy Agent
- [x] Step 12: Pharmacy Agent
  - [x] Create pharmacy agent
  - [x] Process patient pharmacy choice
  - [x] Generate medicine purchase receipt
  - [x] Send dispatch notification to hospital medical desk

---

## Phase 5: Application Integration `[PRIORITY: CRITICAL - CORE]`

- [x] Step 13: Main Application Integration
  - [x] Create app.py
  - [x] Connect all 6 agents sequentially
  - [x] Implement CLI doctor consultation workflow
  - [x] Test full automated pipeline

---

## Phase 6: Module & Integration Testing `[PRIORITY: CRITICAL - CORE]`

- [x] Step 14: System Testing
  - [x] Unit test Speech Agent
  - [x] Unit test Prescription Agent
  - [x] Unit test PDF Agent
  - [x] Unit test Database Agent
  - [x] Integration test full workflow

---

## Phase 7: Documentation & Setup Guides `[PRIORITY: HIGH]`

- [x] Step 15: Documentation
  - [x] Write project README.md
  - [x] Document setup instructions
  - [x] Add system architecture diagram
  - [x] Create user guide for doctors

---

## Phase 8: Master Automation Engine `[PRIORITY: CRITICAL - CORE]`

- [x] Step 16: Master Orchestrator Engine (`ai_prescription_agent.py`)
  - [x] Combine all 6 AI agents into a single master orchestrator class
  - [x] Add automatic fallback chain (`gemini-2.0-flash` → `gemma-4-26b-a4b-it`)
  - [x] Add PDF DOB password encryption key generation
  - [x] Add dual receipt dispatch to patient + hospital medical desk counter

---

## Phase 9: Production Web UI `[PRIORITY: CRITICAL - CORE]`

- [x] Step 17: FastAPI Backend Server (`server.py`)
  - [x] REST API endpoints (`/api/consultation/process`, `/api/prescription/approve`, `/api/pharmacy/receipt`)
  - [x] WebSocket audio transcript bridge (`/ws/transcript`)
- [x] Step 18: React 18 + Vite Web App Console (`ui/`)
  - [x] 3-Pane Doctor Console (`WaveformSpine`, `LiveTranscriptPanel`, `DraftPanel`)
  - [x] State Management (`draftStore`, `recordingStore`, `authStore`, `uiStore`)

---

## Phase 10: Structural Refactoring & Boneyard Skeletons `[PRIORITY: HIGH]`

- [x] Step 19: Component Modularization & Loading States
  - [x] Move UI components into `components/layout`, `components/draft`, `components/recording`, `components/ui`
  - [x] Build Boneyard Skeleton loading components (`BoneCard`, `BoneText`, `BoneTranscriptBubble`)

---

## Phase 11: Zod Runtime Schema Validation Layer `[PRIORITY: HIGH]`

- [x] Step 20: Type Safety Contracts
  - [x] Build `prescriptionSchema.ts` Zod runtime validator
  - [x] Type-safe fetch client (`apiClient.ts`)

---

## Phase 12: React Hook Form Engine `[PRIORITY: HIGH]`

- [x] Step 21: Form Control & Validation
  - [x] Integrate React Hook Form into `DraftPanel.tsx`

---

## Phase 13: MongoDB Pydantic Schemas `[PRIORITY: HIGH]`

- [x] Step 22: Backend Data Validation
  - [x] Build backend Pydantic data schemas in `server.py`

---

## Phase 14: Strict Data Contracts `[PRIORITY: HIGH]`

- [x] Step 23: End-to-End Schema Integrity
  - [x] Enforce consistent JSON keys between Python agents and TypeScript stores

---

## Phase 15: Toast Notifications, Status Timeline & Safety `[PRIORITY: HIGH]`

- [x] Step 24: UI Feedback & Clinical Safety Engine
  - [x] Build `uiStore.ts` & global `<ToastContainer />` overlay
  - [x] Build 5-step `StatusTimeline.tsx` stepper (`Draft` → `Reviewed` → `Saved` → `Dispatched`)
  - [x] Upgraded `DrugInteractionBanner.tsx` for multi-NSAID, dual antibiotic, and PPI gastric protection alerts
  - [x] AI Confidence score badges (`ConfidenceBadge.tsx`)

---

## Phase 16: Authentication, Roles & Security `[PRIORITY: CRITICAL - CORE]`

- [x] Step 25: Real Authentication System
  - [x] Backend standard-library HMAC-SHA256 JWT token signing engine (`auth.py`)
  - [x] FastAPI auth REST endpoints (`POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`)
  - [x] Bearer token interceptor & 401 auto-logout in `apiClient.ts`
- [x] Step 26: Role-Based Access Control (RBAC)
  - [x] Build `<RequireRole>` route guard component
  - [x] Protect `/console`, `/dashboard`, `/history`, `/patients`, `/settings` routes

---

## Production UI, Workflows & Design System Polish `[PRIORITY: HIGH]`

- [x] Step 27: Patient Search Autocomplete & Header Controls
  - [x] Built `PatientSearchAutocomplete.tsx` in `TopBar.tsx` for 1-click console re-hydration
  - [x] TopBar Profile Dropdown, Notifications Popover, and Sidebar Account Options Menu
- [x] Step 28: 5-Tab Settings Suite
  - [x] Redesigned `SettingsPage.tsx` into a modern 5-tab settings application interface
- [x] Step 29: Enhanced Patient Directory & Clinical History Dossiers
  - [x] Stat banners, category filters, and interactive Patient Dossier modals in `PatientsPage.tsx`
  - [x] Dual-tab structured prescription vs transcript inspection in `HistoryPage.tsx`
- [x] Step 30: Control Center Operations Dashboard
  - [x] Live Recent Consultations Feed & Sub-Agent Pipeline Health Monitors in `DashboardPage.tsx`
- [x] Step 31: Clinical Design System & Performance Audit
  - [x] Imported Google Web Fonts (`Space Grotesk`, `Plus Jakarta Sans`, `IBM Plex Mono`) in `index.css`
  - [x] Snappy 100ms transitions & reduced motion safe rules

---

## Phase 17A: Design Token System & Accessibility Audit `[PRIORITY: HIGH - SYSTEM QUALITY]`

- [x] Step 32: Design Token System
  - [x] Build `tokens.css` — centralized CSS custom properties from `design.md`
  - [x] Build dark console theme definitions (`--bg: #0B1220`, `--panel-bg: #101A2E`, `--border: #1E293B`)
  - [x] Persist theme preference in `localStorage` with `prefers-color-scheme` auto-detection

- [x] Step 33: Accessibility & Responsive Audit
  - [x] WCAG 2.1 AA accessibility audit — keyboard nav, ARIA live-regions, focus rings
  - [x] Reduced-motion mode safe animation states
  - [x] Responsive layout audit & Error Boundary (`ErrorBoundary.tsx`) integration

---

## Phase 17B: Theme Provider & Component Library `[PRIORITY: HIGH - SYSTEM QUALITY]`

- [x] Step 34: Central Theme Provider Engine (`ThemeProvider.tsx`)
  - [x] Build `ThemeProvider.tsx` React Context wrapping root app
  - [x] Dynamic attribute binding (`data-theme="dark"` / `data-theme="light"`)
- [x] Step 35: Centralized Atomic UI Component Library
  - [x] Build tokenized `Button.tsx`, `Card.tsx`, `Input.tsx`, `Badge.tsx`, `Modal.tsx`

---

## Phase 18: Production Build, Cloud Deployment & CI/CD `[PRIORITY: HIGH - DEPLOYMENT]`

- [ ] Step 36: Production Configuration
  - [ ] Environment config (`VITE_API_URL`, `VITE_WS_URL`)
  - [ ] Backend Gunicorn/Uvicorn workers config & HTTPS rate limiting
- [ ] Step 37: Cloud Deployment & CI/CD
  - [ ] Docker containerization — `Dockerfile` for backend & `Dockerfile` for frontend SPA
  - [ ] `docker-compose.yml` for local full-stack setup
  - [ ] GitHub Actions CI pipeline for automated linting, testing, and deployment

---

## Phase 19: Streamlit UI Removal, Master Agent Telemetry & Zero-Touch Auto-Pilot Mode `[PRIORITY: HIGH - AUTOMATION]`

- [x] Step 38: Master Agent Event Stream & Auto-Pilot
  - [x] Backend WebSocket Event Stream (`/ws/master_agent`) emitting execution steps
  - [x] Zero-touch auto-pilot mode toggle (`TopBar.tsx`)
  - [x] Streamlit removal & MongoDB query projections (80% RAM cut)

---

## Phase 20: High-Security Batch Record Deletion & Security Safeguards `[PRIORITY: HIGH - SECURITY]`

- [x] Step 39: Batch Deletion REST Endpoint & Typed Confirmation Safeguard
  - [x] `POST /api/consultations/delete-batch` endpoint handling arrays of record IDs via MongoDB Atlas `delete_many`
  - [x] Reusable GitHub-style typed confirmation modal (`DeleteConfirmModal.tsx`) requiring typed phrase confirmation (`delete N record(s)`)
  - [x] Multi-select selection mode in History Audit Log (`HistoryPage.tsx`) and Patient Directory (`PatientsPage.tsx`)

---

## Phase 21: Full Prescription Letterhead Customization Suite `[PRIORITY: HIGH - CLINICAL CUSTOMIZATION]`

- [x] Step 40: Backend Letterhead Settings API & Database Storage
  - [x] Build `GET /api/settings/letterhead` and `POST /api/settings/letterhead` REST endpoints in `server.py`
  - [x] Implement settings persistence in MongoDB collection `settings` via `DatabaseAgent`
  - [x] Update `PDFAgent` (`agents/pdf_agent.py`) to dynamically incorporate saved letterhead branding (clinic name, doctor credentials, license reg no, primary/secondary theme colors, address, contact details, layout alignment) into ReportLab PDF rendering

- [x] Step 41: Frontend PDF Letterhead Editor & Live Preview in Settings Page
  - [x] Extend Prescription & PDF tab in `SettingsPage.tsx` with comprehensive letterhead form controls
  - [x] Build interactive live PDF letterhead preview banner in `SettingsPage.tsx` showing instant visual updates as fields are edited
  - [x] Connect save handler to `/api/settings/letterhead` API with success/error toast notifications

---

## Phase 22: Decommissioning & Removal of SMS / WhatsApp Module `[PRIORITY: HIGH - REFACTOR]`

- [ ] Step 42: Decommission WhatsApp / SMS Dependencies
  - [ ] Decommission legacy Meta WhatsApp Cloud API credentials and simulation handlers in `agents/whatsapp_agent.py`
  - [ ] Remove WhatsApp dispatch triggers from `ai_prescription_agent.py` workflow orchestrator and `server.py`
  - [ ] Remove WhatsApp tab controls in `SettingsPage.tsx` and WhatsApp status badges in `DraftPanel.tsx` and `DashboardPage.tsx`

---

## Phase 23: Production Email Dispatch Engine (`EmailAgent`) `[PRIORITY: HIGH - COMMUNICATION]`

- [ ] Step 43: Build `EmailAgent` & REST Integration
  - [ ] Create Python SMTP / Resend API email agent (`agents/email_agent.py`) sending styled HTML prescription emails
  - [ ] Automatically attach DOB-password-encrypted ReportLab prescription PDFs
  - [ ] Build REST endpoints `POST /api/prescription/send-email` and `POST /api/pharmacy/email-receipt` in `server.py`
  - [ ] Add Email tab controls in `SettingsPage.tsx`, patient email input fields in `DraftPanel.tsx`, and 1-click **Send Email Prescription** CTA
  - [ ] Implement dual receipt dispatch sending prescription receipts to both Patient Email and Hospital Pharmacy Desk

---

## Phase 24: Patient Web Push Notification Engine (Service Worker + VAPID Keys) `[PRIORITY: HIGH - NOTIFICATIONS]`

- [ ] Step 44: VAPID Key Generation, Service Worker & Universal Device Authorization
  - [ ] Generate VAPID public/private key pairs and add `pywebpush` backend push dispatcher in `server.py`
  - [ ] Create browser Service Worker (`ui/public/sw.js`) handling background push events and native OS notifications
  - [ ] Build **Universal iOS & Android Authorization Modal**: Custom gesture-triggered permission window with smart OS detector (`iOS / Android`) complying with Apple Safari user-gesture standards
  - [ ] Build **Patient Notification Control Toggle (ON/OFF)**: Interactive push notification preference toggle in patient portal and settings allowing users to enable/disable alerts anytime
  - [ ] REST API endpoints (`POST /api/notifications/subscribe`, `POST /api/notifications/toggle`) persisting subscription endpoints & ON/OFF preference states in MongoDB Atlas
  - [ ] Trigger instant lock-screen phone notifications when prescriptions or pharmacy receipts are generated

---

## Phase 25: Multi-Language Regional Audio STT Engine (Hindi / Hinglish) `[PRIORITY: HIGH - REGIONAL CLINICAL STT]`

- [ ] Step 45: Multi-Lingual Hindi / Hinglish Speech Support & Translation
  - [ ] Upgrade `SpeechAgent` (`agents/speech_agent.py`) with regional multi-lingual prompting & Hindi/Hinglish clinical term translation
  - [ ] Add Language Selector dropdown (`English` / `Hinglish` / `Hindi`) in `LiveTranscriptPanel.tsx` and `TopBar.tsx`
  - [ ] Ensure Gemini LLM extraction engine parses mixed Hindi/English doctor audio seamlessly into clean structured JSON

---

## Phase 26: Master Agent Live Telemetry & AI Thinking Console `[PRIORITY: HIGH - AI TRANSPARENCY]`

- [ ] Step 46: Real-Time Sub-Agent Telemetry & Progress Stepper Stream
  - [ ] Upgrade `/ws/master_agent` WebSocket stream in `server.py` to yield real-time step execution events (`SpeechAgent` -> `PrescriptionAgent` -> `PDFAgent` -> `DatabaseAgent` -> `EmailAgent` -> `PharmacyAgent`)
  - [ ] Build **`AutoPilotTelemetryConsole.tsx`**: Floating glassmorphism UI telemetry panel displaying step-by-step AI working progress (e.g. `[✓] Step 1/6: Transcribing audio`, `[⚡] Step 2/6: Extracting JSON with gemma-4-26b...`, `[ ] Step 3/6: Generating PDF...`)
  - [ ] Implement staggered UI field revealing and pulse animations as each backend agent completes its stage

---

## Phase 27: World-Class Clinical UI/UX & Structural Layout Improvisation Engine `[PRIORITY: HIGH - UI/UX ERGONOMICS]`

- [ ] Step 47: Button Scaling, Elevation & Spatial Grid Token System
  - [ ] Enforce strict 3-tier button scale (`32px` Sm, `38px` Md, `46px` Lg CTAs) across all 5 pages
  - [ ] Enforce strict 8px Baseline Grid token system (`var(--space-2)` = 8px, `var(--space-4)` = 16px, `var(--space-6)` = 24px) for cards, padding, and gaps
  - [ ] Apply subtle multi-layered ambient elevation shadows (`0 1px 3px rgba(0,0,0,0.12), 0 8px 24px -4px rgba(0,0,0,0.08)`) and 1px translucent borders (`rgba(255,255,255,0.08)` in dark mode)
- [ ] Step 48: Optical Icon Alignment, Focus Rings & Micro-Interactions
  - [ ] Optical flex alignment (`inline-flex`, `align-items: center`, `gap: 6px`) and icon sizing (`14px` inside buttons, `16px` in headers, `20px` in hero banners)
  - [ ] High-contrast WCAG 2.1 AA focus rings (`:focus-visible` glow `0 0 0 3px rgba(18,137,127,0.25)`) and snappy `100ms ease-out` hover states
- [ ] Step 49: Viewport Density Optimization & 3-Pane Layout Improvisation
  - [ ] Responsive screen scaling for 13" laptops (zero-scroll fitted 3-pane console) up to 27" 4K displays

---

## Phase 28: Cloud CI/CD & Production Environment Config `[PRIORITY: MEDIUM]` *(Docker Deferred)*

- [ ] Step 50: Production Configuration & CI Pipeline
  - [ ] Environment config (`VITE_API_URL`, `VITE_WS_URL`)
  - [ ] Backend Gunicorn/Uvicorn workers config & HTTPS rate limiting in `server.py`
  - [ ] GitHub Actions CI pipeline (`.github/workflows/ci.yml`) for automated linting, testing, and deployment

---

## Phase 27: Performance, Caching & Offline Resilience `[PRIORITY: MEDIUM - PERFORMANCE]`

- [ ] Step 47: Caching & Offline Storage
  - [ ] Response caching with Redis / in-memory LRU for common drug dosages
  - [ ] Service Worker & IndexedDB offline audio blob recording queue

---

## 💡 Recommended Future Roadmap (Bonus Extensions)

### Phase 28: Electronic Health Record (EHR) / FHIR Standard Export `[RECOMMENDED / OPTIONAL BONUS]`
- [ ] Step 48: HL7 FHIR Interoperability Standard
  - [ ] Build `fhirExporter.py` converting prescriptions to HL7 / FHIR JSON standard resources
  - [ ] REST endpoint `GET /api/prescription/:id/fhir` for hospital EHR system integration

---

### Phase 29: E-Prescription Aadhaar Digital Signature (e-Sign) `[RECOMMENDED / OPTIONAL BONUS]`
- [ ] Step 49: Cryptographic Doctor Signature Verification
  - [ ] Aadhaar e-Sign / PKI digital signature verification module for Telemedicine Guidelines 2020 compliance
  - [ ] Embed cryptographic signature stamp on PDF exports

---

## 🚀 Enterprise Expansion Roadmap (Senior UX & Clinical Solutions)

### Phase 30: Real-Time Speaker Diarization Engine `[PRIORITY: HIGH - CLINICAL CONTEXT]`
- [ ] Step 50: Doctor vs. Patient Speech Channeling
  - [ ] Dual-channel audio stream separation & PyAnnote / Whisper diarization backend integration in `agents/speech_agent.py`
  - [ ] Colored dual-bubble transcript stream in `LiveTranscriptPanel.tsx` (`[Doctor]` vs `[Patient]`)

---

### Phase 31: Automated ICD-10 Medical Billing Auto-Coder `[PRIORITY: HIGH - HOSPITAL BILLING]`
- [ ] Step 51: ICD-10 Clinical Coding & Differential Diagnosis
  - [ ] ICD-10 clinical diagnosis code database & Gemini auto-coder mapping in `agents/prescription_agent.py`
  - [ ] 1-Click ICD-10 autocomplete chips and differential diagnosis popover in `DraftPanel.tsx`

---

### Phase 32: Interactive Vitals & Chronic Disease Progression Analytics `[PRIORITY: HIGH - CLINICAL TRENDS]`
- [ ] Step 52: Longitudinal Patient Vitals Analytics
  - [ ] Recharts interactive vitals tracking (BP, HbA1c, Blood Glucose, Weight, SpO2) across historical consultations
  - [ ] Patient Dossier health progression trends dashboard in `PatientsPage.tsx`

---

### Phase 33: Offline-First PWA with IndexedDB Audio Sync Queue `[PRIORITY: HIGH - OFFLINE RESILIENCE]`
- [ ] Step 53: Offline Audio Queue & Background Sync
  - [ ] Service Worker offline caching & IndexedDB storage queue (`idb-keyval`) for audio blobs when clinic Wi-Fi drops
  - [ ] Automatic background sync engine pushing offline consultations to MongoDB Atlas upon network reconnection

---

### Phase 34: Pediatric & Renal Clinical Dosage Safety Calculator `[PRIORITY: HIGH - PATIENT SAFETY]`
- [ ] Step 54: Weight-Based Pediatric & Renal Clearance Calculation
  - [ ] mg/kg pediatric dosage and GFR renal clearance calculation engine based on patient age, weight, and diagnosis
  - [ ] Safe dosage range indicators and clinical warning badges directly inside `MedicineRow.tsx`



