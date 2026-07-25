# Unit Test for JWT Authentication & RBAC (auth.py)

import os
import sys
import unittest
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from auth import create_access_token, decode_access_token, hash_password, verify_password, DEMO_USERS


class TestAuthModule(unittest.TestCase):

    def test_password_hashing_and_verification(self):
        password = "secretPassword123"
        hashed = hash_password(password)
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("wrongPassword", hashed))

    def test_jwt_token_generation_and_decoding(self):
        user_data = {
            "id": "d-100",
            "email": "doctor@scriptiq.in",
            "role": "doctor",
            "name": "Dr. Test"
        }
        token = create_access_token(user_data, expires_in_seconds=3600)
        self.assertIsInstance(token, str)
        self.assertEqual(len(token.split('.')), 3)

        decoded = decode_access_token(token)
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded["id"], "d-100")
        self.assertEqual(decoded["role"], "doctor")

    def test_invalid_signature_rejection(self):
        token = create_access_token({"id": "d-100", "role": "doctor"})
        parts = token.split('.')
        tampered_token = f"{parts[0]}.{parts[1]}.tamperedSignature"
        self.assertIsNone(decode_access_token(tampered_token))

    def test_expired_token_rejection(self):
        token = create_access_token({"id": "d-100", "role": "doctor"}, expires_in_seconds=-10)
        self.assertIsNone(decode_access_token(token))

    def test_demo_user_credentials(self):
        doctor = DEMO_USERS.get("doctor@scriptiq.in")
        self.assertIsNotNone(doctor)
        self.assertTrue(verify_password("scriptiq123", doctor["password_hash"]))


if __name__ == "__main__":
    unittest.main()
