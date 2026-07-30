# AI Prescription Agent - Master Development Index & Priority Roadmap

## Legend & Priority Tags:
- `[PRIORITY: CRITICAL - CORE]`: Mandatory core architectural infrastructure, AI engines, data persistence, and security.
- `[PRIORITY: HIGH]`: Essential system quality, data contracts, theme architecture, multi-channel delivery, and clinical workflows.
- `[PRIORITY: MEDIUM]`: Advanced workflow automation, offline caching, POS velocity billing, and master console UI extensions.
- `[RECOMMENDED / OPTIONAL BONUS]`: Recommended bonus extensions for regional multi-lingual STT, EHR compliance, and automated reminders.

---

## EXECUTIVE SYSTEM STATUS:
- **Total Completed Phases**: 38 Phases (Phases 1 through 38: 100% Implemented & Verified)
- **Active Sub-System Highlights**:
  - 🤖 **6-Agent Master Orchestrator**: `SpeechAgent`, `PrescriptionAgent`, `PDFAgent`, `DatabaseAgent`, `EmailAgent`, `PharmacyAgent`
  - ⚡ **Master Agent Telemetry Drawer**: Live 7-step execution stream with dockable sidebar drawer
  - 💊 **In-House Pharmacy POS Suite**: Velocity mode billing, thermal printing (80mm), dynamic UPI QR code generator, and recent prescription loader
  - 🔐 **PDF Password Encryption**: Patient DOB encryption on all ReportLab prescription PDF exports
  - 📱 **Omni-Channel Dispatch**: Gmail SMTP HTML emails, VAPID Web Push notifications, and Patient Web Portal
  - 👤 **Universal Patient Demographics**: Name, Age, Gender, Phone, Email, DOB pass-through across all REST endpoints, DB records, and UI components

---

# PART I: Core Foundation & Architectural Infrastructure (Phases 1–16)

## Phase 1: Project Initialization `[PRIORITY: CRITICAL - CORE]`
- [x] **Step 1: Create Project Structure**
  - [x] Create project workspace folder
  - [x] Configure integrated development terminal environment
- [x] **Step 2: Python Virtual Environment**
  - [x] Verify Python installation & create isolated venv (`.venv`)
  - [x] Upgrade pip and configure interpreter path
- [x] **Step 3: Root Directory Architecture**
  - [x] Create core directories (`agents/`, `database/`, `templates/`, `assets/`, `output/`, `docs/`)
  - [x] Configure `.gitignore` for security keys, `.env`, and Python cache artifacts

## Phase 2: Dependency Setup `[PRIORITY: CRITICAL - CORE]`
- [x] **Step 4: Install Core Libraries**
  - [x] Install Google Gemini AI SDK (`google-genai`)
  - [x] Install Environment Variable Manager (`python-dotenv`)
  - [x] Install PDF Engine (`reportlab`) & Image Processing (`Pillow`)
  - [x] Install Database Driver (`pymongo`) & HTML Template Engine (`jinja2`)
- [x] **Step 5: Project Configuration**
  - [x] Build `requirements.txt`
  - [x] Configure `.env` for API keys and database URIs
  - [x] Build `config.py` for global project constants and directory path definitions

## Phase 3: Database Helper Module `[PRIORITY: CRITICAL - CORE]`
- [x] **Step 6: MongoDB Connection & Helper Methods**
  - [x] Create MongoDB Atlas connection pool helper (`DBHelper`)
  - [x] Test database connectivity and database collection handles
  - [x] Implement standard CRUD operations (`insert_document`, `find_document`, `update_document`, `delete_document`)

## Phase 4: Sub-Agent Microservices Development `[PRIORITY: CRITICAL - CORE]`

### Agent 1 — Speech Agent (`agents/speech_agent.py`)
- [x] **Step 7: Speech Recognition Engine**
  - [x] Initialize `SpeechAgent` with Gemini audio multimodal model
  - [x] Convert doctor speech audio transcripts into refined clinical consultation text

### Agent 2 — Prescription Agent (`agents/prescription_agent.py`)
- [x] **Step 8: Structured Prescription Generation Engine**
  - [x] Design structured prompt for structured medicine extraction
  - [x] Parse medicines, dosages, frequencies, timings, precautions, tests, and follow-ups into structured JSON

### Agent 3 — PDF Agent (`agents/pdf_agent.py`)
- [x] **Step 9: ReportLab PDF Generation Engine**
  - [x] Load doctor credentials, clinic branding assets, and patient intake details
  - [x] Generate formatted clinical PDF prescription with patient DOB password encryption

### Agent 4 — Database Agent (`agents/database_agent.py`)
- [x] **Step 10: MongoDB Persistence Layer**
  - [x] Connect with MongoDB Atlas `prescriptions` collection
  - [x] Store patient consultation history and retrieve prescription records

### Agent 5 — Legacy WhatsApp Agent (`agents/whatsapp_agent.py`)
- [x] **Step 11: WhatsApp Agent Infrastructure** *(Decommissioned in Phase 22 in favor of Email & Push)*

### Agent 6 — Pharmacy Agent (`agents/pharmacy_agent.py`)
- [x] **Step 12: In-House Pharmacy POS & Dispatch Engine**
  - [x] Process patient pharmacy pickup preferences
  - [x] Generate itemized medicine purchase receipts and dispatch alerts to hospital medical desk

## Phase 5: CLI Main Application Integration `[PRIORITY: CRITICAL - CORE]`
- [x] **Step 13: Main Pipeline Integration**
  - [x] Create `app.py` CLI workflow
  - [x] Connect all sub-agents into a sequential pipeline for terminal testing

## Phase 6: System Module & Integration Testing `[PRIORITY: CRITICAL - CORE]`
- [x] **Step 14: Unit & Workflow Test Suite**
  - [x] Unit test `SpeechAgent`, `PrescriptionAgent`, `PDFAgent`, and `DatabaseAgent`
  - [x] Integration test full automated workflow pipeline

## Phase 7: Documentation & Operational Setup `[PRIORITY: HIGH]`
- [x] **Step 15: System Documentation**
  - [x] Write project `README.md` and system setup guides
  - [x] Document system architecture diagrams and doctor user manuals

## Phase 8: Master Automation Engine `[PRIORITY: CRITICAL - CORE]`
- [x] **Step 16: Master Orchestrator (`ai_prescription_agent.py`)**
  - [x] Combine sub-agents into `AIPrescriptionAgent` master orchestrator class
  - [x] Implement LLM model fallback chain (`gemini-2.0-flash` → `gemma-4-26b-a4b-it` → heuristic fallback)
  - [x] Integrate DOB password encryption and dual receipt dispatch

## Phase 9: Production Web Application (`server.py` & `ui/`) `[PRIORITY: CRITICAL - CORE]`
- [x] **Step 17: FastAPI Backend Server (`server.py`)**
  - [x] REST API endpoints (`/api/consultation/process`, `/api/prescription/approve`, `/api/pharmacy/receipt`)
  - [x] Real-time WebSocket audio transcript bridge (`/ws/transcript`)
- [x] **Step 18: React 18 + Vite SPA Console (`ui/`)**
  - [x] 3-Pane Doctor Console (`WaveformSpine`, `LiveTranscriptPanel`, `DraftPanel`)
  - [x] Centralized state stores (`draftStore`, `recordingStore`, `authStore`, `uiStore`)

## Phase 10: Component Modularization & Skeleton Boneyard `[PRIORITY: HIGH]`
- [x] **Step 19: Structural Modularization & Loading States**
  - [x] Organize UI components into `components/layout`, `components/draft`, `components/recording`, `components/ui`
  - [x] Build Skeleton Boneyard loading components (`BoneCard`, `BoneText`, `BoneTranscriptBubble`)

## Phase 11: Zod Runtime Schema Validation `[PRIORITY: HIGH]`
- [x] **Step 20: Type Safety Contracts**
  - [x] Build `prescriptionSchema.ts` Zod runtime validator
  - [x] Build type-safe HTTP client (`apiClient.ts`)

## Phase 12: React Hook Form Engine `[PRIORITY: HIGH]`
- [x] **Step 21: Form State & Validation Controls**
  - [x] Integrate React Hook Form inside `DraftPanel.tsx` for controlled input handling

## Phase 13: Backend Pydantic Schemas `[PRIORITY: HIGH]`
- [x] **Step 22: Fast API Data Contracts**
  - [x] Build backend Pydantic data schemas in `server.py` (`ProcessConsultationRequest`, `ApprovePrescriptionRequest`, `PharmacyReceiptRequest`)

## Phase 14: Strict End-to-End Data Contracts `[PRIORITY: HIGH]`
- [x] **Step 23: End-to-End Contract Alignment**
  - [x] Align JSON key schema names between Python backend agents and TypeScript frontend stores

## Phase 15: Toast Overlay, Status Stepper & Safety Engine `[PRIORITY: HIGH]`
- [x] **Step 24: UI Notifications & Clinical Safety**
  - [x] Build `uiStore.ts` and global `<ToastContainer />` overlay
  - [x] Upgraded `DrugInteractionBanner.tsx` for multi-NSAID, dual antibiotic, and PPI gastric protection warnings
  - [x] AI Confidence score badges (`ConfidenceBadge.tsx`)

## Phase 16: Authentication & Role-Based Security (RBAC) `[PRIORITY: CRITICAL - CORE]`
- [x] **Step 25: JWT Security Signing Engine (`auth.py`)**
  - [x] HMAC-SHA256 JWT token signing engine and password hashing
  - [x] FastAPI auth REST endpoints (`POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`)
- [x] **Step 26: Role-Based Route Guards**
  - [x] Build `<RequireRole>` route guard component
  - [x] Protect `/console`, `/dashboard`, `/history`, `/patients`, `/receipts`, `/settings` routes

---

# PART II: Clinical Workflows, Customization & Multi-Channel Delivery (Phases 17–28)

## Phase 17: Design Token System & Central Theme Architecture `[PRIORITY: HIGH]`
- [x] **Step 27: Centralized CSS Tokens (`tokens.css` & `index.css`)**
  - [x] Define spatial tokens (8px grid), typography scale (`Space Grotesk`, `Plus Jakarta Sans`, `IBM Plex Mono`), and color tokens
- [x] **Step 28: Theme Provider (`ThemeProvider.tsx`)**
  - [x] Dark/Light theme switching engine (`data-theme="dark"`) with `localStorage` persistence

## Phase 20: High-Security Batch Record Deletion `[PRIORITY: HIGH - SECURITY]`
- [x] **Step 29: Batch Deletion REST Endpoints & Safety Modal**
  - [x] `POST /api/consultations/delete-batch` endpoint executing MongoDB `delete_many`
  - [x] GitHub-style typed confirmation safety modal (`DeleteConfirmModal.tsx`) requiring phrase verification

## Phase 21: Prescription Letterhead Customization Suite `[PRIORITY: HIGH]`
- [x] **Step 30: Letterhead Settings API & ReportLab Branding Renderer**
  - [x] REST endpoints `GET /api/settings/letterhead` and `POST /api/settings/letterhead`
  - [x] Dynamic ReportLab PDF letterhead formatting in `pdf_agent.py` (clinic logo, doctor credentials, colors, address)
- [x] **Step 31: Interactive Letterhead Customizer in Settings Page**
  - [x] Live interactive preview canvas updating real-time as letterhead form fields change

## Phase 22: Decommissioning SMS / WhatsApp Dependencies `[PRIORITY: HIGH - REFACTOR]`
- [x] **Step 32: Legacy Dependency Removal**
  - [x] Remove Meta WhatsApp API handlers and dependencies, replacing them with Email & Web Push dispatchers

## Phase 23: Production Email Dispatch Engine (`EmailAgent`) `[PRIORITY: HIGH]`
- [x] **Step 33: SMTP Email Dispatcher (`agents/email_agent.py`)**
  - [x] Production Gmail SMTP integration (`scriptiq.sk@gmail.com`) sending styled HTML prescription emails
  - [x] Automatic attachment of DOB-password encrypted PDF prescriptions
  - [x] REST endpoints `/api/prescription/send-email` and `/api/pharmacy/email-receipt`

## Phase 24: Patient Mobile Web Push Notification Engine `[PRIORITY: HIGH]`
- [x] **Step 34: VAPID Push Dispatcher & Browser Service Worker**
  - [x] Service worker (`public/sw.js`) handling background push alerts
  - [x] Universal iOS & Android Authorization Modal complying with Safari gesture standards
  - [x] Patient notification ON/OFF preference toggles stored in MongoDB Atlas

## Phase 25: Full Patient Web Portal Suite (`/patient`) `[PRIORITY: HIGH]`
- [x] **Step 35A: Patient Phone Authentication & Profile Dashboard**
  - [x] OTP/Phone authentication screen (`/patient/login`) and active prescription dashboard
- [x] **Step 35B: Prescription History & Medication Schedule**
  - [x] Consultation timeline and downloadable encrypted PDF viewer
- [x] **Step 35C: Instant Welcome Push Notification**
  - [x] Auto-trigger welcome push notification upon notification enablement

## Phase 26: Multi-Channel Dispatch Verification Suite `[PRIORITY: HIGH]`
- [x] **Step 36: Automated E2E Email & Push Verification Script (`test_phase26_email.py`)**
  - [x] Verified automated PDF generation, Gmail SMTP dispatch, and VAPID push delivery with 100% success

## Phase 27: Master Agent Live Telemetry & Auto-Pilot Engine `[PRIORITY: HIGH]`
- [x] **Step 37: Real-Time Sub-Agent Telemetry Stream (`/ws/master_agent`)**
  - [x] Real-time WebSocket emission of sub-agent progress steps
  - [x] Zero-touch Auto-Pilot mode execution toggle in TopBar header

## Phase 28: Patient Intake Space in Doctor Console `[PRIORITY: HIGH]`
- [x] **Step 38: Voice & Typed Patient Intake Component (`PatientIntakeSpace.tsx`)**
  - [x] Dual Voice & Typed intake space in Doctor Console
  - [x] Automatic demographic parser pre-hydrating name, age, gender, DOB, phone, and symptoms into `draftStore`

---

# PART III: Systems Repair, Ergonomics & Pharmacy POS Suite (Phases 29–38)

## Phase 29: System Core Repair & End-to-End Realization `[PRIORITY: HIGH]`
- [x] **Step 39A: Multi-Model Fallback Extraction Engine**
  - [x] Rapid fallback chain (`gemini-2.5-flash` → `gemini-2.0-flash` → `gemma-4-26b-a4b-it` → regex heuristic) (<3s response)
- [x] **Step 39B: PDF Password DOB Encryption Enforcement**
  - [x] Pass patient DOB (`DDMMYYYY`) into ReportLab `StandardEncryption`
- [x] **Step 39C: Patient Portal Header & Theme Alignment**
  - [x] Align Patient Portal styling to match ScriptIQ Teal (`#12897F`) branding and design tokens

## Phase 30: Multi-Lingual Speech STT & Clinical Translation Engine `[PRIORITY: HIGH]`
- [x] **Step 40: Hindi & Hinglish Speech STT Parsing**
  - [x] Upgrade `SpeechAgent` with regional Hinglish clinical prompt instructions
  - [x] Language Selector dropdown (`English` / `Hinglish` / `Hindi`) in `LiveTranscriptPanel.tsx`

## Phase 31: Advanced Speech Recognition Resiliency & Medical STT `[PRIORITY: HIGH]`
- [x] **Step 41: Phonetic Medical STT & Vocabulary Injection**
  - [x] Upgrade local Whisper engine to `small` configuration size for accurate phonetic decoding
  - [x] Inject medical drug vocabulary initial prompt (`Dolo 650`, `Pan 40`, `Combiflam`, `Azithromycin`, `Augmentin`, `PCM`, `BD`, `TDS`)

## Phase 32: Clinical Extraction Engine Precision Repair `[PRIORITY: HIGH]`
- [x] **Step 42: Demographics & Symptom Regex Extraction Fallback**
  - [x] Robust regex heuristic fallback extracting `chief_complaint`, `age`, `gender`, `dob`, and `phone` when LLMs return empty strings

## Phase 33: Master Agent Telemetry Stream Integration `[PRIORITY: HIGH]`
- [x] **Step 43: Universal REST & Audio Route Telemetry Emissions**
  - [x] Pass `telemetry_callback` across `/api/consultation/process`, `/api/consultation/audio`, and `/api/prescription/approve`

## Phase 34: In-House Pharmacy Receipt & Template Management Suite (`/receipts`) `[PRIORITY: HIGH]`
- [x] **Sub-Phase 34A: Receipts Management Hub (`ReceiptsManagementPage.tsx`)**
  - [x] Real-time searchable receipt table with status filtering (`Pending Dispense`, `Dispensed / Paid`, `Cancelled`)
- [x] **Sub-Phase 34B: Receipt Detailed Viewer & 80mm Thermal Printing**
  - [x] `ReceiptDetailModal.tsx` with itemized pricing, GST/tax calculations, and 1-click thermal printing
- [x] **Sub-Phase 34C: Live Receipt Pricing & Quantity Override**
  - [x] `EditReceiptModal.tsx` allowing price overrides, item quantity changes, and discount applications (`0-50%`)
- [x] **Sub-Phase 34D: Single & Bulk Receipt Deletion**
  - [x] Checkbox multi-select & bottom action bar for batch deletion via `/api/pharmacy/receipts/delete-batch`
- [x] **Sub-Phase 34E: Pharmacy Receipt Template Settings Studio (`/settings`)**
  - [x] Receipt Customizer tab in Settings with paper format choices (`80mm Thermal` vs `A4 Letterhead`) and live preview
- [x] **Sub-Phase 34F: Real-Time Drug Inventory Stock Warning Engine**
  - [x] Live stock availability badges (`In Stock`, `Low Stock`, `OUT OF STOCK`) blocking over-dispensing
- [x] **Sub-Phase 34G: Multi-Payment Split Mode & Dynamic UPI QR Code Generator**
  - [x] Support split payment methods (`Cash`, `UPI / GPay`, `Card`, `Insurance`) & dynamic Indian UPI QR code generator
- [x] **Sub-Phase 34H: 1-Click Digital Receipt Dispatch**
  - [x] Digital receipt dispatch via Gmail SMTP and Mobile Web Push notification
- [x] **Sub-Phase 34I: Refund, Returns & Credit Voucher Audit Trail**
  - [x] `ProcessReturnModal.tsx` issuing Credit Vouchers (`REFUND-20260727-XXXX`) with inventory restock adjustment
- [x] **Sub-Phase 34J: Keyboard-First POS Velocity Mode (`Cmd/Ctrl + K`)**
  - [x] Full keyboard shortcut hotkeys (`N` New, `/` Search, `P` Print, `D` Discount, `Esc` Close)

## Phase 35: Seamless Prescription-to-Receipt Bridge & Telemetry Drawer `[PRIORITY: CRITICAL]`
- [x] **Sub-Phase 35A: Automatic Prescription-to-Receipt POS Bridge**
  - [x] Auto-create pharmacy receipt record in MongoDB `pharmacy_orders` collection upon doctor prescription approval
  - [x] Endpoint `GET /api/consultations/recent` returning recent prescription for 1-click POS loading
- [x] **Sub-Phase 35B: Receipts Portal View & "⚡ Load Recent Prescription" Button**
  - [x] Default tab set to Patient & Receipt Records Portal
  - [x] `⚡ Load Recent Prescription` button pre-loading recent medicines into POS billing table
- [x] **Sub-Phase 35C: Master Agent Step 7 Receipt Auto-Routing**
  - [x] Step 7 telemetry logging auto-receipt indexing during automated workflows
- [x] **Sub-Phase 35D: Dockable Sidebar AI Telemetry Drawer**
  - [x] Dockable `AutoPilotTelemetryConsole.tsx` connected to Zustand `uiStore` and triggered via Sidebar **`⚡ AI Telemetry`** button

## Phase 36: Universal Patient Age & Gender Demographics Integration `[PRIORITY: CRITICAL]`
- [x] **Sub-Phase 36A: Backend API Request Models (`server.py`)**
  - [x] `ProcessConsultationRequest`, `ApprovePrescriptionRequest`, and `PharmacyReceiptRequest` accepting `age: Optional[int]` and `gender: Optional[str]`
- [x] **Sub-Phase 36B: Master Agent Pipeline Preservation (`ai_prescription_agent.py`)**
  - [x] Preserving `age` and `gender` parameters across workflow methods without dropping values
- [x] **Sub-Phase 36C: ReportLab PDF Demographics Header (`pdf_agent.py`)**
  - [x] Formatting `Age / Gender: {age} Yrs / {gender}` in ReportLab PDF header table
- [x] **Sub-Phase 36D: Doctor Console Intake & Draft Store Binding (`DraftPanel.tsx`)**
  - [x] Input fields for `Age (Years)` and `Gender` selector in `DraftPanel.tsx` and `PatientIntakeSpace.tsx`
- [x] **Sub-Phase 36E: History Cards, Patient Portal & POS Badges**
  - [x] Age & Gender badges rendered on History list cards, Patient Dossier header, and POS billing inputs

## Phase 37: Removal of Redundant Status Stepper UX & Telemetry Consolidation `[PRIORITY: HIGH]`
- [x] **Sub-Phase 37A: Prescription Draft Pane UI Streamlining (`DraftPanel.tsx`)**
  - [x] Removed horizontal `<StatusTimeline />` stepper banner from `DraftPanel.tsx` to streamline editor layout
- [x] **Sub-Phase 37B: Consolidation into AI Telemetry Drawer**
  - [x] Consolidated prescription lifecycle tracking inside the 7-step Master Agent Telemetry drawer

## Phase 38: Live AI Processing Shimmer & Telemetry Active Status Banner `[PRIORITY: HIGH]`
- [x] **Sub-Phase 38A: Dynamic AI Extraction Processing Animation Banner (`AIDraftExtractionBanner.tsx`)**
  - [x] Dual-state component rendering an animated shimmer progress bar and live step transitions during active extraction (`isProcessing`)
- [x] **Sub-Phase 38B: Post-Extraction Telemetry Active Status Pill**
  - [x] Compact status pill badge (`"🤖 AI Telemetry Active & Monitoring"`) with 1-click trigger to open Sidebar Telemetry drawer

## Phase 39: Isolated 80mm Thermal Receipt Print Engine & UI Element Hiding `[PRIORITY: CRITICAL]`
- [x] **Sub-Phase 39A: Thermal Receipt Print Isolation Rules (`ReceiptsManagementPage.tsx`)**
  - [x] Implemented `@media print` element isolation suppressing all surrounding UI layout elements (Sidebar, TopBar, POS controls, inputs, action buttons)
  - [x] Formatted official 80mm thermal receipt container (`#thermal-receipt`) with hospital header, patient demographics, line items table, subtotal, 5% GST tax, grand total, and payment verification badge

## Phase 40: Official Letterhead Receipt Page (`/receipt/:orderId`) Mapping to POS Print Button `[PRIORITY: CRITICAL]`
- [x] **Sub-Phase 40A: Direct Official Receipt Mapping & Auto-Print Launch**
  - [x] Connect POS Print button on `ReceiptsManagementPage.tsx` to issue receipt via REST API (`POST /api/pharmacy/receipts`) and launch the official letterhead receipt page (`/receipt/${orderId}?autoprint=true`) in a new tab with automatic print invocation

---

# PART IV: Immediate Feature Wireup & UI Integration Roadmap (Phases 41–46)

## Phase 41: Refund, Returns & Credit Voucher Studio UI Wireup `[PRIORITY: HIGH - PHARMACY]`
- [ ] **Sub-Phase 41A: Drug Return & Restock Action Button (`ProcessReturnModal.tsx`)**
  - Wire "Return / Refund" action button in `ReceiptsManagementPage.tsx` and `ReceiptViewPage.tsx` to launch `ProcessReturnModal.tsx`, allowing staff to process partial/full drug returns, restock inventory, and issue Credit Refund Vouchers (`REFUND-YYYYMMDD-XXXX`)

## Phase 42: Interactive Receipt Editor & Pricing Override Suite `[PRIORITY: HIGH - PHARMACY]`
- [ ] **Sub-Phase 42A: Receipt Modification & Discount Action Bar (`EditReceiptModal.tsx`)**
  - Add "Edit Receipt" action button to history rows in `ReceiptsManagementPage.tsx` launching `EditReceiptModal.tsx`, allowing pharmacists to override prices, adjust quantities, apply discounts (0–50%), and update totals via `POST /api/pharmacy/receipts/{order_id}`{ This should be done in setting page}

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

## Phase 47: Patient Fallback Identifier PDF Encryption Suite (`Option B`) `[PRIORITY: HIGH - SECURITY & UX]`
- [x] **Step 47.1: Smart Fallback Password Resolution (`PDFAgent` in `agents/pdf_agent.py`)**
  - [x] Implement dual-stage PDF password resolution: primary DOB (`DDMMYYYY`), falling back to last 4 digits of patient's phone number (`DDMMYYYY` -> `Phone-Last-4` -> `1234`) when DOB is not provided
- [x] **Step 47.2: Dynamic Password Hint Email & Dispatch Messaging (`agents/email_agent.py`)**
  - [x] Dynamically render HTML email body and modal notification badges providing exact password hint banner (`🔒 PDF Security Password: {pdf_password}`) to recipient
- [x] **Step 47.3: REST API & Diagnostic Test Suite Wireup (`server.py` & `test_phase26_email.py`)**
  - [x] Pass `phone` fallback into `PDFAgent.generate_pdf()`, include password callout in email, and verify with automated unit/integration test suite

---

## Phase 48: Production Monorepo Restructuring & Dual-Platform Cloud Deployment Suite (Vercel + Render) `[PRIORITY: HIGH - DEPLOYMENT]`
- [ ] **Step 48.1: Frontend Folder Standardization & Vercel SPA Setup (`frontend/`)**
  - [ ] Rename `ui/` folder to `frontend/` and configure `frontend/vercel.json` with SPA route rewrites (`/(.*)` -> `/index.html`)
  - [ ] Update `vite.config.ts` and React custom hooks (`useSendPrescription.ts`, `useExtraction.ts`) to target `import.meta.env.VITE_API_BASE_URL` with local fallback `http://localhost:8000`
- [ ] **Step 48.2: Backend Modularization & Render Web Service Blueprint (`backend/`)**
  - [ ] Restructure Python files into `backend/` directory (`server.py`, `ai_prescription_agent.py`, `config.py`, `auth.py`, `agents/`, `database/`)
  - [ ] Configure `backend/render.yaml` Blueprint for 1-click deployment on Render with Python 3.11, Uvicorn start command, and environment variable bindings
  - [ ] Configure FastAPI CORS middleware in `server.py` to allow cross-origin requests from Vercel production domain
- [ ] **Step 48.3: Unified Test Suite Consolidation (`tests/`)**
  - [ ] Consolidate all root test scripts (`test_phase26_email.py`, `test_primary_objective.py`, `test_phase36_demographics.py`) into `tests/` directory with clean import path resolution
- [ ] **Step 48.4: Environment Template & Step-by-Step Deployment Guide**
  - [ ] Create `.env.example` and `DEPLOYMENT.md` detailing step-by-step instructions for Vercel & Render project creation and environment configuration
- [ ] **Step 48.5: Deep File Path & Module Reference Audit Suite (Zero-Path-Error Audit)**
  - [ ] Perform a line-by-line audit across all relocated files to verify relative file paths (`assets/`, `output/prescriptions/`, `vapid_private.pem`, `.env`, `temp_audio/`) and `sys.path` import targets to ensure zero `FileNotFoundError` or `ModuleNotFoundError`

---

## Phase 49: Clinical Intake Engine Fixes — DOB Extraction, Auto-Age Calculation & Transcript Email Parsing `[PRIORITY: CRITICAL - CLINICAL INTAKE]`
- [ ] **Step 49.1: Auto-Calculate Age from DOB & Intake Form Primary Binding (`DraftPanel.tsx` & `PatientIntakeSpace.tsx`)**
  - [ ] Add `patient_dob` extraction to `PrescriptionAgent` Pydantic schema
  - [ ] Implement `calculateAgeFromDOB()` helper auto-calculating age in years whenever DOB is entered/selected, setting DOB as primary intake field
- [ ] **Step 49.2: Transcript Email Address Extraction (`agents/prescription_agent.py` & `useExtraction.ts`)**
  - [ ] Add `patient_email` field to `PrescriptionSchema` and map extracted email directly to `draftStore.ts` `draft.email`

## Phase 50: PDF Password Encryption Synchronization & Doctor Console Security Badge `[PRIORITY: CRITICAL - SECURITY & PDF]`
- [ ] **Step 50.1: Shared Password Resolution Engine (`config.py`)**
  - [ ] Unify password resolution (`DOB` -> `Phone-Last-4` -> `1234`) in a shared helper function called identically by `PDFAgent` and `EmailAgent`, guaranteeing 100% password parity
- [ ] **Step 50.2: Doctor Console PDF Password Display Badge & 1-Click Copy (`SendPrescriptionModal.tsx` & `DraftPanel.tsx`)**
  - [ ] Render a visible security badge showing the actual PDF password (`🔒 PDF Password: {pwd}`) with 1-click copy to clipboard in Doctor Console upon PDF generation

## Phase 51: Receipt Lifecycle Gating & Cashier Payment Status Control `[PRIORITY: HIGH - PHARMACY POS]`
- [ ] **Step 51.1: Gated Receipt Creation & Payment Status Control (`server.py` & `ReceiptsManagementPage.tsx`)**
  - [ ] Default auto-created receipts to `"Pending Payment"` instead of premature `"Paid"` status to avoid storage distortion
  - [ ] Require explicit cashier payment collection action (Cash, UPI QR, Card) before marking receipt as `"Paid"`

## Phase 52: Patient Receipts Portal — Receipt Deletion & POS Bill Re-Loading Suite `[PRIORITY: HIGH - PHARMACY STORAGE & UX]`
- [ ] **Step 52.1: REST API Receipt Deletion (`DELETE /api/pharmacy/receipts/{order_id}`)**
  - [ ] Build REST endpoint `DELETE /api/pharmacy/receipts/{order_id}` and add `<Trash2 />` button with typed confirmation modal in `ReceiptsManagementPage.tsx`
- [ ] **Step 52.2: "⚡ Re-Load into POS Builder" Action (`ReceiptsManagementPage.tsx`)**
  - [ ] Add "⚡ Re-Load into POS Builder" button to receipt rows, instantly populating active POS table with medicines, patient details, and prices for re-dispensing or editing

## Phase 53: Patient Receipts Portal — Stock Tab Replacement with Patient Receipts Explorer `[PRIORITY: HIGH - UX]`
- [ ] **Step 53.1: Replace Stock Inventory Tab with Patient Receipts Explorer (`ReceiptsManagementPage.tsx`)**
  - [ ] Replace redundant "Stock Inventory" tab in `ReceiptsManagementPage.tsx` with "Patient Receipts Explorer", providing live search by patient name/phone, date range filters, and itemized breakdown inspect popovers

---

# PART V: Enterprise Expansion & Future Roadmap (Phases 54–60)
- [ ] **Step 49.1: Docker Containerization & Infrastructure Config**
  - [ ] Backend FastAPI `Dockerfile` (Python 3.11 + ffmpeg + dependencies)
  - [ ] Frontend SPA `Dockerfile` (Nginx static build bundle)
  - [ ] `docker-compose.yml` for local container stack deployment
  - [ ] GitHub Actions CI workflow (`.github/workflows/ci.yml`) for automated linting, testing, and deployment

## Phase 48: Performance Caching & Offline Storage Queue `[PRIORITY: MEDIUM]`
- [ ] **Step 48.1: Response Caching & Offline Audio Synchronization**
  - [ ] In-memory LRU / Redis cache for clinical drug lookups and common dosages
  - [ ] Service Worker IndexedDB offline audio queue (`idb-keyval`) for recording audio during Wi-Fi outages

## Phase 49: HL7 / FHIR EHR Interoperability Standard Export `[RECOMMENDED BONUS]`
- [ ] **Step 49.1: HL7 FHIR JSON Resource Exporter**
  - [ ] Exporter converting prescriptions to HL7 / FHIR JSON standard resources (`Patient`, `MedicationRequest`, `Condition`)
  - [ ] REST endpoint `GET /api/prescription/:id/fhir` for hospital EHR integration

## Phase 50: Cryptographic Aadhaar Digital Signature (e-Sign Verification) `[RECOMMENDED BONUS]`
- [ ] **Step 50.1: Doctor PKI Signature Stamp**
  - [ ] Cryptographic Aadhaar e-Sign verification module complying with Telemedicine Guidelines 2020
  - [ ] Embed verifiable cryptographic signature stamp on PDF exports

## Phase 51: Dual-Channel Speaker Diarization Engine `[PRIORITY: HIGH - CLINICAL]`
- [ ] **Step 51.1: Doctor vs. Patient Channel Separation**
  - [ ] PyAnnote / Whisper speaker diarization separating doctor and patient speech audio channels
  - [ ] Dual-bubble color-coded transcript stream (`[Doctor]` vs `[Patient]`) in `LiveTranscriptPanel.tsx`

## Phase 52: Automated ICD-10 Clinical Coding & Billing Auto-Coder `[PRIORITY: HIGH - BILLING]`
- [ ] **Step 52.1: ICD-10 Clinical Diagnosis Autocomplete**
  - [ ] ICD-10 diagnosis database and Gemini LLM auto-coder in `PrescriptionAgent`
  - [ ] 1-click ICD-10 billing code chips in `DraftPanel.tsx`

## Phase 53: Longitudinal Patient Vitals Analytics & Pediatric Dosage Calculator `[PRIORITY: HIGH - SAFETY]`
- [ ] **Step 53.1: Interactive Vitals Analytics & Clinical Safety Calculator**
  - [ ] Recharts longitudinal vitals tracking (BP, Blood Glucose, Weight, SpO2) in Patient Dossier
  - [ ] Weight-based mg/kg pediatric dosage and GFR renal clearance safety calculator in `MedicineRow.tsx`
