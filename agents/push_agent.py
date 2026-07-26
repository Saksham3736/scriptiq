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
        Sends a Web Push Notification using pywebpush.
        subscription_info must be the JSON object provided by PushManager.subscribe() in the browser.
        payload is a dict to be sent as JSON.
        """
        try:
            webpush(
                subscription_info=subscription_info,
                data=json.dumps(payload),
                vapid_private_key=config.VAPID_PRIVATE_KEY,
                vapid_claims=config.VAPID_CLAIMS
            )
            self.logger.info("Successfully sent web push notification.")
            return True
        except WebPushException as ex:
            self.logger.error("Web Push Error: {}", repr(ex))
            # If ex.response exists, check for HTTP 410 Gone (unsubscribe)
            if ex.response is not None and ex.response.status_code == 410:
                self.logger.warning("Subscription has expired or is no longer valid (HTTP 410).")
            return False
        except Exception as e:
            self.logger.error("Unexpected error sending push: {}", str(e))
            return False
