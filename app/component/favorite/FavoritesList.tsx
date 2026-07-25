"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./FavoritesList.module.css";
import { useFavorites } from "@/app/lib/useFavorites";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FavoritesList() {
  const { favorites, isLoading, removeFavorite } = useFavorites();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>Loading...</div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Favorites</h1>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💔</div>
          <p className={styles.emptyText}>
            You haven't added any favorites yet.
          </p>
          <p style={{ marginBottom: "2rem", color: "#94a3b8" }}>
            Start exploring and add your favorite items!
          </p>
          <Link href="/auth/dashboard" className={styles.backLink}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Favorites</h1>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
          {favorites.length} item{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className={styles.favoritesList}>
        {favorites.map((product) => (
          <div key={product._id} className={styles.favoriteItem}>
            {/* Image */}
            <div className={styles.imageWrapper}>
              {product.image ? (
                <img
                  src={`${API_BASE}/uploads/${product.image}`}
                  alt={product.name}
                  className={styles.productImage}
                />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
            </div>

            {/* Details */}
            <div className={styles.detailsWrapper}>
              <h3 className={styles.productName}>{product.name}</h3>
              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}
            </div>

            {/* Price and Actions */}
            <div className={styles.priceAndActions}>
              <div className={styles.price}>
                ${product.price.toFixed(2)}
              </div>
              <div className={styles.actionButtons}>
                <Link
                  href={`/product/${product._id}`}
                  className={styles.button + " " + styles.viewBtn}
                >
                  View
                </Link>
                <button
                  className={styles.button + " " + styles.removeBtn}
                  onClick={() => removeFavorite(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
