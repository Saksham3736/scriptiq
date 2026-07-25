# Agent 6: Pharmacy Agent
# Responsibilities: Send prescription to the hospital pharmacy, match inventory, and generate order details.

import os
import random
from datetime import datetime
from google import genai
import config

# Hospital Pharmacy Inventory Catalog (Sample database)
INVENTORY_CATALOG = {
    "dolo 650": {"brand_name": "Dolo 650mg Tablet", "price_per_unit": 30.0, "stock": 150, "unit": "10 Tablets/Strip"},
    "azithromycin 500": {"brand_name": "Azithromycin 500mg Tablet", "price_per_unit": 120.0, "stock": 80, "unit": "3 Tablets/Strip"},
    "paracetamol 500": {"brand_name": "Paracetamol 500mg Tablet", "price_per_unit": 20.0, "stock": 200, "unit": "10 Tablets/Strip"},
    "amoxicillin 500": {"brand_name": "Amoxicillin 500mg Capsule", "price_per_unit": 95.0, "stock": 100, "unit": "10 Capsules/Strip"},
    "pantoprazole 40": {"brand_name": "Pan-40 Tablet", "price_per_unit": 110.0, "stock": 60, "unit": "10 Tablets/Strip"},
    "cetirizine 10": {"brand_name": "Cetzine 10mg Tablet", "price_per_unit": 45.0, "stock": 120, "unit": "10 Tablets/Strip"}
}


class PharmacyAgent:
    def __init__(self):
        """
        Initialize Pharmacy Agent and configure Gemini client if available.
        """
        print("[PharmacyAgent] Initializing Pharmacy Agent...")
        self.gemini_client = None
        if config.GEMINI_API_KEY and config.GEMINI_API_KEY != "your_gemini_api_key_here":
            print("[PharmacyAgent] Gemini API Key found. Initializing Gemini Client...")
            self.gemini_client = genai.Client(api_key=config.GEMINI_API_KEY)
        else:
            print("[PharmacyAgent] Warning: Gemini API Key not set. Operating with local inventory matcher.")

    def extract_medicines(self, prescription_data: dict) -> list:
        """
        Extract medicine items from prescription payload.
        """
        if not prescription_data or not isinstance(prescription_data, dict):
            return []
        
        # If payload has nested prescription object
        if "prescription" in prescription_data:
            prescription_data = prescription_data["prescription"]

        return prescription_data.get("medicines", [])

    def match_inventory(self, medicines: list) -> list:
        """
        Match prescribed medicines against hospital pharmacy inventory catalog.
        """
        matched_items = []

        for med in medicines:
            med_name = med.get("name", "") if isinstance(med, dict) else str(med)
            dosage = med.get("dosage", "1-0-1") if isinstance(med, dict) else "Standard"
            duration = med.get("duration", "5 Days") if isinstance(med, dict) else "5 Days"
            meal_instruction = med.get("meal_instruction", "After Food") if isinstance(med, dict) else ""

            # Search in inventory catalog
            clean_name = med_name.lower().strip()
            inventory_match = None

            for key, item in INVENTORY_CATALOG.items():
                if key in clean_name or clean_name in key:
                    inventory_match = item
                    break

            if inventory_match:
                unit_price = inventory_match["price_per_unit"]
                stock_status = "In Stock" if inventory_match["stock"] > 10 else "Low Stock"
                brand_fullname = inventory_match["brand_name"]
                pack_unit = inventory_match["unit"]
                available = True
            else:
                unit_price = 50.0  # Standard fallback price estimate
                stock_status = "Available on Order"
                brand_fullname = f"{med_name} (Generic Equivalent)"
                pack_unit = "1 Pack"
                available = True

            matched_items.append({
                "prescribed_name": med_name,
                "pharmacy_brand": brand_fullname,
                "dosage": dosage,
                "duration": duration,
                "meal_instruction": meal_instruction,
                "unit_price_inr": unit_price,
                "pack_unit": pack_unit,
                "stock_status": stock_status,
                "available": available
            })

        return matched_items

    def generate_pharmacy_order(self, prescription_data: dict) -> dict:
        """
        Build complete hospital pharmacy order record from prescription data.
        """
        patient_name = prescription_data.get("patient_name") or "Unknown Patient"
        phone = prescription_data.get("phone") or "N/A"
        diagnosis = prescription_data.get("diagnosis") or "General Consultation"
        
        medicines = self.extract_medicines(prescription_data)
        matched_items = self.match_inventory(medicines)

        total_amount = sum(item["unit_price_inr"] for item in matched_items)
        now = datetime.now()
        order_id = f"PHARM-{now.strftime('%Y%m%d')}-{random.randint(1000, 9999)}"

        pharmacy_order = {
            "order_id": order_id,
            "patient_name": patient_name,
            "phone": phone,
            "diagnosis": diagnosis,
            "order_date": now.strftime("%Y-%m-%d %H:%M:%S"),
            "items": matched_items,
            "total_items": len(matched_items),
            "total_amount_inr": round(total_amount, 2),
            "status": "Order Created - Pending Pharmacy Dispense",
            "pickup_location": "ABC Hospital In-House Pharmacy (Counter 2)"
        }

        print(f"[PharmacyAgent] Pharmacy order '{order_id}' generated successfully for {patient_name}.")
        return pharmacy_order

    def process_consultation(self, data: dict) -> dict:
        """
        High-level workflow entry point for processing pharmacy orders.
        """
        return self.generate_pharmacy_order(data)
