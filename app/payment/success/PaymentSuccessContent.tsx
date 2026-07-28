"use client";
import { useEffect, useState } from "react";
import apiFetch from "@/app/lib/request";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./Success.module.css";

export default function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [message, setMessage] = useState("Verifying payment with Khalti…");

  useEffect(() => {
    const pidx = searchParams.get("pidx");

    const run = async () => {
      if (pidx) {
        // verify with backend
          try {
          const res = await apiFetch('/api/payment/verify', { method: 'POST', body: JSON.stringify({ pidx }) });
          const body = await res.json().catch(() => ({}));
          if (res.ok && body?.order) {
            const order = body.order;
            setPaymentDetails({
              orderId: order.orderId,
              transactionId: order.transactionId || "",
              amount: order.amountPaisa / 100,
            });
            setMessage(body.idempotent ? "This payment was already verified." : "Payment verified successfully.");
            return;
          }
          setMessage(body.message || "Payment could not be verified.");
        } catch {
          setMessage("Payment verification is temporarily unavailable.");
        }
      } else {
        setMessage("Missing payment reference.");
      }
    };

    void run();
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.success}>
          <div className={styles.checkmark}>✓</div>
          <h1>{paymentDetails ? "Payment Successful!" : "Payment Status"}</h1>
          <p>{message}</p>

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
              onClick={() => router.push("/cart")}
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
