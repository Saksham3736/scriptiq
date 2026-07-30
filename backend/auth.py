# auth.py — Standard-library JWT authentication & password hashing engine for ScriptIQ

import os
import json
import time
import hmac
import hashlib
import base64
from typing import Optional, Dict, Any
import config


def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')


def _base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4)) if len(data) % 4 != 0 else ''
    return base64.urlsafe_b64decode(data + padding)


def hash_password(password: str) -> str:
    """Hash password using SHA-256 with secret salt."""
    salt = config.JWT_SECRET_KEY.encode('utf-8')
    return hashlib.sha256(salt + password.encode('utf-8')).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    """Verify raw password against hashed password."""
    return hmac.compare_digest(hash_password(password), hashed)


def create_access_token(user_payload: Dict[str, Any], expires_in_seconds: int = 86400) -> str:
    """
    Generate a signed JWT access token.
    """
    header = {"alg": "HS256", "typ": "JWT"}
    now = int(time.time())

    payload = dict(user_payload)
    payload["iat"] = now
    payload["exp"] = now + expires_in_seconds

    header_b64 = _base64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _base64url_encode(json.dumps(payload, separators=(',', ':')).encode('utf-8'))

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    secret_key = config.JWT_SECRET_KEY.encode('utf-8')

    signature = hmac.new(secret_key, signing_input, hashlib.sha256).digest()
    signature_b64 = _base64url_encode(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and verify a signed JWT access token.
    Returns payload dict if valid and not expired, else None.
    """
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None

        header_b64, payload_b64, signature_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        secret_key = config.JWT_SECRET_KEY.encode('utf-8')

        expected_sig = hmac.new(secret_key, signing_input, hashlib.sha256).digest()
        actual_sig = _base64url_decode(signature_b64)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload_bytes = _base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))

        # Check expiration
        exp = payload.get("exp")
        if exp and time.time() > exp:
            return None

        return payload
    except Exception:
        return None


# Pre-seeded Demo & Production Users Database
DEMO_USERS: Dict[str, Dict[str, Any]] = {
    "doctor@scriptiq.in": {
        "id": "d-001",
        "email": "doctor@scriptiq.in",
        "password_hash": hash_password("scriptiq123"),
        "name": "Dr. Arjun Sharma",
        "role": "doctor",
        "clinic": "Apollo Clinic, Delhi",
    },
    "admin@scriptiq.in": {
        "id": "a-001",
        "email": "admin@scriptiq.in",
        "password_hash": hash_password("scriptiq123"),
        "name": "Priya Admin",
        "role": "admin",
        "clinic": "Apollo Clinic, Delhi",
    },
    "patient@scriptiq.in": {
        "id": "p-001",
        "email": "patient@scriptiq.in",
        "password_hash": hash_password("scriptiq123"),
        "name": "Ravi Mehta",
        "role": "patient",
        "clinic": "",
    },
}
