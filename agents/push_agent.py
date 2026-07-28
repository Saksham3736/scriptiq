import json
import logging
from pywebpush import webpush, WebPushException
import config

class PushAgent:
    def __init__(self):
        self.logger = logging.getLogger("PushAgent")
        self.logger.setLevel(logging.INFO)
        if not self.logger.handlers:
            ch = logging.StreamHandler()
            ch.setFormatter(logging.Formatter("[%(name)s] %(message)s"))
            self.logger.addHandler(ch)

    def send_push(self, subscription_info: dict, payload: dict) -> bool:
        """
        Sends a Web Push Notification using pywebpush with TTL 86400 (24h mobile queueing).
        subscription_info must be the JSON object provided by PushManager.subscribe() in the browser.
        payload is a dict to be sent as JSON.
        """
        try:
            headers = {"TTL": "86400"}
            webpush(
                subscription_info=subscription_info,
                data=json.dumps(payload),
                vapid_private_key=config.VAPID_PRIVATE_KEY,
                vapid_claims=config.VAPID_CLAIMS,
                headers=headers,
                ttl=86400
            )
            self.logger.info("Successfully sent web push notification (TTL=86400).")
            return True
        except WebPushException as ex:
            self.logger.error(f"Web Push Error: {repr(ex)}")
            if ex.response is not None and ex.response.status_code == 410:
                self.logger.warning("Subscription has expired or is no longer valid (HTTP 410).")
            return False
        except Exception as e:
            self.logger.error(f"Unexpected error sending push: {str(e)}")
            return False

    def send_push_to_subscriptions(self, subscriptions: list, payload: dict) -> int:
        """
        Dispatch web push notification across multiple subscriptions (e.g. multi-device patient endpoints).
        Returns total count of successfully delivered notifications.
        """
        success_count = 0
        for sub in subscriptions:
            if sub and isinstance(sub, dict):
                if self.send_push(sub, payload):
                    success_count += 1
        return success_count
