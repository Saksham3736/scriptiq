# Agent 3: PDF Agent
# Responsibilities: Generate a professional prescription PDF using ReportLab with aspect-ratio scaled assets & optional DOB password protection.

import os
from datetime import datetime
from PIL import Image as PILImage
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pdfencrypt import StandardEncryption


def _find_asset_image(options):
    """
    Search for asset image file across possible directory paths and filenames.
    """
    if isinstance(options, str):
        options = [options]
    for path in options:
        if path and os.path.exists(path):
            return path
        if path:
            base_path = os.path.join("assets", os.path.basename(path))
            if os.path.exists(base_path):
                return base_path
    return None


def _get_scaled_image(img_path, max_width, max_height):
    """
    Load image using PIL, calculate aspect ratio, and return scaled ReportLab Image object.
    """
    if not img_path or not os.path.exists(img_path):
        return None
    try:
        with PILImage.open(img_path) as pil_img:
            orig_w, orig_h = pil_img.size
            if orig_w <= 0 or orig_h <= 0:
                return None
            
            aspect = orig_w / float(orig_h)
            
            # Fit within bounding max_width & max_height while maintaining aspect ratio
            width = max_width
            height = width / aspect
            
            if height > max_height:
                height = max_height
                width = height * aspect

            return RLImage(img_path, width=width, height=height)
    except Exception as err:
        print(f"[PDFAgent] Error scaling image '{img_path}': {err}")
        return None


class PDFAgent:
    def __init__(self, output_dir="output/prescriptions"):
        """
        Initialize the PDF Agent and ensure output directory exists.
        """
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        print(f"[PDFAgent] Initialized. Output directory: {self.output_dir}")

    def get_letterhead_settings(self) -> dict:
        """
        Fetch active letterhead settings from database or return default fallback.
        """
        defaults = {
            "hospital_name": "MEDICARE HOSPITAL",
            "hospital_subtitle": "Center for Advanced Medicine & Multispecialty Care",
            "doctor_name": "Dr. Arjun Sharma",
            "doctor_qualification": "MBBS, MD (General Medicine)",
            "doctor_specialization": "Senior Consultant Physician",
            "doctor_reg_no": "PMC/2026/123456",
            "hospital_address": "Civil Lines, Ludhiana, Punjab - 141001",
            "hospital_phone": "+91 98765 43210",
            "hospital_email": "dr.arjunsharma@medicarehospital.com",
            "tagline": "Notice: Valid for 30 days from date of issue. Please bring this prescription on follow-up visit.",
            "primary_color": "#1A365D",
            "secondary_color": "#2B6CB0",
            "header_layout": "center"
        }
        try:
            from database.mongodb import DBHelper
            db = DBHelper()
            db.select_collection("settings")
            config_doc = db.collection.find_one({"_id": "letterhead_config"})
            if config_doc:
                for k, v in config_doc.items():
                    if k != "_id" and v:
                        defaults[k] = v
        except Exception as e:
            print(f"[PDFAgent] Warning fetching letterhead settings from DB: {e}")
        return defaults

    def generate_pdf(self, prescription_data: dict, output_filename: str = None) -> str:
        """
        Generate a professional prescription PDF file from structured prescription JSON.
        Supports aspect-ratio scaling and optional DOB password protection.
        """
        if not prescription_data:
            raise ValueError("Prescription data is empty.")

        saved_letterhead = self.get_letterhead_settings()

        # Extract patient fields with safe defaults
        patient_name = prescription_data.get("patient_name") or "Rahul Sharma"
        age = prescription_data.get("age") or "24"
        gender = prescription_data.get("gender") or "Male"
        dob = prescription_data.get("patient_dob") or prescription_data.get("dob") or ""
        chief_complaint = prescription_data.get("chief_complaint") or "Fever and sore throat"
        diagnosis = prescription_data.get("diagnosis") or "Viral Fever"
        medicines = prescription_data.get("medicines", [])
        tests = prescription_data.get("tests", [])
        general_advice = prescription_data.get("general_advice", [])
        follow_up = prescription_data.get("follow_up") or "After 5 Days"

        # Extract dynamic Doctor/Hospital profile details
        hospital_name = prescription_data.get("hospital_name") or saved_letterhead.get("hospital_name")
        hospital_subtitle = prescription_data.get("hospital_subtitle") or saved_letterhead.get("hospital_subtitle")
        doctor_name = prescription_data.get("doctor_name") or saved_letterhead.get("doctor_name")
        doctor_qualification = prescription_data.get("doctor_qualification") or saved_letterhead.get("doctor_qualification")
        doctor_specialization = prescription_data.get("doctor_specialization") or saved_letterhead.get("doctor_specialization")
        doctor_reg_no = prescription_data.get("doctor_reg_no") or saved_letterhead.get("doctor_reg_no")
        hospital_address = prescription_data.get("hospital_address") or saved_letterhead.get("hospital_address")
        hospital_phone = prescription_data.get("hospital_phone") or saved_letterhead.get("hospital_phone")
        hospital_email = prescription_data.get("hospital_email") or saved_letterhead.get("hospital_email")
        tagline = prescription_data.get("tagline") or saved_letterhead.get("tagline")

        hex_primary = prescription_data.get("primary_color") or saved_letterhead.get("primary_color") or "#1A365D"
        hex_secondary = prescription_data.get("secondary_color") or saved_letterhead.get("secondary_color") or "#2B6CB0"
        header_layout = prescription_data.get("header_layout") or saved_letterhead.get("header_layout") or "center"

        current_time = datetime.now()
        date_str = current_time.strftime("%d %B %Y")
        time_str = current_time.strftime("%I:%M %p")

        # Configure Password Encryption if enabled (default True)
        encrypt_pdf_flag = prescription_data.get("encrypt_pdf")
        if encrypt_pdf_flag is None:
            encrypt_pdf_flag = saved_letterhead.get("encrypt_pdf", True)

        encrypt_obj = None
        if encrypt_pdf_flag:
            clean_pwd = str(dob).replace("/", "").replace("-", "").replace(".", "").strip() if dob else ""
            if not clean_pwd or len(clean_pwd) < 4:
                clean_pwd = "15081995"
            print(f"[PDFAgent] Encrypting PDF with Patient DOB password: '{clean_pwd}'")
            encrypt_obj = StandardEncryption(userPassword=clean_pwd, ownerPassword=clean_pwd, canPrint=1, canModify=0)
        else:
            print("[PDFAgent] PDF generation unencrypted (sample preview or encryption disabled).")

        # Determine output filename
        if not output_filename:
            safe_patient_name = "".join(c for c in patient_name if c.isalnum() or c in (' ', '_')).rstrip().replace(' ', '_')
            filename = f"{safe_patient_name}_{current_time.strftime('%Y-%m-%d_%H-%M')}.pdf"
        else:
            filename = output_filename

        output_path = os.path.join(self.output_dir, filename)

        # Build Document
        doc_kwargs = {
            "pagesize": letter,
            "rightMargin": 36,
            "leftMargin": 36,
            "topMargin": 36,
            "bottomMargin": 36,
        }
        if encrypt_obj:
            doc_kwargs["encrypt"] = encrypt_obj

        doc = SimpleDocTemplate(output_path, **doc_kwargs)
        if encrypt_obj:
            doc.encrypt = encrypt_obj

        styles = getSampleStyleSheet()

        # Custom Palette Styles
        primary_color = colors.HexColor(hex_primary)
        secondary_color = colors.HexColor(hex_secondary)
        accent_color = colors.HexColor("#EDF2F7")    # Soft gray background
        text_dark = colors.HexColor("#2D3748")       # Charcoal

        align_code = TA_CENTER
        if header_layout == "left":
            align_code = TA_LEFT
        elif header_layout == "right":
            align_code = TA_RIGHT

        header_title_style = ParagraphStyle(
            'HeaderTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=20,
            leading=24,
            textColor=primary_color,
            alignment=align_code
        )

        header_sub_style = ParagraphStyle(
            'HeaderSub',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=13,
            textColor=text_dark,
            alignment=align_code
        )

        section_heading_style = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=12,
            leading=15,
            textColor=secondary_color,
            spaceBefore=10,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=text_dark
        )

        table_header_style = ParagraphStyle(
            'TableHeader',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=12,
            textColor=colors.white,
            alignment=TA_CENTER
        )

        elements = []

        # 1. Hospital Logo Image (Aspect-Ratio Scaled)
        logo_path = _find_asset_image(["assets/hospital_logo.png", "hospital.logo.png", "hospital_logo.png"])
        if logo_path:
            logo_img = _get_scaled_image(logo_path, max_width=160, max_height=65)
            if logo_img:
                logo_img.hAlign = 'CENTER' if align_code == TA_CENTER else ('LEFT' if align_code == TA_LEFT else 'RIGHT')
                elements.append(logo_img)
                elements.append(Spacer(1, 4))

        # 2. Letterhead Header Text
        elements.append(Paragraph(hospital_name.upper(), header_title_style))
        if hospital_subtitle:
            elements.append(Paragraph(f"<i>{hospital_subtitle}</i>", header_sub_style))
        elements.append(Paragraph(f"<b>{doctor_name}</b> — {doctor_qualification} | {doctor_specialization}", header_sub_style))
        elements.append(Paragraph(f"Reg No: <b>{doctor_reg_no}</b> | {hospital_address}", header_sub_style))
        elements.append(Paragraph(f"Phone: {hospital_phone} | Email: {hospital_email}", header_sub_style))
        if tagline:
            elements.append(Paragraph(f"<font color='{hex_secondary}'><b>{tagline}</b></font>", header_sub_style))
        elements.append(Spacer(1, 8))
        elements.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceBefore=2, spaceAfter=10))

        # 3. Patient Metadata Card Table
        dob_display = f" | <b>DOB:</b> {dob}" if dob else ""
        patient_info_data = [
            [
                Paragraph(f"<b>Patient Name:</b> {patient_name}{dob_display}", body_style),
                Paragraph(f"<b>Date:</b> {date_str} ({time_str})", body_style)
            ],
            [
                Paragraph(f"<b>Age / Gender:</b> {age} Yrs / {gender}", body_style),
                Paragraph(f"<b>Chief Complaint:</b> {chief_complaint}", body_style)
            ],
            [
                Paragraph(f"<b>Diagnosis:</b> {diagnosis}", body_style),
                Paragraph(f"<b>Follow Up:</b> {follow_up}", body_style)
            ]
        ]

        patient_table = Table(patient_info_data, colWidths=[270, 270])
        patient_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), accent_color),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E0")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(patient_table)
        elements.append(Spacer(1, 14))

        # 4. Prescribed Medicines Section
        elements.append(Paragraph("Rx — Prescribed Medicines", section_heading_style))

        if medicines:
            med_table_data = [[
                Paragraph("#", table_header_style),
                Paragraph("Medicine Name", table_header_style),
                Paragraph("Dosage", table_header_style),
                Paragraph("Duration", table_header_style),
                Paragraph("Instructions", table_header_style)
            ]]

            for idx, med in enumerate(medicines, 1):
                med_name = med.get("name", "N/A") if isinstance(med, dict) else str(med)
                dosage = med.get("dosage", "N/A") if isinstance(med, dict) else ""
                duration = med.get("duration", "N/A") if isinstance(med, dict) else ""
                meal_instruction = med.get("meal_instruction", "N/A") if isinstance(med, dict) else ""

                med_table_data.append([
                    Paragraph(str(idx), ParagraphStyle('Center', parent=body_style, alignment=TA_CENTER)),
                    Paragraph(f"<b>{med_name}</b>", body_style),
                    Paragraph(dosage, body_style),
                    Paragraph(duration, body_style),
                    Paragraph(meal_instruction, body_style)
                ])

            med_table = Table(med_table_data, colWidths=[30, 170, 110, 100, 130])
            med_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), secondary_color),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('PADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E0")),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7FAFC")]),
            ]))
            elements.append(med_table)
        else:
            elements.append(Paragraph("<i>No medicines prescribed.</i>", body_style))

        elements.append(Spacer(1, 12))

        # 5. Recommended Investigations / Tests (if any)
        if tests:
            elements.append(Paragraph("Recommended Investigations / Tests", section_heading_style))
            for test_item in tests:
                elements.append(Paragraph(f"• {test_item}", body_style))
            elements.append(Spacer(1, 10))

        # 6. General Advice & Precautions Section
        if general_advice:
            elements.append(Paragraph("General Advice & Precautions", section_heading_style))
            for advice in general_advice:
                elements.append(Paragraph(f"• {advice}", body_style))
            elements.append(Spacer(1, 10))

        elements.append(Spacer(1, 18))

        # 7. Doctor Signature & Stamp Section (Aspect-Ratio Scaled)
        sig_path = _find_asset_image(["assets/doctor_signature.png", "Doctor_signature.png", "doctor_signature.png"])
        stamp_path = _find_asset_image(["assets/doctor_stamp.png", "hospital.stamp.png", "doctor_stamp.png"])

        stamp_cell = []
        if stamp_path:
            stamp_img = _get_scaled_image(stamp_path, max_width=95, max_height=115)
            if stamp_img:
                stamp_cell.append(stamp_img)
            else:
                stamp_cell.append(Paragraph("<i>[ Hospital Stamp ]</i>", body_style))
        else:
            stamp_cell.append(Paragraph("<i>[ Hospital Stamp ]</i>", body_style))

        sig_cell = []
        if sig_path:
            sig_img = _get_scaled_image(sig_path, max_width=130, max_height=55)
            if sig_img:
                sig_img.hAlign = 'RIGHT'
                sig_cell.append(sig_img)

        right_align_style = ParagraphStyle('RightText', parent=body_style, alignment=TA_RIGHT)
        sig_cell.append(Spacer(1, 4))
        sig_cell.append(Paragraph(f"<b>{doctor_name}</b>", right_align_style))
        sig_cell.append(Paragraph(f"<font color='#475569'>{doctor_qualification}</font>", right_align_style))
        sig_cell.append(Paragraph(f"<font color='#475569'>{doctor_specialization}</font>", right_align_style))
        sig_cell.append(Paragraph(f"Reg. No: <b>{doctor_reg_no}</b>", right_align_style))

        sig_table_data = [[
            stamp_cell,
            sig_cell
        ]]

        sig_table = Table(sig_table_data, colWidths=[270, 270])
        sig_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ]))
        elements.append(sig_table)

        # Build PDF Document
        doc.build(elements)
        print(f"[PDFAgent] Prescription PDF generated successfully: {output_path}")
        return output_path

    def generate_receipt_pdf(self, order_data: dict, doctor_info: dict = None, output_filename: str = None) -> str:
        """
        Generate an official PDF pharmacy dispensing receipt with itemized inventory, totals, doctor signature, and stamp.
        """
        if not order_data:
            raise ValueError("Order data is empty.")

        doctor_info = doctor_info or {}
        order_id = order_data.get("order_id", f"PHARM-{datetime.now().strftime('%Y%m%d-%H%M')}")
        patient_name = order_data.get("patient_name") or "Patient"
        phone = order_data.get("phone") or "N/A"
        diagnosis = order_data.get("diagnosis") or "General Consultation"
        order_date = order_data.get("order_date") or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        items = order_data.get("items", [])
        total_amount = order_data.get("total_amount_inr", 0.0)
        pickup_location = order_data.get("pickup_location") or "Counter 2"

        hospital_name = doctor_info.get("hospital_name") or "MEDICARE HOSPITAL"
        doctor_name = doctor_info.get("doctor_name") or "Dr. Arjun Sharma"
        doctor_qualification = doctor_info.get("doctor_qualification") or "MBBS, MD (General Medicine)"
        doctor_reg_no = doctor_info.get("doctor_reg_no") or "PMC/2026/123456"

        if not output_filename:
            safe_order_id = order_id.replace(" ", "_").replace("/", "_")
            filename = f"Pharmacy_Receipt_{safe_order_id}.pdf"
        else:
            filename = output_filename

        output_path = os.path.join(self.output_dir, filename)

        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        primary_color = colors.HexColor("#0F172A")
        secondary_color = colors.HexColor("#0D9488")
        text_dark = colors.HexColor("#1E293B")

        title_style = ParagraphStyle('RTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=18, leading=22, textColor=primary_color, alignment=TA_CENTER)
        sub_style = ParagraphStyle('RSub', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, leading=14, textColor=secondary_color, alignment=TA_CENTER)
        body_style = ParagraphStyle('RBody', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leading=14, textColor=text_dark)
        th_style = ParagraphStyle('RTH', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=colors.white)

        elements = []

        # Hospital Logo
        logo_path = _find_asset_image(["assets/hospital_logo.png", "hospital.logo.png", "hospital_logo.png"])
        if logo_path:
            logo_img = _get_scaled_image(logo_path, max_width=140, max_height=55)
            if logo_img:
                logo_img.hAlign = 'CENTER'
                elements.append(logo_img)
                elements.append(Spacer(1, 4))

        elements.append(Paragraph(hospital_name.upper(), title_style))
        elements.append(Paragraph("IN-HOUSE PHARMACY DISPENSING RECEIPT", sub_style))
        elements.append(Paragraph(f"Order #{order_id} | Date: {order_date}", ParagraphStyle('RDate', parent=sub_style, fontSize=9, textColor=colors.HexColor("#64748B"))))
        elements.append(Spacer(1, 8))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=secondary_color, spaceBefore=2, spaceAfter=10))

        # Patient Info Block Table
        info_data = [
            [Paragraph(f"<b>Patient Name:</b> {patient_name}", body_style), Paragraph(f"<b>Phone:</b> {phone}", body_style)],
            [Paragraph(f"<b>Diagnosis:</b> {diagnosis}", body_style), Paragraph(f"<b>Pickup Counter:</b> {pickup_location}", body_style)]
        ]
        info_table = Table(info_data, colWidths=[270, 270])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('PADDING', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ]))
        elements.append(info_table)
        elements.append(Spacer(1, 14))

        # Items Table Header
        elements.append(Paragraph("Prescribed Medications & Dispensed Inventory", ParagraphStyle('RSec', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=12, textColor=primary_color)))
        elements.append(Spacer(1, 6))

        item_rows = [[
            Paragraph("#", th_style),
            Paragraph("Item Name / Brand", th_style),
            Paragraph("Dosage & Duration", th_style),
            Paragraph("Pack Unit", th_style),
            Paragraph("Amount (INR)", th_style)
        ]]

        for idx, item in enumerate(items):
            brand = item.get("pharmacy_brand") or item.get("prescribed_name") or f"Item #{idx+1}"
            dosage = item.get("dosage", "")
            duration = item.get("duration", "")
            meal = item.get("meal_instruction", "")
            price = item.get("unit_price_inr", 0.0)
            pack = item.get("pack_unit", "1 Pack")

            details = f"{dosage} ({duration})" if duration else dosage
            if meal: details += f" - {meal}"

            item_rows.append([
                Paragraph(str(idx + 1), body_style),
                Paragraph(f"<b>{brand}</b>", body_style),
                Paragraph(details, body_style),
                Paragraph(pack, body_style),
                Paragraph(f"₹{price:.2f}", body_style)
            ])

        items_table = Table(item_rows, colWidths=[30, 190, 160, 80, 80])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), secondary_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ]))
        elements.append(items_table)
        elements.append(Spacer(1, 12))

        # Total Amount Box
        total_data = [[
            Paragraph("<b>TOTAL AMOUNT PAYABLE:</b>", ParagraphStyle('RTotL', parent=body_style, fontName='Helvetica-Bold', fontSize=12, textColor=primary_color)),
            Paragraph(f"<b>₹{total_amount:.2f} INR</b>", ParagraphStyle('RTotR', parent=body_style, fontName='Helvetica-Bold', fontSize=13, textColor=secondary_color, alignment=TA_CENTER))
        ]]
        total_table = Table(total_data, colWidths=[300, 240])
        total_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ECFDF5")),
            ('PADDING', (0,0), (-1,-1), 8),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#A7F3D0")),
        ]))
        elements.append(total_table)
        elements.append(Spacer(1, 20))

        # Stamp and Doctor Sign-Off Table
        sig_path = _find_asset_image(["assets/doctor_signature.png", "Doctor_signature.png", "doctor_signature.png"])
        stamp_path = _find_asset_image(["assets/doctor_stamp.png", "hospital.stamp.png", "doctor_stamp.png"])

        stamp_cell = []
        if stamp_path:
            stamp_img = _get_scaled_image(stamp_path, max_width=95, max_height=115)
            if stamp_img:
                stamp_cell.append(stamp_img)
            else:
                stamp_cell.append(Paragraph("<i>[ Hospital Stamp ]</i>", body_style))
        else:
            stamp_cell.append(Paragraph("<i>[ Hospital Stamp ]</i>", body_style))

        sig_cell = []
        if sig_path:
            sig_img = _get_scaled_image(sig_path, max_width=130, max_height=55)
            if sig_img:
                sig_cell.append(sig_img)

        right_style = ParagraphStyle('SigR', parent=body_style, alignment=TA_RIGHT)
        sig_cell.append(Paragraph(f"<b>{doctor_name}</b><br/>{doctor_qualification}<br/>Reg. No: {doctor_reg_no}", right_style))

        sig_table = Table([[stamp_cell, sig_cell]], colWidths=[270, 270])
        sig_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ]))
        elements.append(sig_table)

        doc.build(elements)
        print(f"[PDFAgent] Pharmacy Receipt PDF generated successfully: {output_path}")
        return output_path


# Backward compatibility alias
class data_to_pdf(PDFAgent):
    def __init__(self, consultation_id=None, data=None):
        super().__init__()
        self.consultation_id = consultation_id
        self.data = data

    def generate(self):
        if self.data:
            return self.generate_pdf(self.data)
        return None