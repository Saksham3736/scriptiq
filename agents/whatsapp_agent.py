# Agent 5: WhatsApp Agent
# Responsibilities: Send prescription PDF to patient via Meta WhatsApp Cloud API (or simulation mode) with password access instructions.

import os
import re
import requests
import config


def validate_phone(phone_number: str) -> bool:
    """
    Validate phone number format. Must contain 10 to 15 digits.
    """
    if not phone_number:
        return False
    digits = re.sub(r'\D', '', str(phone_number))
    return 10 <= len(digits) <= 15


def format_phone(phone_number: str) -> str:
    """
    Format phone number to standard clean digits string (e.g. 919876543210).
    """
    return re.sub(r'\D', '', str(phone_number))


class WhatsAppAgent:
    def __init__(self):
        """
        Initialize WhatsApp Agent and load credentials from config.
        """
        self.token = getattr(config, "WHATSAPP_TOKEN", "")
        self.phone_number_id = getattr(config, "WHATSAPP_PHONE_NUMBER_ID", "")
        
        self.is_configured = (
            bool(self.token) 
            and self.token != "your_whatsapp_token_here"
            and bool(self.phone_number_id)
            and self.phone_number_id != "your_whatsapp_phone_number_id_here"
        )

        if self.is_configured:
            print("[WhatsAppAgent] Initialized with live Meta WhatsApp Cloud API credentials.")
        else:
            print("[WhatsAppAgent] Warning: WhatsApp API credentials not set. Simulation mode enabled.")

    def send_whatsapp(self, phone_number: str, pdf_path: str = None, patient_name: str = "Patient", patient_dob: str = None, custom_message: str = None) -> dict:
        """
        Send prescription PDF and notification message (including PDF password) to patient via WhatsApp.
        Always returns a dictionary payload with status, message, and whatsapp_url.
        """
        try:
            # 1. Validate Phone Number
            if not validate_phone(phone_number):
                clean_phone = format_phone(phone_number) or str(phone_number)
                phone_for_url = clean_phone if len(clean_phone) > 10 else f"91{clean_phone}"
                wa_url = f"https://api.whatsapp.com/send?phone={phone_for_url}&text="
                return {
                    "status": "error",
                    "error": f"Invalid phone number format: '{phone_number}'. Must contain 10-15 digits.",
                    "phone": clean_phone,
                    "whatsapp_url": wa_url
                }

            clean_phone = format_phone(phone_number)
            phone_for_url = clean_phone if len(clean_phone) > 10 else f"91{clean_phone}"

            # 2. Construct Message Content with DOB Password Access Key
            if custom_message:
                message_text = custom_message
            else:
                pwd_note = ""
                if patient_dob and str(patient_dob).strip():
                    clean_pwd = str(patient_dob).replace("/", "").replace("-", "").replace(".", "").strip()
                    pwd_note = (
                        f"\n\n🔒 **PDF Security Lock**: Your prescription is password-protected.\n"
                        f"👉 **PDF Password**: `{clean_pwd}` (Date of Birth: {patient_dob})\n"
                        f"Please enter this password when opening your attached PDF document."
                    )

                message_text = (
                    f"Hello {patient_name},\n\n"
                    f"Your digital prescription from MediCare Hospital has been generated successfully.{pwd_note}\n\n"
                    f"Please find your digital prescription attached.\n"
                    f"We wish you a speedy recovery!\n"
                    f"— Dr. Arjun Sharma | MediCare Hospital"
                )

            # Generate 1-click personal WhatsApp URLs (wa.me & web.whatsapp.com)
            import urllib.parse
            encoded_msg = urllib.parse.quote(message_text)
            wa_url = f"https://api.whatsapp.com/send?phone={phone_for_url}&text={encoded_msg}"
            web_wa_url = f"https://web.whatsapp.com/send?phone={phone_for_url}&text={encoded_msg}"

            print(f"[WhatsAppAgent] Preparing WhatsApp message for {patient_name} ({clean_phone})...")

            # 3. Dispatch via Meta Cloud API or Simulation Fallback
            if self.is_configured:
                url = f"https://graph.facebook.com/v18.0/{self.phone_number_id}/messages"
                headers = {
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "messaging_product": "whatsapp",
                    "to": clean_phone,
                    "type": "text",
                    "text": {"body": message_text}
                }

                try:
                    response = requests.post(url, json=payload, headers=headers, timeout=10)
                    res_data = response.json()

                    if response.status_code == 200:
                        print(f"[WhatsAppAgent] Live WhatsApp message sent successfully to {clean_phone}!")
                        return {
                            "status": "success",
                            "mode": "live",
                            "response": res_data,
                            "patient_name": patient_name,
                            "phone": clean_phone,
                            "pdf_path": pdf_path,
                            "message": message_text,
                            "whatsapp_url": wa_url
                        }
                    else:
                        print(f"[WhatsAppAgent] Meta WhatsApp API Error ({response.status_code}): {res_data}")
                        return {
                            "status": "error",
                            "mode": "live",
                            "error": res_data,
                            "phone": clean_phone,
                            "whatsapp_url": wa_url
                        }

                except Exception as err:
                    print(f"[WhatsAppAgent] HTTP request exception: {err}")
                    return {
                        "status": "error",
                        "mode": "live",
                        "error": str(err),
                        "phone": clean_phone,
                        "whatsapp_url": wa_url
                    }

            # Default Simulation / Personal WhatsApp Mode
            return {
                "status": "success",
                "mode": "simulation",
                "patient_name": patient_name,
                "phone": clean_phone,
                "pdf_path": pdf_path,
                "message": message_text,
                "whatsapp_url": wa_url,
                "detail": "Prescription notification prepared successfully. Use 1-Click link for personal WhatsApp sending."
            }

        except Exception as top_err:
            print(f"[WhatsAppAgent] Exception in send_whatsapp: {top_err}")
            clean_phone = format_phone(phone_number) if phone_number else ""
            phone_for_url = clean_phone if len(clean_phone) > 10 else f"91{clean_phone}"
            wa_url = f"https://api.whatsapp.com/send?phone={phone_for_url}" if clean_phone else "https://web.whatsapp.com"
            return {
                "status": "error",
                "error": str(top_err),
                "phone": clean_phone,
                "whatsapp_url": wa_url
            }

    def process_consultation(self, data: dict) -> dict:
        """
        High level workflow entry point for sending WhatsApp prescription.
        """
        patient_name = data.get("patient_name", "Patient")
        phone = data.get("phone", "")
        pdf_path = data.get("pdf_path", "")
        patient_dob = data.get("patient_dob") or data.get("dob")
        
        result = self.send_whatsapp(
            phone_number=phone,
            pdf_path=pdf_path,
            patient_name=patient_name,
            patient_dob=patient_dob
        )
        
        # Check if routing to Pharmacy Agent is requested
        hospital_pharmacy = data.get("hospital_pharmacy", False)
        result["routed_to_pharmacy"] = bool(hospital_pharmacy)
        
        return result
