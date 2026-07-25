# Agent 6 — Pharmacy Agent

## Overview

The **Pharmacy Agent** manages hospital pharmacy order processing, inventory matching, and dispensing receipt generation.

When a patient opts for in-house hospital pharmacy pickup, this agent extracts prescribed medications, matches them against the hospital catalog for live stock and pricing, and generates a pharmacy order record and printable dispensing receipt.

---

# Objective

Automate the bridge between digital doctor consultation prescriptions and hospital pharmacy inventory dispensing.

---

# Workflow

```
Receive Structured Prescription Data
                 │
                 ▼
     Extract Prescribed Medicines
                 │
                 ▼
  Match against In-House Catalog
 (Brand, Price, Stock & Pack Units)
                 │
                 ▼
    Calculate Total Order Price
                 │
                 ▼
      Generate Pharmacy Order
                 │
                 ▼
  Produce Pharmacy Dispensing PDF
```

---

# Responsibilities

The Pharmacy Agent is responsible for:

- Parsing structured medicine data from consultation records.
- Cross-referencing prescribed drugs against hospital inventory database.
- Determining availability status (`In Stock`, `Low Stock`, `Available on Order`).
- Estimating order total costs in INR.
- Producing an official hospital pharmacy order payload and printable dispensing receipt PDF.

---

# Input Data Payload

The agent expects a structured dictionary payload containing prescription and patient details:

```json
{
  "patient_name": "Rahul Sharma",
  "phone": "+91 88722 20999",
  "diagnosis": "Viral Fever",
  "medicines": [
    {
      "name": "Dolo 650",
      "dosage": "Twice Daily",
      "duration": "5 Days",
      "meal_instruction": "After Meals"
    },
    {
      "name": "Azithromycin 500",
      "dosage": "Once Daily",
      "duration": "3 Days",
      "meal_instruction": "After Food"
    }
  ]
}
```

---

# Output Data Payload

Upon execution, the agent returns an itemized order object:

```json
{
  "order_id": "PHARM-20260719-4821",
  "patient_name": "Rahul Sharma",
  "phone": "+91 88722 20999",
  "diagnosis": "Viral Fever",
  "order_date": "2026-07-19 15:45:00",
  "items": [
    {
      "prescribed_name": "Dolo 650",
      "pharmacy_brand": "Dolo 650mg Tablet",
      "dosage": "Twice Daily",
      "duration": "5 Days",
      "meal_instruction": "After Meals",
      "unit_price_inr": 30.0,
      "pack_unit": "10 Tablets/Strip",
      "stock_status": "In Stock",
      "available": true
    }
  ],
  "total_items": 2,
  "total_amount_inr": 150.00,
  "status": "Order Created - Pending Pharmacy Dispense",
  "pickup_location": "ABC Hospital In-House Pharmacy (Counter 2)"
}
```

---

# Python Implementation Example

```python
from agents.pharmacy_agent import PharmacyAgent

# Initialize Pharmacy Agent
agent = PharmacyAgent()

# Process Consultation
order = agent.process_consultation(prescription_data)
print(f"Generated Order ID: {order['order_id']}")
```
