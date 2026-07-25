"use client";
import React from "react";
import useAuth from "../../lib/useAuth";
import AdminLayout from "../../component/admin/AdminLayout";
import ProductManagement from "../../component/admin/ProductManagement";

export default function AdminProductsPage() {
  const { ready } = useAuth({ requireAdmin: true, requireLogin: true });

  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <AdminLayout currentPage="Products">
      <ProductManagement />
    </AdminLayout>
  );
}
