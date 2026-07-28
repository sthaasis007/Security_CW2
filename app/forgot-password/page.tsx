"use client";

import { FormEvent, useState } from "react";
import AuthLayout from "../component/auth/authlayout";
import Input from "../component/ui/input";
import Button from "../component/ui/button";
import apiFetch from "../lib/request";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const response = await apiFetch("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
    const body = await response.json().catch(() => ({}));
    setMessage(body.message || "If the address is eligible, an email will be sent shortly.");
    setLoading(false);
  };

  return <AuthLayout title="Reset password">
    <form onSubmit={submit} className="space-y-4">
      {message && <p className="text-sm text-slate-700">{message}</p>}
      <Input label="Account email" type="email" required value={email} onChange={event => setEmail(event.target.value)} />
      <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</Button>
      <p className="text-center text-sm"><a className="text-blue-600 hover:underline" href="/login">Back to login</a></p>
    </form>
  </AuthLayout>;
}
