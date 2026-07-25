"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/app/lib/useCart";
import styles from "./Success.module.css";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [hasCleared, setHasCleared] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const transactionId = searchParams.get("transactionId");
    const amount = searchParams.get("amount");

    if (orderId && transactionId && amount) {
      setPaymentDetails({
        orderId,
        transactionId,
        amount: parseFloat(amount),
      });
      
      // Clear cart after successful payment (only once)
      if (!hasCleared) {
        clearCart();
        setHasCleared(true);
      }
    }
  }, [searchParams, hasCleared]);

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
