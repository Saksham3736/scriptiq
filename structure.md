# Application Architecture & Component Structure

<!-- Add your UI component structure, page layout, and directory architecture context here -->
# Structure — ScriptIQ
## React Component Tree, Routing, State Management & Folder Organization

**Version:** 1.0
**Companions:** `prd.md` (requirements) · `design.md` (visual system)

---

## 1. Tech Stack Assumptions

| Layer | Choice |
|---|---|
| Framework | React 18+ (Vite) |
| Routing | React Router v6 |
| Styling | Tailwind CSS (tokens mapped from `design.md` palette/type) + CSS variables for theme switching |
| State (client/UI) | Zustand (lightweight, avoids Redux boilerplate for console state like recording status) |
| Server state / caching | TanStack Query (React Query) for API calls, caching prescriptions/patients |
| Forms | React Hook Form + Zod (schema validation matching MongoDB structure) |
| Icons | `lucide-react` |
| Audio capture | Web Audio API / MediaRecorder, streamed to backend STT service |
| Real-time updates | WebSocket (or Server-Sent Events) for streaming transcript + draft field population |
| PDF | Backend-rendered (receipt/prescription PDF); frontend just links/downloads |
| Auth | JWT-based session, role claim (`doctor` / `admin` / `patient`) drives route access |

---

## 2. Top-Level Folder Structure

```
scriptiq-frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── providers.tsx          # QueryClientProvider, ThemeProvider, AuthProvider
│   │
│   ├── assets/
│   │   ├── icons/                 # any custom SVGs beyond lucide
│   │   └── fonts/
│   │
│   ├── styles/
│   │   ├── tokens.css             # CSS variables from design.md palette/type
│   │   └── globals.css
│   │
│   ├── components/                # shared, reusable, "dumb" UI components
│   │   ├── ui/                    # Button, Chip, Modal, Toast, Badge, Card, Tabs...
│   │   ├── icons/                 # icon wrapper/mapping
│   │   └── layout/                # AppShell, ConsoleShell, PatientShell, TopBar, Sidebar
│   │
│   ├── features/                  # feature-based modules (see §4)
│   │   ├── auth/
│   │   ├── recording/
│   │   ├── transcript/
│   │   ├── prescription-draft/
│   │   ├── patient/
│   │   ├── receipt/
│   │   ├── history/
│   │   └── notifications/
│   │
│   ├── hooks/                     # cross-feature hooks (useWebSocket, useAuth, useDebounce)
│   ├── lib/                       # api client, socket client, utils, constants
│   │   ├── apiClient.ts
│   │   ├── socketClient.ts
│   │   ├── mongoSchemas.ts         # shared TS types mirroring MongoDB documents
│   │   └── validators.ts          # Zod schemas
│   │
│   ├── store/                     # Zustand stores
│   │   ├── recordingStore.ts
│   │   ├── draftStore.ts
│   │   ├── uiStore.ts             # toasts, modals, theme
│   │   └── authStore.ts
│   │
│   ├── pages/                     # route-level components (compose features)
│   │   ├── DoctorConsolePage.tsx
│   │   ├── PatientHistoryPage.tsx
│   │   ├── PrescriptionViewPage.tsx     # patient-facing
│   │   ├── ReceiptViewPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── PatientSearchPage.tsx
│   │   └── LoginPage.tsx
│   │
│   └── main.tsx
│
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

**Why feature-based, not type-based:** Each clinical concept (recording, transcript, draft, receipt) has its own components, hooks, and API calls that change together. Grouping by feature keeps the "sound → structure" pipeline (the product's actual mental model) visible in the folder tree itself, rather than scattering related logic across generic `components/` and `hooks/` folders.

---

## 3. Route Map

| Path | Page | Access | Notes |
|---|---|---|---|
| `/login` | `LoginPage` | Public | Role-aware redirect after login |
| `/console` | `DoctorConsolePage` | Doctor | Default landing for doctors; split-pane recording + draft |
| `/console/:patientId` | `DoctorConsolePage` | Doctor | Pre-loads patient context into console |
| `/dashboard` | `DashboardPage` | Doctor/Admin | Recent consultations, quick stats |
| `/patients` | `PatientSearchPage` | Doctor/Admin | Search/create patient profiles |
| `/history` | `DashboardPage` (history tab) | Doctor/Admin | Full-text search across prescriptions/transcripts |
| `/prescription/:id` | `PrescriptionViewPage` | Patient (own) / Doctor / Admin | Read-only formatted prescription |
| `/receipt/:id` | `ReceiptViewPage` | Patient (own) / Doctor / Admin | Itemized medicine receipt, downloadable |
| `/p/:shareToken` | `PrescriptionViewPage` | Public (tokenized link) | For SMS/WhatsApp share links without login |

Route guarding via a `<RequireRole roles={['doctor','admin']}>` wrapper component reading `authStore`.

---

## 4. Feature Modules (Detail)

### 4.1 `features/recording/`
Handles microphone capture and the Master Agent's live listening state.
```
recording/
├── components/
│   ├── WaveformSpine.tsx        # signature element from design.md
│   ├── RecordFAB.tsx            # mic/pause/stop control
│   └── ModeToggle.tsx           # voice ↔ text switch
├── hooks/
│   ├── useAudioRecorder.ts      # MediaRecorder wrapper, chunk streaming
│   └── useRecordingSocket.ts    # streams audio chunks, receives partial transcript
└── recordingStore.ts            # status: idle | recording | paused | processing
```

### 4.2 `features/transcript/`
```
transcript/
├── components/
│   ├── LiveTranscriptPanel.tsx  # scrolling captions while recording
│   ├── TranscriptBubble.tsx     # timestamped segment
│   └── TranscriptEditor.tsx     # manual correction before processing
└── hooks/
    └── useTranscript.ts         # holds finalized transcript, triggers extraction call
```

### 4.3 `features/prescription-draft/`
The core AI-output review surface.
```
prescription-draft/
├── components/
│   ├── DraftPanel.tsx           # right pane container
│   ├── FieldChip.tsx            # editable chip w/ confidence border
│   ├── MedicineRow.tsx          # name/dosage/frequency/duration/route
│   ├── MedicineAutocomplete.tsx # validates against drug DB
│   ├── DrugInteractionBanner.tsx
│   ├── ConfidenceBadge.tsx
│   └── DraftActionsBar.tsx      # Regenerate / Confirm & Save
├── hooks/
│   ├── useExtraction.ts         # calls NLU/LLM extraction endpoint
│   └── useSavePrescription.ts   # POST to MongoDB via API, invalidates history cache
└── draftStore.ts                # structured fields, dirty/edited flags, version history
```

### 4.4 `features/patient/`
```
patient/
├── components/
│   ├── PatientSearchBar.tsx
│   ├── PatientProfileCard.tsx
│   └── PatientCreateModal.tsx
└── hooks/
    └── usePatients.ts           # React Query: search/create/link patient
```

### 4.5 `features/receipt/`
```
receipt/
├── components/
│   ├── ReceiptTable.tsx
│   ├── ReceiptSummary.tsx
│   └── DownloadReceiptButton.tsx
└── hooks/
    └── useReceipt.ts            # derives/fetches itemized receipt from prescription id
```

### 4.6 `features/history/`
```
history/
├── components/
│   ├── HistoryList.tsx
│   ├── StatusTimeline.tsx       # Draft→Reviewed→Saved→Sent→Viewed
│   └── HistoryFilters.tsx
└── hooks/
    └── usePrescriptionHistory.ts
```

### 4.7 `features/notifications/`
```
notifications/
├── components/
│   ├── SendPrescriptionModal.tsx  # choose channel: app/email/SMS/WhatsApp
│   └── DeliveryStatusBadge.tsx
└── hooks/
    └── useSendPrescription.ts
```

---

## 5. Doctor Console — Component Tree (page-level)

```
<DoctorConsolePage>
 ├── <ConsoleShell>                       # layout/
 │    ├── <TopBar>                        # doctor identity, patient switcher, save status
 │    └── <ConsoleSplitPanel>
 │         ├── <WaveformSpine />          # left rail, signature element
 │         ├── <LiveTranscriptPanel>      # center pane
 │         │    ├── <ModeToggle />
 │         │    ├── <TranscriptBubble />*
 │         │    └── <TranscriptEditor />
 │         └── <DraftPanel>               # right pane
 │              ├── <DrugInteractionBanner /> (conditional)
 │              ├── <FieldChip label="Symptoms" />
 │              ├── <FieldChip label="Diagnosis" />
 │              ├── <MedicineRow />*  → <MedicineAutocomplete />
 │              ├── <FieldChip label="Advice" />
 │              ├── <FieldChip label="Follow-up" />
 │              └── <DraftActionsBar>
 │                   ├── <Button variant="ghost">Regenerate</Button>
 │                   └── <Button variant="primary">Confirm & Save</Button>
 └── <RecordFAB />                        # floating, persistent across scroll
```
`*` = repeatable list item

---

## 6. State Management Model

**Principle:** Ephemeral UI/session state (recording status, unsent draft edits) lives in Zustand; anything persisted or fetched from the server lives in React Query. Nothing is duplicated between the two.

| Store | Contents |
|---|---|
| `recordingStore` | `status` (idle/recording/paused/processing), `elapsedTime`, `audioChunks` |
| `draftStore` | `fields{}` (symptoms, diagnosis, medicines[], advice, followUp), `confidenceMap`, `isDirty`, `versionHistory[]` |
| `authStore` | `user`, `role`, `token`, `patientContext` |
| `uiStore` | `toasts[]`, `activeModal`, `theme` (light/dark console) |

React Query keys:
- `['patient', patientId]`
- `['prescription', prescriptionId]`
- `['prescriptions', doctorId, filters]` (history list)
- `['receipt', prescriptionId]`
- `['drugDatabase', searchTerm]` (autocomplete)

**Data flow for the core loop:**
1. `useAudioRecorder` streams audio → `useRecordingSocket` → backend STT → partial transcript pushed via WebSocket → `useTranscript` updates `LiveTranscriptPanel`
2. On stop: finalized transcript → `useExtraction` calls backend NLU/LLM endpoint → structured JSON → populates `draftStore.fields` (staggered reveal per `design.md` §7)
3. Doctor edits trigger local `draftStore` mutation only (`isDirty = true`)
4. **Confirm & Save** → `useSavePrescription` POSTs full document (raw transcript + structured fields + edit diff) → MongoDB via API → React Query invalidates `['prescriptions', doctorId]`
5. Save success → `useSendPrescription` triggers → patient notified → `DeliveryStatusBadge` polls/subscribes to delivery status

---

## 7. MongoDB Document Shape (frontend-facing contract)

Frontend TypeScript types in `lib/mongoSchemas.ts`, mirrored 1:1 with backend schema so React Hook Form + Zod validation matches what's actually persisted.

```ts
interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'finalized' | 'sent';
  rawTranscript: {
    text: string;
    segments: { speaker: 'doctor' | 'patient'; text: string; timestamp: number }[];
  };
  structured: {
    symptoms: string[];
    diagnosis: string[];
    medicines: {
      name: string;
      strength: string;
      dosage: string;       // e.g. "1-0-1"
      frequency: string;
      durationDays: number;
      route: string;
      instructions: string; // e.g. "after food"
      confidence: number;   // 0-1, drives amber flagging
    }[];
    advice: string[];
    followUp: { date: string | null; note: string };
  };
  editHistory: { editedAt: string; field: string; oldValue: string; newValue: string }[];
  receipt: {
    items: { medicineName: string; quantity: number; unitPrice: number | null; total: number | null }[];
    grandTotal: number | null;
  };
  delivery: {
    channels: ('app' | 'email' | 'sms' | 'whatsapp')[];
    status: 'pending' | 'sent' | 'delivered' | 'viewed';
    sentAt: string | null;
  };
}
```

---

## 8. Patient-Facing App Structure (mobile-first, same codebase)

```
<PatientShell>                          # generous whitespace layout from design.md §4.2
 ├── <TopBar minimal />                 # clinic name, date
 ├── <PrescriptionViewPage>
 │    ├── <DiagnosisSummary />
 │    ├── <MedicineCard />*             # icon + name + Mono dosage + duration
 │    ├── <AdviceList />
 │    ├── <FollowUpBanner />
 │    └── <Actions>
 │         ├── <DownloadReceiptButton />
 │         └── <SetReminderToggle />
 └── <ReceiptViewPage>
      ├── <ReceiptTable />
      └── <ReceiptSummary />
```

Public tokenized route (`/p/:shareToken`) reuses `PrescriptionViewPage` and `ReceiptViewPage` directly — no auth wrapper, token validated server-side, read-only.

---

## 9. Build Order (Suggested Milestones)

1. **Shell & auth** — `App`, routing, `authStore`, `LoginPage`, role guards
2. **Recording pipeline** — `WaveformSpine`, `RecordFAB`, `useAudioRecorder`, socket streaming, `LiveTranscriptPanel`
3. **Extraction & draft** — `useExtraction`, `DraftPanel`, `FieldChip`, `MedicineRow`, confidence flagging
4. **Save flow** — `useSavePrescription`, MongoDB integration, `DraftActionsBar`
5. **Patient delivery** — `SendPrescriptionModal`, `useSendPrescription`, delivery status
6. **Patient-facing views** — `PrescriptionViewPage`, `ReceiptViewPage`, tokenized public route
7. **History & search** — `DashboardPage`, `HistoryList`, `StatusTimeline`
8. **Polish pass** — drug interaction warnings, dark console theme, accessibility audit, reduced-motion handling

---
