"use client";

import { useEffect, useMemo, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  placements: Array<"bestseller" | "current">;
  image?: string;
  available: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CircleCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const bestSellers = useMemo(
    () => products.filter((product) => product.available && (product.placements || []).includes("bestseller")),
    [products]
  );

  return (
    <section className="mx-auto max-w-6xl px-4">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">BESTSELLER</h2>

      {isLoading && bestSellers.length === 0 ? (
        <div className="text-sm text-slate-500">Loading best sellers...</div>
      ) : bestSellers.length === 0 ? (
        <div className="text-sm text-slate-500">No best sellers yet.</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {bestSellers.map((product) => (
            <div key={product._id} className="flex shrink-0 flex-col items-center gap-2">
              {product.image ? (
                <img
                  src={`${API_BASE}/uploads/${product.image}`}
                  alt={product.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-red-500/80" />
              )}
              <div className="text-xs text-slate-600 truncate w-16 text-center">
                {product.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
