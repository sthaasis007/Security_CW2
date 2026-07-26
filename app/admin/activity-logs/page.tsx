"use client";
import { useEffect, useState } from "react";
import useAuth from "../../lib/useAuth";
import AdminLayout from "../../component/admin/AdminLayout";
import ActivityLog from "../../component/admin/ActivityLog";

export default function ActivityLogsPage() {
  const { ready } = useAuth({ requireAdmin: true, requireLogin: true });

  useEffect(() => {
    if (!ready) return;
  }, [ready]);

  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <AdminLayout currentPage="Activity Logs">
      <ActivityLog />
    </AdminLayout>
  );
}
