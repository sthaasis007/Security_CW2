"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthLayout from "../component/auth/authlayout";
import Input from "../component/ui/input";
import Button from "../component/ui/button";
import apiFetch from "../lib/request";

function ResetForm() {
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = useMemo(() => [
    password.length >= 12, /[A-Z]/.test(password), /[a-z]/.test(password),
    /\d/.test(password), /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length, [password]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) return setMessage("Passwords do not match.");
    setLoading(true);
    const response = await apiFetch("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) });
    const body = await response.json().catch(() => ({}));
    setMessage(body.message || "Unable to reset password.");
    setLoading(false);
  };

  return <form onSubmit={submit} className="space-y-4">
    {message && <p className="text-sm text-slate-700">{message}</p>}
    <Input label="New password" type="password" required value={password} onChange={event => setPassword(event.target.value)} />
    <div className="h-2 rounded bg-gray-200"><div className="h-2 rounded bg-blue-600" style={{ width: `${strength * 20}%` }} /></div>
    <p className="text-xs text-slate-600">Use 12+ characters with uppercase, lowercase, a number, and a symbol.</p>
    <Input label="Confirm password" type="password" required value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
    <Button type="submit" disabled={loading || !token || strength < 5}>{loading ? "Resetting..." : "Reset password"}</Button>
  </form>;
}

export default function ResetPasswordPage() {
  return <AuthLayout title="Choose a new password"><Suspense fallback={<p>Loading…</p>}><ResetForm /></Suspense></AuthLayout>;
}
