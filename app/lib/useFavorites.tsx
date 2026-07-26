import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import apiFetch from "@/app/lib/request";

interface FavoriteProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const syncFavorites = useCallback(async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiFetch("/api/favorites");
      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data = await res.json();
      const items = (data.favorites || []).map((item: any) => ({
        _id: item.productId?._id || item.productId,
        name: item.productName || item.productId?.name || "Product",
        price: item.productPrice || item.price || 0,
        description: item.productDescription,
        image: item.productImage,
      }));
      setFavorites(items);
    } catch (error) {
      console.error("Failed to load favorites", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void syncFavorites();
  }, [syncFavorites]);

  const addFavorite = async (product: FavoriteProduct) => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setFavorites((prev) => (prev.some((p) => p._id === product._id) ? prev : [...prev, product]));
      return;
    }

    const res = await apiFetch("/api/favorites", { method: "POST", body: JSON.stringify({ productId: product._id }) });
    if (res.ok) await syncFavorites();
  };

  const removeFavorite = async (productId: string) => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setFavorites((prev) => prev.filter((p) => p._id !== productId));
      return;
    }

    const res = await apiFetch(`/api/favorites/${productId}`, { method: "DELETE" });
    if (res.ok) await syncFavorites();
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p._id === productId);
  };

  const toggleFavorite = async (product: FavoriteProduct) => {
    if (isFavorite(product._id)) {
      await removeFavorite(product._id);
    } else {
      await addFavorite(product);
    }
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    refreshFavorites: syncFavorites,
  };
}
