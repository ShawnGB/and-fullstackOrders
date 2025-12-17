"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "@/actions/auth";
import { LoginCredentials } from "@/types/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setError(null);
    const result = await login(data);

    if (result.success && result.data) {
      setUser(result.data);
      const from = searchParams.get("from") || "/";
      router.push(from);
      router.refresh();
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="error">{error}</div>}

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      <p>
        Don't have an account? <Link href="/auth/register">Register</Link>
      </p>
    </form>
  );
}
