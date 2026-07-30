/* ReceiptTable.tsx — Itemized pharmacy bill table component */

interface ReceiptItem {
  medicine: string;
  generic_name?: string;
  quantity: number;
  unit_price_inr: number;
  total_price_inr: number;
}

interface ReceiptTableProps {
  items: ReceiptItem[];
  totalAmountInr: number;
}

export default function ReceiptTable({ items, totalAmountInr }: ReceiptTableProps) {
  return (
    <div style={{ borderRadius: '12px', border: '1px solid var(--color-border, #E3E8EE)', overflow: 'hidden', background: 'var(--color-bg-surface, #fff)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr style={{ background: 'var(--color-bg-subtle, #F6F8FA)', borderBottom: '1px solid var(--color-border, #E3E8EE)', fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Item Description</th>
            <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>Qty</th>
            <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Unit Price</th>
            <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Total (INR)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid var(--color-border, #F6F8FA)', fontSize: '13px' }}>
              <td style={{ padding: '12px 16px' }}>
                <p style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                  {item.medicine}
                </p>
                {item.generic_name && (
                  <p style={{ fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)', margin: '2px 0 0 0' }}>
                    {item.generic_name}
                  </p>
                )}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'IBM Plex Mono', color: 'var(--color-ink-900, #101A2E)' }}>
                {item.quantity}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'IBM Plex Mono', color: 'var(--color-ink-500, #5B6B82)' }}>
                INR {item.unit_price_inr.toFixed(2)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontWeight: 600, color: 'var(--color-ink-900, #101A2E)' }}>
                INR {item.total_price_inr.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: 'var(--color-primary-light, #E4F3F1)', borderTop: '2px solid #12897F' }}>
            <td colSpan={3} style={{ padding: '14px 16px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', color: '#12897F' }}>
              Total Payable Amount
            </td>
            <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '16px', color: '#12897F' }}>
              INR {totalAmountInr.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
