# Configuration settings for AI Prescription Assistant
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Config
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "ai_prescription")

# Gemini / Gemma API Config
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gemini-2.0-flash")

# JWT Authentication Config
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "scriptiq-super-secret-jwt-key-2026")
JWT_ALGORITHM = "HS256"

# Web Push Notifications (VAPID)
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY", os.path.join(os.path.dirname(os.path.abspath(__file__)), "vapid_private.pem"))
VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY", "BD3tmSicsE_2-a3_lG1yHpePnf2QLDnPx65cGgCzronPmSA86KX-H0OFfixR7ADYaFxIv1257RklLVrloPTgQyc")
VAPID_CLAIMS = {"sub": "mailto:admin@scriptiq.com"}

# Gmail SMTP Email Config
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "scriptiq.sk@gmail.com")
SMTP_PASS = os.getenv("SMTP_PASS", os.getenv("GMAIL_APP_PASSWORD", ""))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "scriptiq.sk@gmail.com")
DEFAULT_PATIENT_EMAIL = os.getenv("DEFAULT_PATIENT_EMAIL", "saksham.kj.3736@gmail.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://scriptiq-sk.vercel.app")

def resolve_pdf_password(dob: str = None, phone: str = None) -> tuple:
    """
    Unified PDF password resolution engine.
    Priority 1: DOB (8 digits, e.g. 15081995) -> label "DOB (DDMMYYYY)"
    Priority 2: Last 4 digits of phone number -> label "Phone (Last 4 Digits)"
    Priority 3: Default fallback "1234" -> label "Default Passcode (1234)"
    Returns (password_string, display_label).
    """
    if dob:
        clean_dob = "".join(c for c in str(dob) if c.isdigit())
        if len(clean_dob) == 8:
            return clean_dob, f"DOB ({clean_dob[:2]}/{clean_dob[2:4]}/{clean_dob[4:]})"
        elif len(clean_dob) >= 4:
            return clean_dob, f"DOB ({clean_dob})"

    if phone:
        clean_phone = "".join(c for c in str(phone) if c.isdigit())
        if len(clean_phone) >= 4:
            last4 = clean_phone[-4:]
            return last4, f"Phone (Last 4 Digits: {last4})"

    return "1234", "Default Passcode (1234)"
