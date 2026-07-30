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
