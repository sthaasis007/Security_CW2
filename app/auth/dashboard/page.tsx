"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "../../lib/request";
import TopBar from "../../component/dashboard/TopBar";
import Hero from "../../component/dashboard/hero";
import CircleCarousel from "../../component/dashboard/CircleCarusel";
import ProductRow from "../../component/dashboard/ProductRow";
import Footer from "../../component/dashboard/Footer";

export default function DashboardPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    void getSession().then((user) => {
      if (!user) router.push("/login");
      else setIsChecking(false);
    });
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <Hero />
      <CircleCarousel />
      <ProductRow />
      <Footer />
    </div>
  );
}
