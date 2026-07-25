/* useReceipt.ts — Custom hook for generating pharmacy orders and receipts */

import { useState } from 'react';

export interface PharmacyOrderData {
  order_id: string;
  patient_name: string;
  phone?: string;
  total_amount_inr: number;
  pickup_location: string;
  order_date: string;
  items: Array<{
    medicine: string;
    generic_name?: string;
    quantity: number;
    unit_price_inr: number;
    total_price_inr: number;
  }>;
  status: string;
}

export function useReceipt() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<PharmacyOrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReceipt = async (
    prescriptionData: Record<string, any>,
    wantInHouseBuy: boolean = true,
    phone?: string
  ): Promise<PharmacyOrderData | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/pharmacy/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescription_data: prescriptionData,
          want_in_house_buy: wantInHouseBuy,
          phone,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.pharmacy_order) {
        const orderData = json.data.pharmacy_order;
        setOrder(orderData);
        return orderData;
      } else {
        throw new Error(json.error || 'Failed to generate pharmacy receipt');
      }
    } catch (err: any) {
      console.error('[useReceipt Error]', err);
      setError(err.message || 'Receipt generation failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    order,
    error,
    generateReceipt,
  };
}
