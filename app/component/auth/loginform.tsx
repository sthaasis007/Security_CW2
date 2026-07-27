"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "../../lib/validations/auth.schema";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import apiFetch from "@/app/lib/request";

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
      // use same-origin API route so cookies set by backend are stored correctly
      const res = await apiFetch(`/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.email, password: data.password }) });

      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        const token = body.token || body.accessToken;
        const refreshToken = body.refreshToken;

        // save token and user data in cookies
        if (token) {
          Cookies.set("token", token, { expires: 1 }); // expires in 1 day
        }
        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, { expires: 7 });
        }
        if (body.user) {
          Cookies.set("user", JSON.stringify(body.user), { expires: 1 });
        }

        // also set localStorage so client-side hooks can read token/user
        try {
          if (token) localStorage.setItem("token", token);
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
          if (body.user) localStorage.setItem("user", JSON.stringify(body.user));
        } catch (e) {
          // ignore (SSR or disabled storage)
        }

        const role = body?.user?.role || (() => {
          if (!token) return undefined;
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload?.role;
          } catch {
            return undefined;
          }
        })();

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
