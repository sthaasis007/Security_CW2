import { useState, useEffect } from "react";

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

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoading]);

  const addFavorite = (product: FavoriteProduct) => {
    setFavorites((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((p) => p._id !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p._id === productId);
  };

  const toggleFavorite = (product: FavoriteProduct) => {
    if (isFavorite(product._id)) {
      removeFavorite(product._id);
    } else {
      addFavorite(product);
    }
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}
