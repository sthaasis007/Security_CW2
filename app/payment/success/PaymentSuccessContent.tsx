"use client";
import { useEffect, useState } from "react";
import apiFetch from "@/app/lib/request";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/app/lib/useCart";
import styles from "./Success.module.css";

export default function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [hasCleared, setHasCleared] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const transactionId = searchParams.get("transactionId");
    const amount = searchParams.get("amount");
    const pidx = searchParams.get("pidx");

    const run = async () => {
      if (pidx) {
        // verify with backend
          try {
          const res = await apiFetch('/api/payment/verify', { method: 'POST', body: JSON.stringify({ pidx }) });
          const body = await res.json().catch(() => ({}));
          if (res.ok && body?.data) {
            const data = body.data;
            // Khalti returns total_amount in paisa
            const paid = (data.total_amount || data.total_amount_in_paisa || 0) / 100;
            setPaymentDetails({
              orderId: data.purchase_order_id || pidx,
              transactionId: data.transaction_id || data.transaction_id || data.transaction || searchParams.get('transaction_id') || '',
              amount: paid,
            });
            if (!hasCleared) {
              clearCart();
              setHasCleared(true);
            }
            return;
          }
          console.error('Payment verify failed', body);
        } catch (err) {
          console.error('Payment verify error', err);
        }
      }

      if (orderId && transactionId && amount) {
        setPaymentDetails({
          orderId,
          transactionId,
          amount: parseFloat(amount),
        });

        if (!hasCleared) {
          clearCart();
          setHasCleared(true);
        }
      }
    };

    void run();
  }, [searchParams, hasCleared, clearCart]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.success}>
          <div className={styles.checkmark}>✓</div>
          <h1>Payment Successful!</h1>
          <p>Thank you for your purchase</p>

          {paymentDetails && (
            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span>Order ID:</span>
                <span>{paymentDetails.orderId}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Transaction ID:</span>
                <span>{paymentDetails.transactionId}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Amount Paid:</span>
                <span>${paymentDetails.amount.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={() => router.push("/auth/dashboard")}
              className={styles.primaryButton}
            >
              Continue Shopping
            </button>
            <button
              onClick={() => router.push("/profile")}
              className={styles.secondaryButton}
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
