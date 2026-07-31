import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from typing import Dict, Any, Optional

import config as app_config

class EmailAgent:
    """
    Handles sending automated HTML emails with attached prescription PDFs.
    Supports a simulation mode for development/testing without real SMTP credentials.
    """
    def __init__(self):
        pass

    def send_prescription_email(self, pdf_path: str, patient_email: Optional[str] = None, patient_name: Optional[str] = "Patient", config: Optional[Dict[str, Any]] = None) -> bool:
        """
        Sends the encrypted prescription PDF to the patient.
        """
        if config is None:
            config = {}
        
        target_email = patient_email or config.get("patient_email") or getattr(app_config, "DEFAULT_PATIENT_EMAIL", "saksham.kj.3736@gmail.com")
        
        smtp_user = config.get("smtp_user") or getattr(app_config, "SMTP_USER", "scriptiq.sk@gmail.com")
        smtp_pass = config.get("smtp_pass") or getattr(app_config, "SMTP_PASS", "") or os.getenv("SMTP_PASS", "") or os.getenv("GMAIL_APP_PASSWORD", "")
        smtp_host = config.get("smtp_host") or getattr(app_config, "SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(config.get("smtp_port") or getattr(app_config, "SMTP_PORT", 587))
        sender_email = config.get("sender_email") or smtp_user
        hospital_name = config.get("hospital_name", "ScriptIQ Medical Center")

        # Determine simulation mode:
        # If real smtp_pass exists, perform REAL SMTP dispatch unless force_simulation is True
        if bool(smtp_pass):
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

