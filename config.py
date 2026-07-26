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
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY", "oIpwWq82n7iHzOI3Seh3vjLKqdfDyI2W5yhsGmd0lvM")
VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY", "BPGY-QHh7lR2sUIZpMVL6hxvo9R9D_3QTS5iV_zHWSSVCwPYE4qtARm5un_OX8mdZuwnr3fty0c9xMvxB_0YPXg")
VAPID_CLAIMS = {"sub": "mailto:admin@scriptiq.com"}
