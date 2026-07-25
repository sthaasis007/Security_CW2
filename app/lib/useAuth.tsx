"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth({ requireAdmin = false, requireLogin = false }: { requireAdmin?: boolean; requireLogin?: boolean }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (requireLogin && !token) {
      router.replace("/login");
      return;
    }

    if (requireAdmin && token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role !== "admin") {
          router.replace("/");
          return;
        }
      } catch (e) {
        router.replace("/login");
        return;
      }
    }

    setReady(true);
  }, [requireAdmin, requireLogin, router]);

  return { ready };
}

export default useAuth;
