"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordSchema } from "../../lib/validations/auth.schema";

import Input from "../ui/input";
import Button from "../ui/button";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setError(null);
    setSuccess(null);
    setResetLink(null);
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setSuccess(body?.message || "If an account exists, a reset link has been sent.");
        if (body?.resetLink) {
          setResetLink(body.resetLink);
        }
      } else {
        setError(body?.message || `Request failed (status ${res.status})`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}
      {resetLink && (
        <div className="text-sm">
          <a href={resetLink} className="font-medium text-blue-600 hover:underline">
            Open reset link
          </a>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Remembered your password?{" "}
        <a href="/login" className="font-medium text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
