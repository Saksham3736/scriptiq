# UI/UX Design System & Specification

<!-- Add your UI Design guidelines, color tokens, and styling context here -->
# Design System — ScriptIQ
## Visual Identity, Color, Typography, Components & Icons

**Version:** 1.0
**Companion to:** `prd.md`
**Next document:** `structure.md` — component tree, routing, and file structure

---

## 1. Design Thesis

ScriptIQ has two very different audiences reading the same data: a **doctor** mid-consultation who needs speed, precision, and zero friction, and a **patient** at home who needs calm, clarity, and reassurance. Rather than one generic "healthcare SaaS" look, ScriptIQ uses **one shared system with two moods**:

- **Console mode** (doctor-facing): dense, fast, instrument-like — closer to a studio/DAW than a form
- **Record mode** (patient-facing): open, calm, generous whitespace — closer to a boarding pass or a clean receipt

The thread that ties them together is the product's actual mechanism: **sound becoming structure**. Speech turns into a transcript; a transcript turns into a structured, trustworthy document. That transformation is the design's signature idea, not a decorative add-on.

**Signature element — "The Waveform Spine":**
A vertical line runs down the left edge of the doctor's console. While the agent is listening, it renders as a live audio waveform. The instant processing completes, it morphs (a single deliberate animation, not ambient looping) into a vertical tick/checklist rail — one tick per structured field extracted (symptoms ✓, diagnosis ✓, medicines ✓). This is the one bold, memorable element; everything else stays quiet and disciplined around it.

---

## 2. Color Palette

Avoiding the generic "cream + terracotta" or "dark + neon-green SaaS" defaults. ScriptIQ's palette reads as **clinical-instrument**, not consumer-app: an ink-deep navy base, a distinctive violet reserved *only* for AI/voice activity (so the user always knows "the agent is doing something" the instant they see that color), and a muted instrument-teal for confirmed/finalized states rather than a bright generic teal.

| Name | Hex | Role |
|---|---|---|
| **Ink Navy** | `#101A2E` | Primary text, doctor-console chrome, headers, nav |
| **Mist White** | `#F6F8FA` | Base background (both modes) — clean, not cream |
| **Pulse Violet** | `#6D5DF6` | **AI/voice signature color** — recording, listening, "agent is thinking," live transcript cursor |
| **Clinical Teal** | `#12897F` | Confirmed, finalized, saved, success actions |
| **Amber Flag** | `#E8A33D` | Low-confidence AI extraction, needs-review, soft warnings |
| **Alert Coral** | `#E15554` | Critical warnings (drug interaction), destructive actions (delete/cancel) |
| **Slate Gray** (neutral) | `#5B6B82` | Secondary text, placeholders, dividers |
| **Line Gray** (neutral) | `#E3E8EE` | Borders, hairlines, disabled states |

**Usage rule:** Pulse Violet is *reserved*. It never appears as a generic "brand color" on marketing copy or static UI — it only appears when the AI agent is actively listening, transcribing, or generating. This keeps it meaningful instead of decorative, and gives the product a tell: "if it's violet, the AI is working right now."

```css
:root {
  --color-ink-navy: #101A2E;
  --color-mist-white: #F6F8FA;
  --color-pulse-violet: #6D5DF6;
  --color-pulse-violet-soft: #EFECFE;
  --color-clinical-teal: #12897F;
  --color-clinical-teal-soft: #E4F3F1;
  --color-amber-flag: #E8A33D;
  --color-amber-flag-soft: #FCF1DE;
  --color-alert-coral: #E15554;
  --color-alert-coral-soft: #FCEAEA;
  --color-slate-gray: #5B6B82;
  --color-line-gray: #E3E8EE;
}
```

### Dark mode (Console only)
Doctor console optionally supports a dark instrument theme for low-light clinic use:
`--bg: #0B1220` · `--surface: #131C2E` · `--text: #E8ECF3` · accents (Violet/Teal/Amber/Coral) stay identical for consistency.

---

## 3. Typography

Two-face pairing plus one utility face — each doing a distinct job:

| Role | Typeface | Why |
|---|---|---|
| **Display** (headings, patient name banners, section titles) | **Space Grotesk** | Geometric, slightly technical personality — reads as "intelligent system" without tipping into cold or robotic. Used with restraint: headings only, never body copy. |
| **Body** (paragraphs, form labels, transcript text, patient-facing prescription) | **Inter** | Highly legible humanist sans, excellent at small sizes — critical for dosage instructions patients must not misread. |
| **Utility / Data** (dosages, timestamps, medicine codes, transcript timecodes, receipt line items) | **IBM Plex Mono** | Tabular figures keep dosage numbers aligned in columns (e.g. "500 mg × 2 / day"); monospace also visually distinguishes "hard data" from prose at a glance. |

### Type scale (base 16px, 1.25 ratio)

| Token | Size | Weight | Use |
|---|---|---|---|
| `display-xl` | 40px | Space Grotesk, 600 | Page hero / patient prescription header |
| `display-lg` | 32px | Space Grotesk, 600 | Section titles ("Prescription Draft") |
| `display-md` | 24px | Space Grotesk, 500 | Card/panel titles |
| `body-lg` | 18px | Inter, 400 | Patient-facing prescription body |
| `body-md` | 16px | Inter, 400 | Default UI text |
| `body-sm` | 14px | Inter, 400 | Secondary text, helper text |
| `caption` | 12px | Inter, 500, uppercase, +0.04em tracking | Labels, eyebrows, field tags |
| `data-md` | 15px | IBM Plex Mono, 500 | Dosage/frequency/duration values |
| `data-sm` | 13px | IBM Plex Mono, 400 | Timestamps, IDs, receipt numbers |

---

## 4. Layout Concept

### 4.1 Doctor Console (primary workspace)
A **split-pane console**, not a stacked form — because the product's core value is watching speech become structure *live*.

```
┌───┬─────────────────────────┬───────────────────────────────┐
│ W │  LIVE TRANSCRIPT         │  STRUCTURED DRAFT              │
│ a │  ────────────────        │  ─────────────────             │
│ v │  "Patient reports mild   │  Symptoms     [mild fever,...] │
│ e │   fever since two days,  │  Diagnosis    [viral fever]    │
│   │   sore throat..."        │  Medicines    [Paracetamol...] │
│ S │                          │               [+ Add medicine] │
│ p │  ● Recording   00:42     │  Advice       [rest, fluids]   │
│ i │                          │  Follow-up    [in 3 days]      │
│ n │                          │                                 │
│ e │                          │  [Regenerate]   [Confirm&Save] │
└───┴─────────────────────────┴───────────────────────────────┘
```
- Left rail (48px): the Waveform Spine — persistent, always visible, the product's "pulse"
- Center pane: live transcript, scrollable, editable inline
- Right pane: structured draft, field-by-field, each field individually editable and individually flaggable (amber outline = low confidence)
- Sticky footer action bar: **Regenerate** (secondary) / **Confirm & Save** (primary, Clinical Teal)

### 4.2 Patient View (prescription + receipt)
Single-column, generous spacing, mobile-first — modeled after a clean boarding-pass/receipt rhythm rather than a dense clinical form:

```
┌─────────────────────────────┐
│  Dr. Name · Clinic          │  ← Display, Ink Navy
│  Date · Reference No.       │  ← Mono, Slate Gray
├─────────────────────────────┤
│  Diagnosis                  │
│  Medicines (card per item)  │
│    [icon] Paracetamol 500mg │
│           1-0-1 · 5 days    │
│  Advice                     │
│  Follow-up                  │
├─────────────────────────────┤
│  [Download Receipt]         │
│  [Set Medicine Reminders]   │
└─────────────────────────────┘
```

### 4.3 Spacing & radius system
- Base unit: **4px**. Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
- Radius: `--radius-sm: 6px` (inputs, tags), `--radius-md: 12px` (cards), `--radius-lg: 20px` (modals, hero panels)
- Elevation: flat by default (hairline borders, `--color-line-gray`); shadow reserved only for floating/overlay elements (modals, toasts, the recording FAB)

---

## 5. Component Library

### 5.1 Core inputs & actions
- **Buttons**: Primary (Clinical Teal fill), Secondary (Ink Navy outline), Destructive (Alert Coral outline), Ghost (text-only, for "Regenerate," "Edit")
- **Voice Record FAB**: Circular, Pulse Violet, pulsing ring animation while active; center icon toggles mic ↔ pause ↔ stop
- **Text input fallback**: Standard text area with a small "Switch to voice" toggle inline — voice and text are peers, not primary/fallback in UI weight
- **Editable field chip**: Every AI-extracted field (medicine name, dosage, etc.) renders as an inline-editable chip with a subtle colored left-border: neutral border = high confidence, Amber border = needs review
- **Confidence badge**: Small pill, e.g. "AI · 92%" in Slate Gray, appears on hover/focus of a chip — informative, not alarming

### 5.2 Structural components
- **Split Console Panel** — the two/three-pane doctor layout described above, resizable divider between transcript and draft
- **Prescription Card** (patient view) — one card per medicine: icon, name, strength, schedule (in Mono), duration, "before/after food" tag
- **Transcript Bubble** — timestamped text blocks, doctor segments in Ink Navy, (optional) patient segments in Slate Gray if dual-mic diarization is used
- **Status Timeline** — horizontal stepper: Draft → Reviewed → Saved → Sent → Viewed, using Clinical Teal for completed steps
- **Drug Interaction Banner** — full-width Alert Coral-soft banner with icon, non-blocking, dismissible, appears above the draft panel only when triggered
- **Receipt Table** — Mono-numeral itemized table: medicine / qty / unit / total, with a Clinical Teal "Total" row

### 5.3 Navigation & feedback
- **Top bar (Console)**: Clinic/doctor identity left, patient-context switcher center, save-status indicator right ("Saved · 2s ago" in Slate Gray, Mono timestamp)
- **Toasts**: bottom-right, 4 variants matching palette (success/teal, warning/amber, error/coral, info/violet for "AI is generating…")
- **Modal**: radius-lg, used sparingly — patient search/link, medicine database lookup, send-confirmation only
- **Empty states**: Waveform Spine at rest (flat line, "Tap to start dictating") rather than a generic illustration — ties empty state back to the signature element

---

## 6. Icon System

**Style:** Outline icons, 1.5px stroke, rounded joins — matches the humanist warmth of Inter while staying precise enough for clinical contexts. Recommended library: **Lucide** (open-source, consistent stroke weight, large medical/tech icon coverage) — pairs naturally with React via `lucide-react`.

| Function | Icon (Lucide) | Notes |
|---|---|---|
| Start/stop voice recording | `Mic`, `MicOff`, `Square` (stop) | Pulse Violet when active |
| Text input mode | `Keyboard` | |
| Live transcript | `AudioLines` | Used on the Waveform Spine label |
| Processing/generating | `Sparkles` or `Loader2` (spin) | Pulse Violet |
| Patient profile | `UserRound` | |
| Diagnosis | `Stethoscope` | |
| Medicine / prescription item | `Pill` | |
| Dosage/schedule | `Clock4` | |
| Advice/notes | `NotebookPen` | |
| Follow-up date | `CalendarCheck` | |
| Confirm & Save | `CircleCheck` | Clinical Teal |
| Needs review (low confidence) | `TriangleAlert` | Amber |
| Drug interaction warning | `ShieldAlert` | Coral |
| Send to patient | `Send` | |
| Delivery channels | `Mail`, `MessageSquare` (SMS), `Phone` | |
| Medicine receipt | `ReceiptText` | |
| Download PDF | `Download` | |
| History/search | `History`, `Search` | |
| Edit field | `Pencil` | |
| Version history | `GitCommitVertical` | |

---

## 7. Motion Guidelines

Motion is used only where it clarifies the sound-to-structure transformation — not as ambient decoration:

1. **Waveform → Tick-rail morph**: single 400ms orchestrated animation when recording stops and processing completes. This is the signature moment; it happens once per consultation, not repeatedly.
2. **Field population**: structured draft fields fade/slide in one at a time (60ms stagger) as the AI extracts them — reinforces "the system is building this in front of you."
3. **Confidence chip hover**: 150ms fade for the confidence badge — informative, not playful.
4. **Everything else** (navigation, modals, toasts): fast, functional, ≤200ms, no bounce/elastic easing. Respect `prefers-reduced-motion` — disable the morph animation and cross-fade instead.

---

## 8. Accessibility

- Minimum contrast: Ink Navy on Mist White = 14.8:1; Clinical Teal on white = 4.6:1 (AA for normal text); Amber/Coral text always paired with an icon + label, never color alone
- All voice controls have full keyboard equivalents and ARIA live-region announcements for transcript updates
- Focus rings: 2px solid Pulse Violet offset 2px, visible on all interactive elements
- Patient-facing prescription view supports dynamic text scaling up to 200% without layout breakage
- Reduced motion setting disables the waveform animation and staggered field reveal, replacing with instant state changes

---

## 9. Tone of Voice (UI copy)

- Console (doctor): terse, functional, verb-first — "Confirm & Save," "Regenerate draft," "Flag for review" — never cutesy
- Patient view: plain-language, reassuring, specific — "Take 1 tablet twice a day, after food" not "Administer per schedule"
- Errors describe what happened and how to fix it: "Couldn't reach the medicine database — check your connection and try again," never "Oops, something went wrong"
- Empty states are instructions, not decoration: "Tap the mic to start dictating this consultation"

---

