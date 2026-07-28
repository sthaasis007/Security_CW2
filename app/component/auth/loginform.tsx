"use client";

import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "../../lib/validations/auth.schema";
import { useRouter } from "next/navigation";
import apiFetch, { getSession } from "@/app/lib/request";

import Input from "../ui/input";
import Button from "../ui/button";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaChallenge, setMfaChallenge] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setError(null);
    setLoading(true);
    try {
      // use same-origin API route so cookies set by backend are stored correctly
      const res = await apiFetch(`/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.email, password: data.password }) });

      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        if (body.mfaRequired && body.challengeToken) {
          setMfaChallenge(body.challengeToken);
          return;
        }
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        const sessionUser = await getSession();
        if (!sessionUser) {
          setError("Login succeeded, but the secure session cookie was not accepted. Restart both development servers and try again.");
          return;
        }
        const role = sessionUser.role;

        if (role === "admin") {
          router.push("/admin/users");
        } else {
          router.push("/auth/dashboard");
        }
      } else {
        setError(body?.message || `Login failed (status ${res.status})`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const verifyMfa = async (event: FormEvent) => {
    event.preventDefault();
    if (!mfaChallenge) return;
    setError(null);
    setLoading(true);
    try {
      const response = await apiFetch("/api/auth/mfa/login/verify", {
        method: "POST",
        body: JSON.stringify({ challengeToken: mfaChallenge, code: mfaCode }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.message || "Invalid security code");
        return;
      }
      const user = await getSession();
      if (!user) {
        setError("MFA succeeded, but the secure session could not be created.");
        return;
      }
      router.push(user.role === "admin" ? "/admin/users" : "/auth/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (mfaChallenge) {
    return (
      <form onSubmit={verifyMfa} className="space-y-4">
        {error && <div className="text-sm text-red-600">{error}</div>}
        <p className="text-sm text-slate-600">
          Enter the six-digit code sent to your email, or use one recovery code.
        </p>
        <Input
          label="Security code"
          value={mfaCode}
          onChange={(event) => setMfaCode(event.target.value)}
          autoComplete="one-time-code"
          inputMode="numeric"
        />
        <Button type="submit" disabled={loading || mfaCode.trim().length < 6}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
        <button type="button" className="text-sm text-blue-600" onClick={() => {
          setMfaChallenge(null);
          setMfaCode("");
        }}>
          Back to login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}

      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />

      <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
      <p className="text-center text-sm">
        <a href="/forgot-password" className="font-medium text-blue-600 hover:underline">Forgot password?</a>
        {" · "}
        <a href="/verify-email" className="font-medium text-blue-600 hover:underline">Resend verification</a>
      </p>
      <p className="text-center text-sm text-slate-600">
        Don’t have an account?{" "}
        <a href="/register" className="font-medium text-blue-600 hover:underline">
            Register
        </a>
        </p>

    </form>
  );
}
