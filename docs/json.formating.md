# Shared Data Structure (JSON Plan)

## Overview

Instead of each agent creating a new JSON object, the entire application will use **one shared JSON object** called `prescription_data`.

Each agent will **read**, **update**, and **pass** the same object to the next agent.

This keeps the implementation simple, avoids unnecessary data conversion, and makes debugging easier.

---

# Workflow

```
Agent 1
     │
     ▼
Updates Transcript
     │
     ▼
Agent 2
     │
     ▼
Updates Prescription
     │
     ▼
Agent 3
     │
     ▼
Adds PDF Path
     │
     ▼
Agent 4
     │
     ▼
Adds Database ID
     │
     ▼
Agent 5
     │
     ▼
Updates WhatsApp Status
     │
     ▼
Agent 6
     │
     ▼
Updates Pharmacy Status
```

---

# Shared JSON Structure

```json
{
    "consultation": {
        "consultation_id": "",
        "consultation_date": "",
        "consultation_time": ""
    },

    "doctor": {
        "doctor_name": "",
        "qualification": "",
        "registration_number": "",
        "hospital_name": "",
        "signature_path": "",
        "stamp_path": ""
    },

    "patient": {
        "patient_id": "",
        "patient_name": "",
        "age": "",
        "gender": "",
        "phone": "",
        "address": ""
    },

    "speech": {
        "audio_path": "",
        "transcript": ""
    },

    "prescription": {
        "chief_complaint": "",
        "diagnosis": "",
        "medicines": [],
        "tests": [],
        "general_advice": [],
        "follow_up": ""
    },

    "pdf": {
        "generated": false,
        "pdf_path": ""
    },

    "database": {
        "saved": false,
        "document_id": ""
    },

    "whatsapp": {
        "sent": false,
        "message_id": ""
    },

    "pharmacy": {
        "hospital_pharmacy": false,
        "sent": false
    }
}
```

---

# Agent-wise Responsibilities

## Agent 1 – Speech Agent

### Reads

```json
{
    "patient": {},
    "doctor": {}
}
```

### Updates

```json
{
    "speech": {
        "audio_path": "...",
        "transcript": "..."
    }
}
```

---

## Agent 2 – Prescription Agent

### Reads

```json
{
    "speech": {
        "transcript": "..."
    }
}
```

### Updates

```json
{
    "prescription": {
        "chief_complaint": "",
        "diagnosis": "",
        "medicines": [],
        "tests": [],
        "general_advice": [],
        "follow_up": ""
    }
}
```

---

## Agent 3 – PDF Agent

### Reads

```json
{
    "doctor": {},
    "patient": {},
    "prescription": {}
}
```

### Updates

```json
{
    "pdf": {
        "generated": true,
        "pdf_path": "output/prescriptions/file.pdf"
    }
}
```

---

## Agent 4 – Database Agent

### Reads

```json
{
    "patient": {},
    "doctor": {},
    "prescription": {},
    "pdf": {}
}
```

### Updates

```json
{
    "database": {
        "saved": true,
        "document_id": "MongoDB ObjectId"
    }
}
```

---

## Agent 5 – WhatsApp Agent

### Reads

```json
{
    "patient": {},
    "pdf": {}
}
```

### Updates

```json
{
    "whatsapp": {
        "sent": true,
        "message_id": "..."
    }
}
```

---

## Agent 6 – Pharmacy Agent

### Reads

```json
{
    "patient": {},
    "prescription": {},
    "pdf": {}
}
```

### Updates

```json
{
    "pharmacy": {
        "hospital_pharmacy": true,
        "sent": true
    }
}
```

---

# Complete Example

```json
{
    "consultation": {
        "consultation_id": "CONS001",
        "consultation_date": "15-07-2026",
        "consultation_time": "10:30 AM"
    },

    "doctor": {
        "doctor_name": "Dr. Amit Kumar",
        "qualification": "MBBS",
        "registration_number": "PMC12345",
        "hospital_name": "ABC Hospital",
        "signature_path": "assets/signature.png",
        "stamp_path": "assets/stamp.png"
    },

    "patient": {
        "patient_id": "PAT001",
        "patient_name": "Rahul Sharma",
        "age": 24,
        "gender": "Male",
        "phone": "+919876543210",
        "address": "Ludhiana"
    },

    "speech": {
        "audio_path": "audio/consultation.wav",
        "transcript": "Patient has fever since two days. Prescribe Dolo 650 twice daily after meals for five days."
    },

    "prescription": {
        "chief_complaint": "Fever since two days",
        "diagnosis": "Viral Fever",
        "medicines": [
            {
                "name": "Dolo 650",
                "dosage": "Twice Daily",
                "duration": "5 Days",
                "meal_instruction": "After Meals"
            }
        ],
        "tests": [],
        "general_advice": [
            "Drink plenty of water"
        ],
        "follow_up": "After 5 Days"
    },

    "pdf": {
        "generated": true,
        "pdf_path": "output/prescriptions/Rahul_Sharma.pdf"
    },

    "database": {
        "saved": true,
        "document_id": "6875b6abf10c9d1f5c3d001"
    },

    "whatsapp": {
        "sent": true,
        "message_id": "MSG123456"
    },

    "pharmacy": {
        "hospital_pharmacy": true,
        "sent": true
    }
}
```

---

# Benefits

- A single JSON object is shared across the entire workflow.
- Each agent updates only its own section.
- No need to create or transform multiple JSON objects.
- Easier debugging because the complete consultation state is available in one place.
- Simple to extend by adding new sections (e.g., billing, lab reports, insurance) without changing the existing agent interfaces.

---

# Guiding Principle

> **One Consultation = One Shared JSON Object**

Every agent:
1. Reads the shared JSON.
2. Updates only its assigned section.
3. Passes the same JSON object to the next agent.

This keeps the MVP simple, modular, and easy to maintain.