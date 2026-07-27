"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../../lib/useAuth";
import apiFetch from "@/app/lib/request";
import AdminLayout from "../../component/admin/AdminLayout";
import UserManagement from "../../component/admin/UserManagement";

export default function AdminUsersPage() {
  const { ready } = useAuth({ requireAdmin: true, requireLogin: true });
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found");
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/admin/users");
      const data = await res.json().catch(() => ({}));
      const normalizedUsers = Array.isArray(data?.users) ? data.users : [];
      setUsers(normalizedUsers);
      if (!Array.isArray(data?.users)) {
        console.warn("No users array returned by admin endpoint:", data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found");
      return;
    }

    try {
      const res = await apiFetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        alert("User deleted successfully");
        fetchUsers();
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting user");
    }
  };

  useEffect(() => {
    if (!ready) return;
    fetchUsers();
  }, [ready]);

  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <AdminLayout currentPage="Users">
      <UserManagement users={users} onRefresh={fetchUsers} onDelete={handleDeleteUser} isLoading={isLoading} />
    </AdminLayout>
  );
}
