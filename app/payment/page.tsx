"use client";
import { useEffect, useState } from "react";
import apiFetch from "@/app/lib/request";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/lib/useCart";
import styles from "./Payment.module.css";

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, calculateTotal, isLoading } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Wait for cart to finish loading before deciding to redirect back to cart.
    if (hydrated && !isLoading && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [hydrated, isLoading, cartItems, router]);

  const handlePayment = () => {
    setIsProcessing(true);

    (async () => {
      try {
        const total = calculateTotal();
        const orderId = `ORDER-${Date.now()}`;

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const res = await apiFetch('/api/payment/initiate', {
          method: 'POST',
          body: JSON.stringify({
            amount: Math.round(total * 100), // send paisa to backend consistently
            purchase_order_id: orderId,
            purchase_order_name: `Order ${orderId}`,
            cart_items: cartItems,
          }),
        });

        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error('Failed to initiate payment', res.status, body);
          alert(body?.message || 'Failed to start payment');
          setIsProcessing(false);
          return;
        }

        // backend returns a payment_url in test mode or Khalti initiate data
        const paymentUrl = body?.data?.payment_url || body?.data?.payment_url || body?.payment_url || body?.data?.payment_url;
        const pidx = body?.data?.pidx || body?.pidx || (body?.data && body.data.pidx);

        if (paymentUrl) {
          // Redirect user to Khalti checkout (or mock URL in test mode)
          window.location.href = paymentUrl;
          return;
        }

        // If no payment url but pidx returned, navigate to success with pidx so we can verify
        if (pidx) {
          router.push(`/payment/success?pidx=${encodeURIComponent(pidx)}`);
          return;
        }

        alert('Unexpected payment response');
      } catch (err) {
        console.error('Payment error', err);
        alert('Payment failed');
      } finally {
        setIsProcessing(false);
      }
    })();
  };

  if (!hydrated || isLoading) {
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
            disabled={isProcessing}
            className={styles.payButton}
          >
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </button>

          <button
            onClick={() => router.push("/cart")}
            disabled={isProcessing}
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
