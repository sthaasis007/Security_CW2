"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useAuth from "../../../lib/useAuth";

export default function AdminUserView() {
  const { id } = useParams() as { id: string };
  const { ready } = useAuth({ requireAdmin: true, requireLogin: true });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!ready) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [ready, id]);

  return (
    <div style={{ padding: 24, backgroundColor: "#fff", color: "#000", minHeight: "100vh" }}>
      <h1 style={{ color: "#000" }}>User {id}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
