"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthLayout from "../component/auth/authlayout";
import Input from "../component/ui/input";
import Button from "../component/ui/button";
import apiFetch from "../lib/request";

function VerificationForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const registered = params.get("registered") === "1";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(token
    ? "Verifying…"
    : registered
      ? "Registration received. Check your inbox and spam folder for the verification link."
      : "Enter your email to request a new verification link.");

  useEffect(() => {
    if (!token) return;
    void apiFetch("/api/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) })
      .then(async response => ({ response, body: await response.json().catch(() => ({})) }))
      .then(({ body }) => setMessage(body.message || "Unable to verify email."));
  }, [token]);

  const resend = async (event: FormEvent) => {
    event.preventDefault();
    const response = await apiFetch("/api/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) });
    const body = await response.json().catch(() => ({}));
    setMessage(body.message || "If the address is eligible, an email will be sent shortly.");
  };

  return <div className="space-y-4">
    <p className="text-sm text-slate-700">{message}</p>
    {!token && <form onSubmit={resend} className="space-y-4">
      <Input label="Account email" type="email" required value={email} onChange={event => setEmail(event.target.value)} />
      <Button type="submit">Send verification link</Button>
    </form>}
    <p className="text-center text-sm"><a className="text-blue-600 hover:underline" href="/login">Go to login</a></p>
  </div>;
}

export default function VerifyEmailPage() {
  return <AuthLayout title="Verify email"><Suspense fallback={<p>Loading…</p>}><VerificationForm /></Suspense></AuthLayout>;
}
