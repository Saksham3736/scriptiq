import os
import logging
import requests
from typing import Dict, Any

logger = logging.getLogger("SMSAgent")
logger.setLevel(logging.INFO)

class SMSAgent:
    """
    SMSAgent handles direct cellular SMS dispatch to mobile phone numbers.
    Supports Fast2SMS (India) and Twilio (Global).
    """
    def __init__(self):
        self.fast2sms_key = os.getenv("FAST2SMS_API_KEY", "")
        self.twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
        self.twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
        self.twilio_phone_number = os.getenv("TWILIO_PHONE_NUMBER", "")

    def send_sms(self, phone: str, message: str) -> Dict[str, Any]:
        """
        Sends an SMS text message to a mobile phone number.
        """
        clean_phone = "".join(filter(str.isdigit, str(phone)))
        
        # 1. Try Fast2SMS (India numbers e.g. 9888478606)
        if self.fast2sms_key:
            try:
                url = "https://www.fast2sms.com/dev/bulkV2"
                payload = {
                    "route": "otp" if "OTP" in message else "q",
                    "message": message,
                    "language": "english",
                    "flash": 0,
                    "numbers": clean_phone[-10:]
                }
                headers = {
                    "authorization": self.fast2sms_key,
                    "Content-Type": "application/json"
                }
                res = requests.post(url, json=payload, headers=headers, timeout=10)
                data = res.json()
                if data.get("return"):
                    logger.info(f"[SMSAgent] Fast2SMS dispatched successfully to {phone}")
                    return {"success": True, "provider": "Fast2SMS", "details": data}
                else:
                    logger.warning(f"[SMSAgent] Fast2SMS error: {data}")
            except Exception as e:
                logger.error(f"[SMSAgent] Fast2SMS exception: {e}")

        # 2. Try Twilio
        if self.twilio_account_sid and self.twilio_auth_token:
            try:
                from twilio.rest import Client
                client = Client(self.twilio_account_sid, self.twilio_auth_token)
                formatted_phone = f"+91{clean_phone[-10:]}" if len(clean_phone) == 10 else f"+{clean_phone}"
                msg = client.messages.create(
                    body=message,
                    from_=self.twilio_phone_number,
                    to=formatted_phone
                )
                logger.info(f"[SMSAgent] Twilio SMS dispatched SID: {msg.sid}")
                return {"success": True, "provider": "Twilio", "sid": msg.sid}
            except Exception as e:
                logger.error(f"[SMSAgent] Twilio exception: {e}")

        # 3. Fallback / Dev Mode Logger
        logger.info(f"[SMSAgent Dev Mode] SMS payload generated for {phone}: '{message}'")
        return {
            "success": True,
            "simulated": True,
            "provider": "DevLogger",
            "phone": phone,
            "message": message,
            "note": "To receive real SMS on 9888478606, set FAST2SMS_API_KEY in .env"
        }
