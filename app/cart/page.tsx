"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/lib/useCart";
import TopBar from "@/app/component/dashboard/TopBar";
import Footer from "@/app/component/dashboard/Footer";
import styles from "./Cart.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, isLoading, removeFromCart, updateQuantity, calculateTotal } = useCart();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (isLoading) {
    return <div className={styles.container}>Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <>
        <TopBar />
        <div className={styles.container}>
          <div className={styles.emptyCart}>
            <p>Your cart is empty</p>
            <a href="/auth/dashboard" className={styles.continueShoppingBtn}>
              Continue Shopping
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const total = calculateTotal();

  return (
    <>
      <TopBar />
      <div className={styles.container}>
        <h1 className={styles.title}>Shopping Cart</h1>
        
        <div className={styles.cartWrapper}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item._id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  {item.image ? (
                    <img
                      src={`${API_BASE}/uploads/${item.image}`}
                      alt={item.name}
                    />
                  ) : (
                    <div className={styles.noImage}>No Image</div>
                  )}
                </div>

                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  {item.description && (
                    <p className={styles.itemDescription}>{item.description}</p>
                  )}
                  <div className={styles.itemPrice}>
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                <div className={styles.itemQuantity}>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className={styles.quantityBtn}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value > 0) {
                        updateQuantity(item._id, value);
                      }
                    }}
                    className={styles.quantityInput}
                    min="1"
                  />
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>

                <div className={styles.itemSubtotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.summaryItems}>
              {cartItems.map((item) => (
                <div key={item._id} className={styles.summaryItem}>
                  <span className={styles.summaryItemName}>
                    {item.name} x {item.quantity}
                  </span>
                  <span className={styles.summaryItemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.divider}></div>

            <div className={styles.totalSection}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalPrice}>${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => router.push("/payment")}
              className={styles.checkoutBtn}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
