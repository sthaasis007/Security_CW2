"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "../../lib/validations/auth.schema";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import Input from "../ui/input";
import Button from "../ui/button";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        // save token and user data in cookies
        if (body.token) {
          Cookies.set("token", body.token, { expires: 1 }); // expires in 1 day
        }
        if (body.user) {
          Cookies.set("user", JSON.stringify(body.user), { expires: 1 });
        }
        // also set localStorage so client-side hooks can read token/user
        try {
          if (body.token) localStorage.setItem("token", body.token);
          if (body.user) localStorage.setItem("user", JSON.stringify(body.user));
        } catch (e) {
          // ignore (SSR or disabled storage)
        }

        // redirect based on role
        const role = body?.user?.role;
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

      <div className="text-right text-sm">
        <a href="/forgot-password" className="font-medium text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>

      <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
      <p className="text-center text-sm text-slate-600">
        Don’t have an account?{" "}
        <a href="/register" className="font-medium text-blue-600 hover:underline">
            Register
        </a>
        </p>

    </form>
  );
}
