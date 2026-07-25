"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  placements: Array<"bestseller" | "current">;
  displayOrder: number;
  image?: string;
  available: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 12;

export default function ProductRow() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const currentProducts = useMemo(
    () => products.filter((product) => product.available && (product.placements || []).includes("current")),
    [products]
  );

  const totalPages = Math.max(1, Math.ceil(currentProducts.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage((prevPage) => Math.min(prevPage, totalPages));
  }, [totalPages]);

  const pagedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return currentProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentProducts, currentPage]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-700">CURRENT</h2>
          <span className="text-xs text-slate-500">
            {currentProducts.length} products
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <button
            className="rounded-full border px-3 py-1 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            type="button"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="rounded-full border px-3 py-1 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            type="button"
          >
            Next
          </button>
        </div>
      </div>

      {isLoading && currentProducts.length === 0 ? (
        <div className="text-sm text-slate-500">Loading products...</div>
      ) : currentProducts.length === 0 ? (
        <div className="text-sm text-slate-500">No current products yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {pagedProducts.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="rounded-2xl border bg-white p-3 transition-all hover:shadow-lg hover:border-blue-300"
            >
              {product.image ? (
                <img
                  src={`${API_BASE}/uploads/${product.image}`}
                  alt={product.name}
                  className="aspect-square w-full rounded-xl object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-xl bg-red-500/80" />
              )}

              <div className="mt-3 space-y-1">
                <div className="text-sm font-semibold text-slate-800">
                  {product.name}
                </div>
                <div className="text-sm text-slate-500">${product.price.toFixed(2)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
