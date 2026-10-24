import os
import smtplib
import base64
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from typing import Dict, Any, Optional

import config as app_config

class EmailAgent:
    """
    Handles sending automated HTML emails with attached prescription PDFs.
    Supports Brevo HTTPS REST API (cloud/Render proof on Port 443),
    standard Gmail SMTP (local), and a simulation mode for development/testing.
    """
    def __init__(self):
        pass

    def _resolve_brevo_envelope(self, sender_email: str) -> str:
        """
        DMARC compliance resolver:
        Free email domains (@gmail.com, @yahoo, @outlook, @hotmail) are blocked by Brevo
        and mail filters with 'Your sending platform is currently disabled' because third-party
        relays cannot spoof Gmail SPF/DKIM.
        When a Gmail/free domain sender is provided, route through Brevo's authenticated subdomain
        (defaulting to 12568848.brevosend.com or BREVO_SEND_DOMAIN), while keeping the Doctor's
        display name, Reply-To header, and automatic BCC to the doctor's actual Gmail inbox!
        """
        sender_email = (sender_email or "scriptiq.sk@gmail.com").strip().lower()
        free_providers = ("@gmail.com", "@yahoo.", "@outlook.", "@hotmail.")
        if any(p in sender_email for p in free_providers):
            domain = getattr(app_config, "BREVO_SEND_DOMAIN", "12568848.brevosend.com")
            username = sender_email.split("@")[0] or "scriptiq.sk"
            return f"{username}@{domain}"
        return sender_email

    def _send_via_brevo(self, api_key: str, sender_email: str, hospital_name: str, target_email: str, patient_name: str, subject: str, html_content: str, pdf_path: Optional[str] = None) -> bool:
        """
        Dispatches email with attachment via Brevo Python SDK (sib_api_v3_sdk)
        over Port 443 HTTPS. Bypasses cloud provider SMTP firewall blocks (Render Errno 101).
        
        Features:
          - Uses sib_api_v3_sdk.TransactionalEmailsApi (official Brevo SDK)
          - Automatic DMARC-compliant envelope address (Brevo verified subdomain)
          - Automatic BCC copy to the doctor's Gmail so it arrives directly in their Gmail inbox
          - Automatic Reply-To set to the doctor's Gmail so patient replies go straight to the doctor
          - Encoded Base64 PDF attachment support
          - Graceful fallback to direct REST API (requests) if SDK encounters any error
        """
        envelope_sender = self._resolve_brevo_envelope(sender_email)
        doctor_email = sender_email or "scriptiq.sk@gmail.com"
        
        # Read & Base64-encode PDF attachment if present
        encoded_pdf = None
        pdf_filename = None
        if pdf_path and os.path.exists(pdf_path):
            try:
                with open(pdf_path, "rb") as f:
                    encoded_pdf = base64.b64encode(f.read()).decode("utf-8")
                pdf_filename = os.path.basename(pdf_path)
            except Exception as read_err:
                print(f"[EmailAgent] Notice: Failed to attach PDF ({read_err})")
        else:
            print(f"[EmailAgent] Notice: No PDF attachment found at {pdf_path}")

        # 1. Attempt dispatch using official Brevo SDK (sib_api_v3_sdk)
        try:
            import sib_api_v3_sdk
            from sib_api_v3_sdk.rest import ApiException

            configuration = sib_api_v3_sdk.Configuration()
            configuration.api_key['api-key'] = api_key
            api_client = sib_api_v3_sdk.ApiClient(configuration)
            api_instance = sib_api_v3_sdk.TransactionalEmailsApi(api_client)

            attachments = []
            if encoded_pdf and pdf_filename:
                attachments.append(sib_api_v3_sdk.SendSmtpEmailAttachment(
                    name=pdf_filename,
                    content=encoded_pdf
                ))

            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                sender=sib_api_v3_sdk.SendSmtpEmailSender(name=hospital_name, email=envelope_sender),
                to=[sib_api_v3_sdk.SendSmtpEmailTo(email=target_email, name=patient_name or "Patient")],
                reply_to=sib_api_v3_sdk.SendSmtpEmailReplyTo(email=doctor_email, name=hospital_name),
                bcc=[sib_api_v3_sdk.SendSmtpEmailBcc(email=doctor_email, name="ScriptIQ Audit & Records")],
                subject=subject,
                html_content=html_content,
                attachment=attachments if attachments else None
            )

            print(f"[EmailAgent] Dispatching email to {target_email} via Brevo SDK (sib_api_v3_sdk)...")
            api_response = api_instance.send_transac_email(send_smtp_email)
            msg_id = getattr(api_response, "message_id", str(api_response))
            print(f"[EmailAgent] Email successfully delivered via Brevo SDK! Message ID: {msg_id}")
            return True

        except Exception as sdk_err:
            print(f"[EmailAgent] Notice: Brevo SDK call encountered ({sdk_err}), falling back to direct HTTPS REST API...")

        # 2. Fallback: Direct HTTPS REST API call via requests
        url = "https://api.brevo.com/v3/smtp/email"
        headers = {
            "accept": "application/json",
            "api-key": api_key,
            "content-type": "application/json"
        }
        payload = {
            "sender": {
                "name": hospital_name,
                "email": envelope_sender
            },
            "to": [
                {
                    "email": target_email,
                    "name": patient_name or "Patient"
                }
            ],
            "replyTo": {
                "email": doctor_email,
                "name": hospital_name
            },
            "bcc": [
                {
                    "email": doctor_email,
                    "name": "ScriptIQ Audit & Records"
                }
            ],
            "subject": subject,
            "htmlContent": html_content
        }

        if encoded_pdf and pdf_filename:
            payload["attachment"] = [
                {
                    "name": pdf_filename,
                    "content": encoded_pdf
                }
            ]

        print(f"[EmailAgent] Dispatching email to {target_email} via Brevo HTTPS REST API (Port 443 fallback)...")
        response = requests.post(url, headers=headers, json=payload, timeout=20)
        if response.status_code in (200, 201, 202):
            res_data = response.json() if response.text else {}
            print(f"[EmailAgent] Email successfully delivered via Brevo REST API! Message ID: {res_data.get('messageId')}")
            return True
        else:
            err_msg = f"Brevo API error ({response.status_code}): {response.text}"
            print(f"[EmailAgent] {err_msg}")
            raise Exception(err_msg)

    def create_email_campaign(self, api_key: str, name: str, subject: str, html_content: str, sender_email: str = "saksham.kj.3736@gmail.com", sender_name: str = "ScriptIQ", list_ids: list = None) -> dict:
        """
        Creates an email campaign using Brevo SDK (sib_api_v3_sdk.EmailCampaignsApi).
        Directly implements Brevo's Campaign API snippet.
        """
        import sib_api_v3_sdk
        from sib_api_v3_sdk.rest import ApiException
        
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = api_key
        api_instance = sib_api_v3_sdk.EmailCampaignsApi(sib_api_v3_sdk.ApiClient(configuration))
        
        if list_ids is None:
            list_ids = [2]
            
        email_campaign = sib_api_v3_sdk.CreateEmailCampaign(
            name=name,
            subject=subject,
            sender={"name": sender_name, "email": sender_email},
            html_content=html_content,
            recipients={"listIds": list_ids}
        )
        
        api_response = api_instance.create_email_campaign(email_campaign)
        return api_response


    def send_prescription_email(self, pdf_path: str, patient_email: Optional[str] = None, patient_name: Optional[str] = "Patient", config: Optional[Dict[str, Any]] = None) -> bool:
        """
        Sends the encrypted prescription PDF to the patient.
        """
        if config is None:
            config = {}
        
        target_email = patient_email or config.get("patient_email") or getattr(app_config, "DEFAULT_PATIENT_EMAIL", "saksham.kj.3736@gmail.com")
        
        brevo_api_key = config.get("brevo_api_key") or os.getenv("BREVO_API_KEY") or getattr(app_config, "BREVO_API_KEY", "")
        smtp_user = config.get("smtp_user") or getattr(app_config, "SMTP_USER", "scriptiq.sk@gmail.com")
        smtp_pass = config.get("smtp_pass") or getattr(app_config, "SMTP_PASS", "") or os.getenv("SMTP_PASS", "") or os.getenv("GMAIL_APP_PASSWORD", "")
        smtp_host = config.get("smtp_host") or getattr(app_config, "SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(config.get("smtp_port") or getattr(app_config, "SMTP_PORT", 587))
        sender_email = config.get("sender_email") or smtp_user
        hospital_name = config.get("hospital_name", "ScriptIQ Medical Center")

        # Determine simulation mode:
        # If Brevo API key or real smtp_pass exists, perform REAL dispatch unless force_simulation is True
        if bool(brevo_api_key) or bool(smtp_pass):
            simulation_mode = config.get("force_simulation", False)
        else:
            simulation_mode = True

        # Resolve PDF Password for explicit callout using shared engine
        pdf_password = config.get("pdf_password")
        if not pdf_password:
            dob = config.get("dob") or config.get("patient_dob") or ""
            phone = config.get("phone") or config.get("patient_phone") or ""
            pdf_password, _ = app_config.resolve_pdf_password(dob, phone)

        password_banner = f"""
        <div style="background-color: #E4F3F1; border-left: 4px solid #12897F; padding: 14px 18px; margin: 18px 0; border-radius: 8px; font-family: sans-serif;">
            <p style="margin: 0; font-size: 14px; color: #101A2E; font-weight: 600;">
                🔒 <strong>PDF Security Password:</strong> <code style="background: #ffffff; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 18px; color: #12897F; letter-spacing: 1px; border: 1px solid #BCE3DF;">{pdf_password}</code>
            </p>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #5B6B82;">
                Use this exact password to open your attached prescription PDF document.
            </p>
        </div>
        """

        subject = f"Your Prescription from {hospital_name}"
        body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #12897F; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; }}
                .content {{ padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }}
                .footer {{ margin-top: 20px; font-size: 12px; color: #777; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>{hospital_name}</h2>
                </div>
                <div class="content">
                    <p>Dear <strong>{patient_name or 'Patient'}</strong>,</p>
                    <p>Your latest prescription is attached to this email as a PDF document.</p>
                    {password_banner}
                    <p>Wishing you a speedy recovery!</p>
                </div>
                <div class="footer">
                    <p>This is an automated email from ScriptIQ on behalf of {hospital_name}. Please do not reply directly to this message.</p>
                </div>
            </div>
        </body>
        </html>
        """

        # 1. Primary Cloud Path: Brevo HTTPS REST API (Port 443 — Render & cloud firewall proof)
        if bool(brevo_api_key) and not simulation_mode:
            return self._send_via_brevo(
                api_key=brevo_api_key,
                sender_email=sender_email,
                hospital_name=hospital_name,
                target_email=target_email,
                patient_name=patient_name,
                subject=subject,
                html_content=body,
                pdf_path=pdf_path
            )

        if simulation_mode or not smtp_pass:
            print("\n" + "="*50)
            print("[SIMULATION MODE] EMAIL DISPATCH INITIATED")
            print("="*50)
            print(f"To: {target_email}")
            print(f"From: {sender_email}")
            print(f"Subject: {subject}")
            print(f"Attachment: {os.path.basename(pdf_path) if pdf_path else 'None'}")
            print("-" * 50)
            print(body)
            print("="*50 + "\n")
            return True

        # Actual SMTP Dispatch with Dual-Mode (Port 465 SSL -> Port 587 STARTTLS) & 10s Timeout
        msg = MIMEMultipart()
        msg['From'] = f"{hospital_name} <{sender_email}>"
        msg['To'] = target_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'html'))

        if pdf_path and os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                part = MIMEApplication(f.read(), Name=os.path.basename(pdf_path))
            part['Content-Disposition'] = f'attachment; filename="{os.path.basename(pdf_path)}"'
            msg.attach(part)
        else:
            print(f"[EmailAgent] Warning: PDF not found at {pdf_path}")

        timeout_sec = int(config.get("timeout", 10))
        last_exception = None

        # 1. Try Port 465 (Implicit SSL/TLS) — Cloud-Firewall Proof Primary Path
        try:
            print(f"[EmailAgent] Attempting SMTP_SSL connection to {smtp_host}:465 (timeout={timeout_sec}s)...")
            server = smtplib.SMTP_SSL(smtp_host, 465, timeout=timeout_sec)
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            server.quit()
            print(f"[EmailAgent] Email successfully sent to {target_email} via Port 465 (SSL)")
            return True
        except Exception as ssl_err:
            print(f"[EmailAgent] Port 465 SSL failed ({ssl_err}). Falling back to Port {smtp_port} STARTTLS...")
            last_exception = ssl_err

        # 2. Fallback: Port 587 (STARTTLS)
        try:
            print(f"[EmailAgent] Attempting STARTTLS connection to {smtp_host}:{smtp_port} (timeout={timeout_sec}s)...")
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=timeout_sec)
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            server.quit()
            print(f"[EmailAgent] Email successfully sent to {target_email} via Port {smtp_port} (STARTTLS)")
            return True
        except Exception as tls_err:
            print(f"[EmailAgent] Port {smtp_port} STARTTLS failed: {tls_err}")
            last_exception = tls_err

        raise Exception(f"Failed to send email via SMTP (465 SSL & {smtp_port} STARTTLS both failed): {str(last_exception)}")

