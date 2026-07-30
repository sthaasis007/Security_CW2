"use client";
import React from "react";
import { useParams } from "next/navigation";
import useAuth from "../../../../lib/useAuth";
import AdminLayout from "../../../../component/admin/AdminLayout";
import EditUserForm from "../../../../component/admin/EditUserForm";

export default function AdminUserEdit() {
  const { id } = useParams() as { id: string };
  const { ready } = useAuth({ requireAdmin: true, requireLogin: true });

  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <AdminLayout currentPage="Users">
      <EditUserForm userId={id} />
    </AdminLayout>
  );
}
