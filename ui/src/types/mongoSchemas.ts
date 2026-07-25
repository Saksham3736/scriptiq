/* mongoSchemas.ts — TypeScript interfaces mirroring MongoDB Atlas documents */

export interface MedicineSchema {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  strength?: string;
  timing?: string;
  meal_instruction?: string;
}

export interface PrescriptionSchema {
  _id?: string;
  db_id?: string;
  patient_name: string;
  phone?: string;
  dob?: string;
  age?: string;
  gender?: string;
  diagnosis?: string;
  chief_complaint?: string;
  symptoms?: string[];
  medicines?: MedicineSchema[];
  tests?: string[];
  advice?: string[];
  follow_up?: string;
  created_at?: string;
  pdf_path?: string;
  pdf_url?: string;
  status?: string;
  share_token?: string;
}

export interface PharmacyOrderItem {
  prescribed_name: string;
  pharmacy_brand: string;
  dosage: string;
  duration: string;
  unit_price_inr: number;
  pack_unit: string;
}

export interface PharmacyOrderSchema {
  _id?: string;
  order_id: string;
  prescription_id?: string;
  patient_name: string;
  phone: string;
  diagnosis: string;
  items: PharmacyOrderItem[];
  total_amount_inr: number;
  pickup_location: string;
  order_date: string;
  status: 'PENDING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
}
