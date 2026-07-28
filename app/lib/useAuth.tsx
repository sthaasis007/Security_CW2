"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "./request";

export function useAuth({ requireAdmin = false, requireLogin = false }: { requireAdmin?: boolean; requireLogin?: boolean }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const user = await getSession();
      if (!active) return;
      if (requireLogin && !user) {
        router.replace("/login");
        return;
      }
      if (requireAdmin && user?.role !== "admin") {
        if (user) {
          router.replace("/");
        } else {
          router.replace("/login");
        }
        return;
      }
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, [requireAdmin, requireLogin, router]);

  return { ready };
}

export default useAuth;
