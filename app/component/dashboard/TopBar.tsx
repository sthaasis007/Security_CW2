"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useCart } from "@/app/lib/useCart";

export default function TopBar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { getCartCount } = useCart();

  // Set isLoggedIn only after client-side hydration
  useEffect(() => {
    // Check both cookies and localStorage for token
    const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    setIsLoggedIn(!!token);
    setHydrated(true);
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center text-slate-900 gap-8">
          <Link href="/auth/dashboard" className="text-lg font-bold">
            EverBlue
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-black md:flex">
            <Link href="#" className="hover:underline">For Women</Link>
            <Link href="#" className="hover:underline">For Men</Link>
            <Link href="#" className="hover:underline">New</Link>
            <Link href="#" className="hover:underline">Special Collections</Link>
          </nav>
        </div>

        <div className="flex items-center text-black gap-3 text-sm">
          <button 
            onClick={handleProfileClick}
            className="rounded-md border px-3 py-1.5 hover:bg-slate-50">
            Profile
          </button>
          {hydrated && isLoggedIn && (
            <button 
              onClick={() => {
                Cookies.remove("token");
                Cookies.remove("user");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsLoggedIn(false);
                router.push("/login");
              }}
              className="rounded-md border px-3 py-1.5 hover:bg-slate-50">
              Logout
            </button>
          )}
          <Link href="/favorites" className="rounded-md border px-3 py-1.5 hover:bg-slate-50">
            Favorite
          </Link>
          <Link href="/cart" className="rounded-md border px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2">
            🛒 Cart
            {hydrated && getCartCount() > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
