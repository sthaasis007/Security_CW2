import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  _id: string;
  productId?: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  quantity: number;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const syncCart = useCallback(async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      // Load guest cart from localStorage when not authenticated
      try {
        const raw = localStorage.getItem("guest_cart");
        const parsed = raw ? JSON.parse(raw) : [];
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Failed to parse guest cart from localStorage", e);
        setCartItems([]);
      }
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.error("Failed to fetch cart:", res.status, text);
        setCartItems([]);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      const items = (data.cart?.items || []).map((item: any) => ({
        _id: item.productId?._id || item.productId,
        productId: item.productId?._id || item.productId,
        name: item.productName || item.productId?.name || "Product",
        price: item.priceSnapshot || item.productPrice || 0,
        description: item.productDescription,
        image: item.productImage,
        quantity: item.quantity,
      }));
      setCartItems(items);
    } catch (error) {
      console.error("Failed to load cart", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void syncCart();
  }, [syncCart]);

  const addToCart = async (product: Omit<CartItem, "quantity">) => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems((prev) => {
        const existing = prev.find((item) => item._id === product._id);
        let next;
        if (existing) {
          next = prev.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
        } else {
          next = [...prev, { ...product, quantity: 1 }];
        }
        try { localStorage.setItem("guest_cart", JSON.stringify(next)); } catch (e) { console.error('Failed to save guest cart', e); }
        return next;
      });
      return;
    }

    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId: product.productId || product._id, quantity: 1 }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(data.message || "Failed to add item to cart");
      return;
    }
    await syncCart();
  };

  const removeFromCart = async (productId: string) => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems((prev) => {
        const next = prev.filter((item) => item._id !== productId);
        try { localStorage.setItem("guest_cart", JSON.stringify(next)); } catch (e) { console.error('Failed to save guest cart', e); }
        return next;
      });
      return;
    }

    const res = await fetch(`/api/cart/remove/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      await syncCart();
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems((prev) => {
        const next = prev.map((item) => item._id === productId ? { ...item, quantity } : item);
        try { localStorage.setItem("guest_cart", JSON.stringify(next)); } catch (e) { console.error('Failed to save guest cart', e); }
        return next;
      });
      return;
    }

    const res = await fetch(`/api/cart/update/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      await syncCart();
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems([]);
      try { localStorage.removeItem("guest_cart"); } catch (e) { console.error('Failed to clear guest cart', e); }
      return;
    }
    const res = await fetch("/api/cart/clear", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      await syncCart();
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    clearCart,
    getCartCount,
    refreshCart: syncCart,
  };
}
