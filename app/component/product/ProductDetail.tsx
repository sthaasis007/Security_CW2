"use client";
import { useEffect, useState } from "react";
import styles from "./ProductDetail.module.css";
import { useFavorites } from "@/app/lib/useFavorites";
import { useCart } from "@/app/lib/useCart";
import { buildImageUrl } from "@/app/lib/imageUrl";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  available: boolean;
}

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching product with ID:", productId);
        const url = `/api/products/${productId}`;
        console.log("Fetch URL:", url);
        
        const res = await fetch(url, {
          cache: "no-store",
        });
        
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);
        
        if (!res.ok) {
          throw new Error(data.message || "Product not found");
        }
        
        setProduct(data.product);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load product";
        console.error("Fetch error:", errorMessage);
        setError(errorMessage);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart({
      _id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
    });
  };

  const handleToggleFavorite = async () => {
    if (!product) return;
    await toggleFavorite({
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  const isFav = hydrated && isFavorite(product._id);

  return (
    <div className={styles.container}>
      <div className={styles.productWrapper}>
        {/* Image Section */}
        <div className={styles.imageContainer}>
          {product.image ? (
            <img
              src={buildImageUrl(product.image) || ""}
              alt={product.name}
              className={styles.productImage}
            />
          ) : (
            <div className={styles.noImage}>No Image Available</div>
          )}
        </div>

        {/* Details Section */}
        <div className={styles.detailsSection}>
          <h1 className={styles.productName}>{product.name}</h1>

          <div className={styles.priceSection}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          </div>

          <div className={styles.actionsContainer}>
            <button
              className={`${styles.button} ${styles.favoriteBtn} ${
                isFav ? styles.active : ""
              }`}
              onClick={handleToggleFavorite}
            >
              <span>{isFav ? "♥" : "♡"}</span>
              <span>Favorite</span>
            </button>
            <button
              className={`${styles.button} ${styles.cartBtn}`}
              onClick={handleAddToCart}
            >
              <span>🛒</span>
              <span>Add to Cart</span>
            </button>
          </div>

          {product.description && (
            <div className={styles.descriptionSection}>
              <h2 className={styles.descriptionTitle}>Description</h2>
              <p className={styles.descriptionText}>{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
