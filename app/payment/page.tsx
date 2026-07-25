"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/lib/useCart";
import styles from "./Payment.module.css";

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, calculateTotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [hydrated, cartItems, router]);

  const handlePayment = () => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const total = calculateTotal();
      const orderId = `ORDER-${Date.now()}`;
      const transactionId = `TXN-${Date.now()}`;
      
      // Navigate to success page with payment details
      router.push(`/payment/success?orderId=${orderId}&transactionId=${transactionId}&amount=${total}`);
    }, 1000);
  };

  if (!hydrated) {
    return null;
  }

  if (cartItems.length === 0) {
    return null;
  }

  const total = calculateTotal();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Payment Checkout</h1>

        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.items}>
            {cartItems.map((item, index) => (
              <div key={item._id} className={styles.item}>
                <span className={styles.itemName}>
                  {item.name} x {item.quantity}
                </span>
                <span className={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.divider}></div>

          <div className={styles.total}>
            <span className={styles.totalLabel}>Total:</span>
            <span className={styles.totalAmount}>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className={styles.payButton}
          >
            {isLoading ? "Processing..." : "Confirm Payment"}
          </button>

          <button
            onClick={() => router.push("/cart")}
            disabled={isLoading}
            className={styles.backButton}
          >
            Back to Cart
          </button>
        </div>

        <p className={styles.footer}>Secure payment</p>
      </div>
    </div>
  );
}
