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

- [x] Step 42: Decommission WhatsApp / SMS Dependencies
  - [x] Decommission legacy Meta WhatsApp Cloud API credentials and simulation handlers in `agents/whatsapp_agent.py`
  - [x] Remove WhatsApp dispatch triggers from `ai_prescription_agent.py` workflow orchestrator and `server.py`
  - [x] Remove WhatsApp tab controls in `SettingsPage.tsx` and WhatsApp status badges in `DraftPanel.tsx` and `DashboardPage.tsx`

---

## Phase 23: Production Email Dispatch Engine (`EmailAgent`) `[PRIORITY: HIGH - COMMUNICATION]`

- [x] Step 43: Build `EmailAgent` & REST Integration
  - [x] Create Python SMTP / Resend API email agent (`agents/email_agent.py`) sending styled HTML prescription emails
  - [x] Automatically attach DOB-password-encrypted ReportLab prescription PDFs
  - [x] Build REST endpoints `POST /api/prescription/send-email` and `POST /api/pharmacy/email-receipt` in `server.py`
  - [x] Add Email tab controls in `SettingsPage.tsx`, patient email input fields in `DraftPanel.tsx`, and 1-click **Send Email Prescription** CTA
  - [x] Implement dual receipt dispatch sending prescription receipts to both Patient Email and Hospital Pharmacy Desk

---

## Phase 24: Patient Web Push Notification Engine (Service Worker + VAPID Keys) `[PRIORITY: HIGH - NOTIFICATIONS]`

- [x] Step 44: VAPID Key Generation, Service Worker & Universal Device Authorization
  - [x] Generate VAPID public/private key pairs and add `pywebpush` backend push dispatcher in `server.py`
  - [x] Create browser Service Worker (`ui/public/sw.js`) handling background push events and native OS notifications
  - [x] Build **Universal iOS & Android Authorization Modal**: Custom gesture-triggered permission window with smart OS detector (`iOS / Android`) complying with Apple Safari user-gesture standards
  - [x] Build **Patient Notification Control Toggle (ON/OFF)**: Interactive push notification preference toggle in patient portal and settings allowing users to enable/disable alerts anytime
  - [x] REST API endpoints (`POST /api/notifications/subscribe`, `POST /api/notifications/toggle`) persisting subscription endpoints & ON/OFF preference states in MongoDB Atlas
  - [x] Trigger instant lock-screen phone notifications when prescriptions or pharmacy receipts are generated

---

## Phase 25: Full Patient Portal Web Application Suite `[PRIORITY: HIGH - PATIENT PORTAL]`

### Phase 25A: Patient Phone Authentication & Profile Dashboard
- [x] OTP / Phone login screen for patients (`/patient/login`)
- [x] Patient Dashboard showing active prescriptions, upcoming appointments, and clinic contacts

### Phase 25B: Prescription & Lab Test History Viewer
- [x] Interactive timeline of past consultations and downloadable PDFs
- [x] Active medication reminders & dosage schedule view

### Phase 25C: Push Notification & Communication Preferences Center
- [x] Live toggle for Web Push and Email notifications
- [x] Device management (view subscribed browsers/devices)

### Phase 25D: Instant Welcome Push Notification & Auto-Verification
- [x] Automatic instant welcome push notification upon subscribing
- [x] Instant test notification button directly inside the Patient Portal UI

---

## Phase 26: Email & Web Push Prescription Dispatch Engine Verification `[PRIORITY: HIGH - EMAIL & PUSH VERIFICATION]`

- [x] Step 45: Email Dispatch REST Endpoint (`POST /api/prescription/send-email`)
  - [x] Build official `/api/prescription/send-email` REST endpoint in `server.py` wrapping `EmailAgent`
  - [x] Attach generated DOB-password encrypted PDF from `output/prescriptions` to HTML prescription email
- [x] Step 46: End-to-End Email & Web Push Verification Suite (`test_phase26_email.py`)
  - [x] Execute automated consultation PDF generation, email dispatch from `scriptiq.sk@gmail.com` to `saksham.kj.3736@gmail.com`, and Web Push dispatch to `9888478606` with 100% SUCCESS.

---

## Phase 30: Multi-Lingual Hindi / Hinglish Audio & Clinical Translation Engine `[PRIORITY: HIGH - MULTI-LINGUAL STT]`

- [x] Step 45: Multi-Lingual Hindi / Hinglish Speech Support & Translation
  - [x] Upgrade `SpeechAgent` (`agents/speech_agent.py`) with regional multi-lingual prompting & Hindi/Hinglish clinical term translation
  - [x] Add Language Selector dropdown (`English` / `Hinglish` / `Hindi`) in `LiveTranscriptPanel.tsx` and `TopBar.tsx`
  - [x] Ensure Gemini LLM extraction engine parses mixed Hindi/English doctor audio seamlessly into clean structured JSON

---

## Phase 31: Advanced Speech Recognition Resiliency & Medical STT Optimization `[PRIORITY: HIGH - CLINICAL SPEECH ACCURACY]`

- [x] Step 48: Multi-Tiered Speech Recognition Accuracy & Fallback Optimization
  - [x] Upgrade local `faster-whisper` model from `tiny` to `small` for high-accuracy phonetic decoding on CPU
  - [x] Inject medical initial prompt vocabulary (`Dolo 650`, `Pan 40`, `Combiflam`, `Azithromycin`, `Augmentin`, `Paracetamol`, `PCM`, `BD`, `TDS`, `HS`, `OD`, `QID`, `After Meals`, `Before Food`) into `SpeechAgent` STT pipeline
  - [x] Implement Gemini Multimodal Audio model fallback chain (`gemini-2.0-flash` -> `gemma-4-26b-a4b-it` -> `gemini-1.5-flash`) for 100% resilient audio transcription
  - [x] Integrate universal Hindi/Hinglish clinical phrase auto-translation and term normalization without requiring manual doctor language selection

---

## Phase 32: Clinical Extraction Engine & Demographics Precision Repair `[PRIORITY: HIGH - DATA COMPLETENESS]`

- [ ] Step 49: Full Demographic & Symptom Extraction Prompt & Regex Overhaul
  - [ ] Upgrade `PrescriptionAgent` system instructions and user prompts to extract formatted headers (`Chief Complaints:`, `Age:`, `Gender:`, `Date of Birth:`, `Phone Number:`) into structured JSON attributes (`chief_complaint`, `age`, `gender`, `dob`, `phone`)
  - [ ] Enhance regex heuristic fallback parser in `prescription_agent.py` to extract `chief_complaint` (e.g. `Fever and headache for 3 days`), `age`, `gender`, `dob`, `phone`, and `general_advice` when LLM extraction returns empty fields
  - [ ] Update `useExtraction.ts` to map all extracted demographic & complaint attributes into `draftStore` without dropping empty fields

---

## Phase 33: Master Agent Telemetry Stream Integration across All Consultation Routes `[PRIORITY: HIGH - REAL-TIME TELEMETRY]`

- [ ] Step 50: Universal Telemetry Broadcasting across REST & Audio Routes
  - [ ] Pass `telemetry_callback=sync_telemetry_callback` into `process_consultation` (`/api/consultation/process`), `process_audio_consultation` (`/api/consultation/audio`), and `approve_prescription` (`/api/prescription/approve`) in `server.py`
  - [ ] Emit step 1 (`SpeechAgent` transcribing & refining audio) and step 2 (`PrescriptionAgent` extracting JSON) telemetry events during manual voice/text extraction
  - [ ] Update `AutoPilotTelemetryConsole.tsx` to display active readiness state when Auto-Pilot is ON and subscribe to all real-time extraction telemetry events

---

## Phase 34: In-House Pharmacy Receipt & Template Management Suite `[PRIORITY: HIGH - PHARMACY OPERATIONS]`

### Sub-Phase 34A: Pharmacy Receipt Management Hub (`/receipts`)
- [x] **Step 51A.1: Receipts Management Page (`ReceiptsManagementPage.tsx`)**
  - Build `ReceiptsManagementPage.tsx` under `ui/src/pages/` and register `/receipts` route in `App.tsx` and sidebar navigation
  - Fetch and render all pharmacy receipts from MongoDB Atlas `pharmacy_orders` collection with real-time search (by Patient Name, Phone, or Order ID `PHARM-XXXX`)
  - Filter by status (`Pending Dispense`, `Dispensed / Paid`, `Cancelled`) with total billing revenue metrics

### Sub-Phase 34B: Receipt Detailed View & Print Engine
- [x] **Step 51B.1: Interactive Receipt Viewer Modal & Thermal Print Hub**
  - Build `ReceiptDetailModal.tsx` displaying itemized drug pricing, pack size, GST/tax calculation, pickup desk location, and total bill
  - 1-click Thermal Receipt Printer (`80mm Roll`) and ReportLab PDF Download button

### Sub-Phase 34C: Live Receipt Editing & Pricing Override Engine
- [x] **Step 51C.1: Interactive Edit Modal (`EditReceiptModal.tsx`) & REST Endpoint**
  - Build `EditReceiptModal.tsx` allowing pharmacists/staff to add/remove medicines, adjust item quantities, apply discount percentages (`0-50%`), or override unit prices
  - Build `/api/pharmacy/receipts/{order_id}` REST endpoint in `server.py` to recalculate total bill dynamically and update MongoDB document

### Sub-Phase 34D: Single & Batch Receipt Deletion Suite
- [x] **Step 51D.1: Single & Bulk Delete Action Bar**
  - Add single receipt delete button with confirm safety modal
  - Add checkbox multi-selection & sticky bottom bulk action bar to batch-delete receipts via `/api/pharmacy/receipts/delete-batch` REST endpoint

### Sub-Phase 34E: Custom Receipt Template Settings Studio (`/settings`)
- [x] **Step 51E.1: Receipt Template Customizer (`ReceiptTemplateSettings.tsx`)**
  - Add "Pharmacy Receipt Template" tab in `SettingsPage.tsx` (`/settings`)
  - Customization controls: Hospital Header Title, Logo URL/Upload, Address, GSTIN/Tax ID, Contact Phone, Paper Format (`80mm Thermal` vs `A4 Letterhead`), and Custom Terms (`"Medicines once sold cannot be returned without original receipt"`)
  - Real-time live receipt preview card updating dynamically as settings change


### Sub-Phase 34F: Real-Time Drug Inventory Stock Warning & Auto-Deduction Engine
- [x] **Step 51F.1: Inventory Stock Status Pills & Out-of-Stock Alert**
  - Display live stock availability badges (`In Stock: 120` vs `Low Stock: 4 left` vs `OUT OF STOCK`) in receipt billing editor
  - Block dispensing or trigger manager override prompt when order quantity exceeds available batch inventory

---

## Phase 35: Seamless Prescription-to-Receipt POS Bridge & Real-Time AI Telemetry Drawer `[PRIORITY: CRITICAL - WORKFLOW BRIDGE]`

### Sub-Phase 35A: Automatic Prescription-to-Receipt Bridge & Endpoint Suite
- [ ] **Step 52A.1: Auto-Receipt Generation on Prescription Approval**
  - Update prescription approval REST endpoint in `server.py` to format and insert a pharmacy receipt record into MongoDB (`pharmacy_receipts`)
  - Create REST endpoint `GET /api/consultations/recent` returning the most recent prescription with formatted items for POS loading

### Sub-Phase 35B: Receipts & POS Portal View & "⚡ Load Recent Prescription" Button
- [ ] **Step 52B.1: Default Receipts & Patient History Portal Appearance**
  - Set default tab in `ReceiptsManagementPage.tsx` to Patient & Receipt Records Portal view
- [ ] **Step 52B.2: 1-Click "⚡ Load Recent Prescription" POS Pre-Loader**
  - Add `⚡ Load Recent Prescription` button to `ReceiptsManagementPage.tsx`
  - Fetch recent consultation details (`GET /api/consultations/recent`) and auto-populate patient demographics, phone, doctor name, and prescribed medicines table

### Sub-Phase 35C: Master Agent Pipeline Receipt Integration
- [ ] **Step 52C.1: Master Agent Phase 7 Receipt Auto-Routing**
  - Add explicit Step 7 in `ai_prescription_agent.py` to auto-create and index pharmacy receipts in MongoDB during automated workflows

### Sub-Phase 35D: Floating AI Telemetry Drawer & Live Process Auto-Pop
- [x] **Step 52D.1: Compact Floating AI Telemetry Toggle Button**
  - Convert `AutoPilotTelemetryConsole.tsx` into a floating dockable drawer with a `🤖 AI Telemetry` status button (collapsed by default)
  - Auto-expand/pulse telemetry drawer when extraction/workflow is actively processing so doctors can observe real-time AI reasoning

---

## Phase 36: Universal Patient Age & Gender Clinical Demographics Integration `[PRIORITY: CRITICAL - CLINICAL ACCURACY]`

### Sub-Phase 36A: Backend API Request Models & Schema Contracts (`server.py`)
- [x] **Step 53A.1: Demographics Field Binding in Server Request Models**
  - Update `ProcessConsultationRequest`, `ApprovePrescriptionRequest`, and `PharmacyReceiptRequest` in `server.py` to accept `age: Optional[int]` and `gender: Optional[str]`
  - Include `age` and `gender` in `GET /api/consultations/recent` and `/api/consultations` JSON outputs

### Sub-Phase 36B: Master Agent Orchestration & Sub-Agent Pipeline (`ai_prescription_agent.py`)
- [x] **Step 53B.1: Age & Gender Parameter Pass-Through**
  - Update `AIPrescriptionAgent` workflow methods (`generate_prescription`, `approve_and_send_prescription`, `process_pharmacy_choice`, `run_full_automated_workflow`) to accept `age` and `gender` arguments and preserve them in final outputs

### Sub-Phase 36C: ReportLab PDF Header Demographics Renderer (`pdf_agent.py`)
- [x] **Step 53C.1: Prominent Age & Gender PDF Formatting**
  - Format `Age` and `Gender` cleanly in ReportLab Patient Demographics Table (`Age / Gender: {age} Yrs / {gender}`)

### Sub-Phase 36D: Doctor Console & Intake State Binding (`PatientIntakeSpace.tsx` & `DraftPanel.tsx`)
- [x] **Step 53D.1: 2-Way Sync for Age & Gender in Draft Store**
  - Ensure `age` and `gender` inputs in `PatientIntakeSpace.tsx` and `DraftPanel.tsx` update `draftStore` immediately and are passed to approval endpoints

### Sub-Phase 36E: History, Patient Portal & Pharmacy POS Views (`HistoryPage.tsx`, `PatientPortalPage.tsx`, `ReceiptsManagementPage.tsx`)
- [x] **Step 53E.1: Universal Age & Gender Badges Across All Views**
  - Render `Age` and `Gender` pills on History cards, Patient Portal dossier header, and Pharmacy POS billing inputs

---

## Phase 37: Removal of Redundant Status Stepper UX & Consolidation into AI Telemetry Drawer `[PRIORITY: HIGH - UX OPTIMIZATION]`

### Sub-Phase 37A: Prescription Draft Pane UI Streamlining (`DraftPanel.tsx`)
- [x] **Step 54A.1: Remove Redundant Horizontal Status Timeline Banner**
  - Remove `<StatusTimeline />` component rendering from `DraftPanel.tsx` to eliminate top vertical clutter and streamline prescription editor focus

### Sub-Phase 37B: Lifecycle Stepper Consolidation in AI Telemetry Drawer (`AutoPilotTelemetryConsole.tsx`)
- [x] **Step 54B.1: Consolidate Lifecycle Progress in Telemetry Stream**
  - Ensure prescription lifecycle progress (`Draft → Reviewed → Saved → Dispatched → Viewed`) is seamlessly tracked inside the 7-step Master Agent Telemetry drawer and WebSocket stream

---

## Phase 38: Live AI Processing Shimmer & Telemetry Active Status Banner `[PRIORITY: HIGH - UX ANIMATION]`

### Sub-Phase 38A: Dynamic AI Extraction Processing Animation Banner (`AIDraftExtractionBanner.tsx`)
- [x] **Step 55A.1: Animated Extraction Processing Shimmer Bar**
  - Build `AIDraftExtractionBanner.tsx` displaying an animated shimmer progress bar and live step transitions (`🎙️ Audio STT` → `🧠 Gemini LLM Parsing` → `📝 Structuring Rx`) when extraction is in progress

### Sub-Phase 38B: Post-Extraction AI Telemetry Active Status Confirmation
- [x] **Step 55B.1: 1-Click Telemetry Active Pill Badge**
  - Display `"🤖 AI Telemetry Active & Monitoring"` status pill after extraction completes, allowing 1-click toggle of the Master Agent Telemetry drawer in the Sidebar

---

## Phase 39: Isolated 80mm Thermal Receipt Print Engine & UI Element Hiding `[PRIORITY: CRITICAL]`
- [x] **Sub-Phase 39A: Thermal Receipt Print Isolation Rules (`ReceiptsManagementPage.tsx`)**
  - Implemented `@media print` element isolation suppressing all surrounding UI layout elements (Sidebar, TopBar, POS controls, inputs, action buttons)
  - Formatted official 80mm thermal receipt container (`#thermal-receipt`) with hospital header, patient demographics, line items table, subtotal, 5% GST tax, grand total, and payment verification badge

## Phase 40: Official Letterhead Receipt Page (`/receipt/:orderId`) Mapping to POS Print Button `[PRIORITY: CRITICAL]`
- [x] **Sub-Phase 40A: Direct Official Receipt Mapping & Auto-Print Launch**
  - Connect POS Print button on `ReceiptsManagementPage.tsx` to issue receipt via REST API (`POST /api/pharmacy/receipts`) and launch the official letterhead receipt page (`/receipt/${orderId}?autoprint=true`) in a new tab with automatic print invocation

---

## Phase 41: Refund, Returns & Credit Voucher Studio UI Wireup `[PRIORITY: HIGH - PHARMACY]`
- [ ] **Sub-Phase 41A: Drug Return & Restock Action Button (`ProcessReturnModal.tsx`)**
  - Wire "Return / Refund" action button in `ReceiptsManagementPage.tsx` and `ReceiptViewPage.tsx` to launch `ProcessReturnModal.tsx` for partial/full drug returns, inventory restock, and issuing Credit Refund Vouchers (`REFUND-YYYYMMDD-XXXX`)

## Phase 42: Interactive Receipt Editor & Pricing Override Suite `[PRIORITY: HIGH - PHARMACY]`
- [ ] **Sub-Phase 42A: Receipt Modification & Discount Action Bar (`EditReceiptModal.tsx`)**
  - Add "Edit Receipt" action button to history rows in `ReceiptsManagementPage.tsx` launching `EditReceiptModal.tsx` to override prices, adjust quantities, apply discounts (0–50%), and call `POST /api/pharmacy/receipts/{order_id}`

## Phase 43: Interactive Popover Receipt Inspector `[PRIORITY: HIGH - UX ERGONOMICS]`
- [ ] **Sub-Phase 43A: Inline Row Click Popover Inspector (`ReceiptDetailModal.tsx`)**
  - Bind history table row click events on `ReceiptsManagementPage.tsx` to open `ReceiptDetailModal.tsx` popover inspector for quick itemized breakdown, tax details, and thermal print buttons without navigating away

## Phase 44: Manual AI Extraction Model Selector & Fallback Console `[PRIORITY: HIGH - AI CONTROL]`
- [ ] **Sub-Phase 44A: Doctor Model Selector Dropdown (`TopBar.tsx` & `DraftPanel.tsx`)**
  - Add AI Model Selector dropdown (`Gemini 2.0 Flash` vs `Gemma 4 26B` vs `Gemini 1.5 Flash` vs `Heuristic Regex`) in `TopBar.tsx` and `DraftPanel.tsx`, allowing doctors to manually pick or switch AI extraction models for consultation processing

## Phase 45: 1-Click Patient Web Push Test Trigger in Doctor Console `[PRIORITY: HIGH - NOTIFICATIONS]`
- [ ] **Sub-Phase 45A: Console Notification Testing CTA (`SendPrescriptionModal.tsx`)**
  - Add "Test Push Notification" button directly inside `SendPrescriptionModal.tsx` and `DoctorConsolePage.tsx` to verify lock-screen smartphone alerts before dispatching prescriptions

## Phase 46: Interactive Medication Alarm Timers & Scheduled Push Reminders `[PRIORITY: HIGH - PATIENT]`
- [ ] **Sub-Phase 46A: Time-of-Day Dose Alarm Actions (`PatientPortal.tsx`)**
  - Wire visual dosage cards (🌅 Morning 1x, ☀️ Afternoon 0x, 🌙 Evening 1x) in `PatientPortal.tsx` to set active browser alarm timers and push dose reminders on schedule

---


### Sub-Phase 34G: Multi-Payment Split Mode & Dynamic UPI QR Code Generator
- [x] **Step 51G.1: Multi-Payment Breakdown & Interactive UPI QR Modal**
  - Support split payments: `Cash`, `UPI / GPay`, `Credit/Debit Card`, and `Insurance Co-Pay`
  - Auto-generate dynamic Indian UPI Payment QR Code inside receipt modal for instant patient smartphone scan & pay

### Sub-Phase 34H: 1-Click Digital Receipt Dispatch (Email & Push Alert)
- [x] **Step 51H.1: Omni-Channel Receipt Delivery System**
  - 1-click "Send Digital Receipt" button dispatching DOB-password protected PDF receipt via Gmail SMTP (`saksham2435157@gmail.com`)
  - Trigger mobile Web Push notification alert directly to patient smartphone with download link

### Sub-Phase 34I: Refund, Returns & Credit Voucher Audit Trail Studio
- [x] **Step 51I.1: Partial Return / Refund Modal & Immutable Audit Log**
  - Build `ProcessReturnModal.tsx` allowing partial or full drug returns with restock inventory adjustment
  - Issue Credit Refund Vouchers (`REFUND-20260727-XXXX`) preserving revenue analytics audit integrity

### Sub-Phase 34J: Keyboard-First POS Billing Velocity Mode (`Cmd/Ctrl + K`)
- [x] **Step 51J.1: Ultra-Fast Keyboard Shortcuts & POS Hotkeys**
  - Full keyboard shortcut navigation (`N` for New Receipt, `/` or `F` for Fast Search, `P` for Thermal Print, `D` for Quick Discount, `Esc` to Close Modal)
  - Floating keyboard shortcut cheatsheet pill for high-volume hospital billing pharmacists

---

## Phase 27: Master Agent Live Telemetry & AI Thinking Console `[PRIORITY: HIGH - AI TRANSPARENCY]`

- [x] Step 46: Real-Time Sub-Agent Telemetry & Progress Stepper Stream
  - [x] Upgrade `/ws/master_agent` WebSocket stream in `server.py` to yield real-time step execution events (`SpeechAgent` -> `PrescriptionAgent` -> `PDFAgent` -> `DatabaseAgent` -> `EmailAgent` -> `PharmacyAgent`)
  - [x] Build **`AutoPilotTelemetryConsole.tsx`**: Floating glassmorphism UI telemetry panel displaying step-by-step AI working progress (e.g. `[✓] Step 1/6: Transcribing audio`, `[⚡] Step 2/6: Extracting JSON with gemma-4-26b...`, `[ ] Step 3/6: Generating PDF...`)
  - [x] Implement staggered UI field revealing and pulse animations as each backend agent completes its stage
  - [x] Enforce Auto-Pilot conditional rendering: Master Agent Telemetry Console appears ONLY when Auto-Pilot is ON (`isAutoPilotEnabled === true`) and hides completely when OFF

---

## Phase 28: Dedicated Patient Demographics & Clinical Intake Space in Doctor Console (Voice & Typed Input) `[PRIORITY: HIGH - CLINICAL CONSOLE]`
- [x] Step 47: Patient Intake Space Component & AI Demographics Extractor
  - [x] Build `PatientIntakeSpace.tsx` in Doctor Console (`/console`) with dual Voice & Typed intake controls
  - [x] Voice input parser extracting patient name, age, gender, DOB, phone number, and chief complaints into `draftStore`
  - [x] Instant 1-click patient demographic pre-hydration before generating prescription PDF

---

## Phase 29: System Core Repair & End-to-End Delivery Realization `[PRIORITY: HIGH - PLANNED FUTURE WORK]`

### Phase 29A: AI Extraction Engine Resiliency & Fast Retry
- [x] Implement multi-model fallback retry (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemma-4-26b-a4b-it`, heuristic extraction) in `PrescriptionAgent` (< 3s response)
- [x] Connect `useExtraction.ts` and `DoctorConsolePage.tsx` to immediately populate `draftStore` with structured medicines, dosages, and complaints

### Phase 29B: ReportLab PDF DOB Password Encryption Enforcement
- [x] Pass patient DOB (`DDMMYYYY`) from consultation payload into ReportLab `StandardEncryption`
- [x] Enforce PDF password protection automatically on all generated prescription exports

### Phase 29C: Production Gmail SMTP Email Dispatch Integration (`scriptiq.sk@gmail.com`)
- [x] Configure live Gmail SMTP TLS connection (`smtp.gmail.com:587`) from `scriptiq.sk@gmail.com` to `saksham.kj.3736@gmail.com`
- [x] Attach DOB-password protected PDF prescription with HTML letterhead email template

### Phase 29D: Multi-Device Mobile Web Push Notification Engine
- [x] Upgrade Mobile Service Worker notification permission & VAPID subscription flow in `PatientDashboardPage.tsx`
- [x] Enforce WNS/FCM TTL header (`86400`) in `push_agent.py` for instant mobile lock-screen alerts

### Phase 29E: Minimal & Clean Patient Portal Suite
- [x] Streamline `PatientDashboardPage.tsx` into a minimal patient view with active prescription card, medication schedule, and quick push toggle

### Phase 29F: Patient Portal Navigation & TopBar Alignment
- [x] Align Patient Portal header to use identical ScriptIQ Teal (`#12897F`) branding, logo, profile pill, and theme toggle as Doctor Console `<TopBar />`

---

## Phase 30: Structural Layout Improvisation Engine `[PRIORITY: HIGH - UI/UX ERGONOMICS & ARCHITECTURAL AUDIT]`

### 📊 Master Architectural & UI/UX Audit Analysis Report

> [!IMPORTANT]
> **Audit Assessment**: Evaluated as World's Top 1% Staff Systems Architect & Senior Product Designer.
> Below is the non-biased evaluation of ScriptIQ's layout density, typography hierarchy, component spatial grid, accessibility (WCAG 2.1 AA/AAA), and design token alignment across all 5 core modules.

| Module / View | Current Vulnerability / Ergonomic Deficit | Proposed Structural Improvisation | Target Sub-Phase |
| :--- | :--- | :--- | :--- |
| **Doctor Console (`/console`)** | Overcrowded `<TopBar />` controls wrap on <1280px screens; 3-pane fixed width percentages (`42%`) cause vertical scroll jumps on 13" laptops. | Modular header grouping into 3 `<ControlCapsules />`; auto-adjusting flex-split layout (30%/40%/30%) fitting 100vh viewport snugly with zero page scroll. | **Phase 30A** |
| **Patient Portal (`/patient`)** | Raw text dosage codes (`1-0-1`, `0-0-1`); tab navigation buttons wrap awkwardly on mobile (<600px). | Visual Medication Schedule with sun/moon icons (🌅 Morning, ☀️ Afternoon, 🌙 Evening); sticky bottom tab bar for mobile web app; 1-click DOB password unlock modal. | **Phase 30B** |
| **History & Patients (`/history`)** | Batch check selection lacks a sticky floating bulk action bar; empty search result state shows raw text without action CTAs. | Floating Bulk Action Bar (`[N Selected] Export CSV \| Delete Batch \| Send Reminders`); polished SVG empty state; `J/K` keyboard navigation. | **Phase 30C** |
| **Analytics (`/dashboard`)** | Fixed chart heights cause clipping on 13" displays; lacks disease trend and top prescribed drug frequency telemetry. | Responsive SVG Chart container with auto-scaling viewport height; top 10 prescribed drug frequency & outbreak telemetry widgets. | **Phase 30D** |
| **Auth & Settings (`/login`)** | Password inputs lack show/hide toggle; typography hierarchy inconsistent; spatial padding varies (mix of 12px, 15px, 20px). | Standardized 8px baseline spatial tokens (`var(--space-2)`..`var(--space-8)`); 7-level typography scale (`Space Grotesk`, `Plus Jakarta Sans`, `IBM Plex Mono`); password eye toggle. | **Phase 30E** |

---

### 🎨 Design System Tokens, Typography & Motion Architecture

```css
/* Core Tokens induced into index.css */
:root {
  /* Spatial Tokens (8px Baseline Grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Typography Stack */
  --font-display: 'Space Grotesk', sans-serif;       /* Titles, Headers & Telemetry Counters */
  --font-body: 'Plus Jakarta Sans', sans-serif;     /* UI Content, Clinical Notes & Form Labels */
  --font-mono: 'IBM Plex Mono', monospace;          /* Rx IDs, Timings (1-0-1), Timestamps */

  /* Typography Modular Scale */
  --text-display-lg: 700 28px/1.2 var(--font-display);
  --text-h1: 700 22px/1.25 var(--font-display);
  --text-h2: 600 18px/1.3 var(--font-display);
  --text-h3: 600 15px/1.4 var(--font-display);
  --text-body-lg: 400 14px/1.5 var(--font-body);
  --text-body-md: 400 13px/1.5 var(--font-body);
  --text-caption: 500 11px/1.4 var(--font-body);
  --text-mono-code: 500 10px/1.3 var(--font-mono);

  /* Button Scale */
  --btn-height-sm: 32px;
  --btn-height-md: 38px;
  --btn-height-lg: 46px;

  /* Animation Physics */
  --motion-fast: 100ms cubic-bezier(0.16, 1, 0.3, 1);
  --motion-normal: 200ms cubic-bezier(0.16, 1, 0.3, 1);
  --motion-slow: 350ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

### Sub-Phase 30A: Doctor Console & 3-Pane Ergonomics (`/console`)
- [x] **Step 48A.1: Header Control Clustering & TopBar Density Optimization**
  - [x] Group top bar actions into 3 isolated visual capsules: Patient Context (Left), AI Controls (`Auto-Pilot` + `Language Mode` + `Search` - Center), and User Profile (`Theme` + `Notifications` + `Avatar` - Right).
  - [x] Add horizontal scrolling overflow handler for ultra-small viewports (<1024px).
- [x] **Step 48A.2: Viewport-Fitted 3-Pane Flex-Split Layout (100vh Zero-Scroll)**
  - [x] Transition 3-pane container from static percentage widths to flex-calc boundaries (`min-width: 300px` Left, `flex: 1.2` Center, `min-width: 420px` Right).
  - [x] Enforce zero-page-scroll behavior on 13", 15", and 27" screens with independent inner pane scrollbars (`::-webkit-scrollbar` styled).
- [x] **Step 48A.3: Dynamic Waveform Spine & Audio Peak Meter**
  - [x] Add real-time audio peak dB level ripple animation (`pulse-ring`) during live microphone recording.
- [x] **Step 48A.4: Optical Icon & Text Baseline Alignment**
  - [x] Align icon-text pairings (`inline-flex`, `align-items: center`, `gap: 6px`) across transcript bubbles and edit actions.

### Sub-Phase 30B: Patient Portal Mobile & Visual Dose Hierarchy (`/patient`)
- [x] **Step 48B.1: Visual Time-of-Day Dosage Hierarchy**
  - [x] Transform dosage strings (`1-0-1`, `Twice Daily`) into visual icon badges (🌅 Morning 1x, ☀️ Afternoon 0x, 🌙 Evening 1x).
  - [x] Add color-coded meal timing pills (`After Meals` -> Emerald `#12897F`, `Before Food` -> Amber `#D97706`).
- [x] **Step 48B.2: Mobile Responsive Glassmorphism Bottom Bar**
  - [x] Replace top tab row with a sticky glassmorphism bottom navigation bar for mobile web app users (<600px).
- [x] **Step 48B.3: Interactive 1-Click DOB Password Unlock Modal**
  - [x] Provide an inline DOB password unlock modal for instant PDF prescription decryption without requiring manual copy/paste.
- [x] **Step 48B.4: High-Contrast AAA Typography for Elderly Patients**
  - [x] Enforce 7.0:1 AAA text contrast ratio across all patient portal cards and medication instructions.

### Sub-Phase 30C: Consultation Records & Bulk Action Suite (`/history` & `/patients`)
- [ ] **Step 48C.1: Floating Sticky Bulk Action Bar**
  - [ ] Render animated floating glassmorphism action bar at bottom of screen when $\ge 1$ patient rows are selected.
  - [ ] Actions: `Export Selected (CSV/ZIP)`, `Batch Delete (MongoDB)`, `Bulk Email Reminders`.
- [ ] **Step 48C.2: Vector Empty States & 1-Click Search Reset**
  - [ ] Replace plain empty text with high-fidelity vector illustrations and quick-reset filter buttons.
- [ ] **Step 48C.3: Keyboard Navigation & Shortcuts Accessibility**
  - [ ] Add keyboard navigation shortcuts (`J/K` row navigate, `Enter` view details, `Esc` close modal, `/` focus search input).
- [ ] **Step 48C.4: Visual Lifecycle Status Timeline Cards**
  - [ ] Render 5-stage status stepper (`Draft` -> `Reviewed` -> `Saved` -> `Dispatched` -> `Viewed`) with real-time status badges.

### Sub-Phase 30D: Clinical Analytics Dashboard & Spatial Charting (`/dashboard`)
- [ ] **Step 48D.1: Auto-Scaling SVG Chart Containers**
  - [ ] Wrap Recharts components (`AreaChart`, `BarChart`, `PieChart`) in responsive auto-scaling wrappers preventing horizontal/vertical clipping.
- [ ] **Step 48D.2: Top Prescribed Drug Frequency & Outbreak Telemetry**
  - [ ] Build real-time top 10 prescribed drug ranking table and disease symptom breakdown bar chart.
- [ ] **Step 48D.3: Revenue & Pharmacy Dispatch Conversion Gauges**
  - [ ] Add real-time pharmacy dispatch conversion gauges and hospital desk performance telemetry.
- [ ] **Step 48D.4: Ambient Dark Mode Glow Charts**
  - [ ] Apply translucent glow gradients (`rgba(18,137,127,0.2)`) and custom tooltips to analytics charts.

### Sub-Phase 30E: Auth & Settings Design Token System (`/login` & `/settings`)
- [x] **Step 48E.1: 8px Baseline Spatial Grid & Typography Scale Token System**
  - [x] Enforce strict 8px baseline spatial tokens (`--space-1`..`--space-8`) and 7-level typography scale in `index.css`.
  - [x] Standardize 3-tier button heights (`32px` Small, `38px` Medium, `46px` Large CTA) across all application views.
- [x] **Step 48E.2: Password Show/Hide Toggle & Inline Validation**
  - [x] Add interactive eye icon button (`Eye` / `EyeOff`) to password inputs in `LoginPage.tsx` and `RegisterRequest`.
- [x] **Step 48E.3: High-Contrast Focus Rings & Micro-Interactions**
  - [x] Apply `:focus-visible` glow rings (`0 0 0 3px rgba(18,137,127,0.25)`) and snappy `100ms ease-out` hover scale transforms (`scale(1.02)`).

---

## Phase 48: Production Monorepo Restructuring & Dual-Platform Cloud Deployment Suite (Vercel + Render) `[PRIORITY: HIGH - DEPLOYMENT]`

- [ ] Step 60: Monorepo Folder Organization (`frontend/`, `backend/`, `tests/`)
  - [ ] Rename `ui/` to `frontend/` with Vercel SPA routing (`vercel.json`)
  - [ ] Move Python server & agents into `backend/` with Render Blueprint (`render.yaml`)
  - [ ] Consolidate unit & integration test scripts into `tests/` directory
  - [ ] Create `.env.example` and `DEPLOYMENT.md` deployment guide
---

## Phase 49: Clinical Intake Engine Fixes — DOB Extraction, Auto-Age Calculation & Transcript Email Parsing `[PRIORITY: CRITICAL - CLINICAL INTAKE]`
- [ ] Step 61: Auto-Calculate Age from DOB & Transcript Email Address Extraction
  - [ ] Auto-calculate age in years from DOB in `DraftPanel.tsx` / `PatientIntakeSpace.tsx`
  - [ ] Parse patient email address from transcript in `PrescriptionAgent`

---

## Phase 50: PDF Password Encryption Synchronization & Doctor Console Security Badge `[PRIORITY: CRITICAL - SECURITY & PDF]`
- [ ] Step 62: Password Parity Engine & Doctor Console Security Badge
  - [ ] Unify password resolution helper in `config.py` ensuring 100% parity between `PDFAgent` and `EmailAgent`
  - [ ] Render visible security badge with 1-click password copy in `SendPrescriptionModal.tsx` / `DraftPanel.tsx`

---

## Phase 51: Receipt Lifecycle Gating & Cashier Payment Status Control `[PRIORITY: HIGH - PHARMACY POS]`
- [ ] Step 63: Gated Receipt Creation & Payment Status Control
  - [ ] Default auto-created receipts to `"Pending Payment"` instead of premature `"Paid"` status
  - [ ] Require explicit cashier payment action (Cash, UPI QR, Card) before marking receipt as `"Paid"`

---

## Phase 52: Patient Receipts Portal — Receipt Deletion & POS Bill Re-Loading Suite `[PRIORITY: HIGH - PHARMACY STORAGE & UX]`
- [ ] Step 64: REST API Receipt Deletion & "⚡ Re-Load into POS Builder" Button
  - [ ] Endpoint `DELETE /api/pharmacy/receipts/{order_id}` with typed confirmation modal in `ReceiptsManagementPage.tsx`
  - [ ] Add "⚡ Re-Load into POS Builder" button to receipt rows for instant re-dispensing / editing

---

## Phase 53: Patient Receipts Portal — Stock Tab Replacement with Patient Receipts Explorer `[PRIORITY: HIGH - UX]`
- [ ] Step 65: Replace Stock Inventory Tab with Patient Receipts Explorer
  - [ ] Replace redundant "Stock Inventory" tab in `ReceiptsManagementPage.tsx` with "Patient Receipts Explorer" for live patient search and itemized breakdown inspection

---

## Phase 54: Performance, Caching & Offline Resilience `[PRIORITY: MEDIUM - PERFORMANCE]`

- [ ] Step 66: Caching & Offline Storage
  - [ ] Response caching with Redis / in-memory LRU for common drug dosages
  - [ ] Service Worker & IndexedDB offline audio blob recording queue

---

## 💡 Recommended Future Roadmap (Bonus Extensions)

### Phase 55: Electronic Health Record (EHR) / FHIR Standard Export `[RECOMMENDED / OPTIONAL BONUS]`
- [ ] Step 67: HL7 FHIR Interoperability Standard
  - [ ] Build `fhirExporter.py` converting prescriptions to HL7 / FHIR JSON standard resources
  - [ ] REST endpoint `GET /api/prescription/:id/fhir` for hospital EHR system integration

---

### Phase 56: E-Prescription Aadhaar Digital Signature (e-Sign) `[RECOMMENDED / OPTIONAL BONUS]`
- [ ] Step 68: Cryptographic Doctor Signature Verification
  - [ ] Aadhaar e-Sign / PKI digital signature verification module for Telemedicine Guidelines 2020 compliance
  - [ ] Embed cryptographic signature stamp on PDF exports

---

## 🚀 Enterprise Expansion Roadmap (Senior UX & Clinical Solutions)

### Phase 57: Real-Time Speaker Diarization Engine `[PRIORITY: HIGH - CLINICAL CONTEXT]`
- [ ] Step 69: Doctor vs. Patient Speech Channeling
  - [ ] Dual-channel audio stream separation & PyAnnote / Whisper diarization backend integration in `agents/speech_agent.py`
  - [ ] Colored dual-bubble transcript stream in `LiveTranscriptPanel.tsx` (`[Doctor]` vs `[Patient]`)

---

### Phase 58: Automated ICD-10 Medical Billing Auto-Coder `[PRIORITY: HIGH - HOSPITAL BILLING]`
- [ ] Step 70: ICD-10 Clinical Coding & Differential Diagnosis
  - [ ] ICD-10 clinical diagnosis code database & Gemini auto-coder mapping in `agents/prescription_agent.py`
  - [ ] 1-Click ICD-10 autocomplete chips and differential diagnosis popover in `DraftPanel.tsx`

---

### Phase 59: Interactive Vitals & Chronic Disease Progression Analytics `[PRIORITY: HIGH - CLINICAL TRENDS]`
- [ ] Step 71: Longitudinal Patient Vitals Analytics
  - [ ] Recharts interactive vitals tracking (BP, HbA1c, Blood Glucose, Weight, SpO2) across historical consultations
  - [ ] Patient Dossier health progression trends dashboard in `PatientsPage.tsx`

---

### Phase 60: Offline-First PWA with IndexedDB Audio Sync Queue `[PRIORITY: HIGH - OFFLINE RESILIENCE]`
- [ ] Step 72: Offline Audio Queue & Background Sync
  - [ ] Service Worker offline caching & IndexedDB storage queue (`idb-keyval`) for audio blobs when clinic Wi-Fi drops
  - [ ] Automatic background sync engine pushing offline consultations to MongoDB Atlas upon network reconnection

---

### Phase 61: Pediatric & Renal Clinical Dosage Safety Calculator `[PRIORITY: HIGH - PATIENT SAFETY]`
- [ ] Step 73: Weight-Based Pediatric & Renal Clearance Calculation
  - [ ] mg/kg pediatric dosage and GFR renal clearance calculation engine based on patient age, weight, and diagnosis
  - [ ] Safe dosage range indicators and clinical warning badges directly inside `MedicineRow.tsx`
