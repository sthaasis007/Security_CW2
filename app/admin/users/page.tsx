"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../../lib/useAuth";
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
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Response:", data);
      if (data.users) {
        setUsers(data.users);
      } else {
        console.error("No users in response:", data);
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
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

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
