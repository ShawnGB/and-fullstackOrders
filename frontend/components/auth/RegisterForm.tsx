"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { register as registerUser } from "@/actions/auth";
import { RegisterData } from "@/types/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    setError(null);
    const result = await registerUser(data);

    if (result.success && result.data) {
      setUser(result.data);
      router.push("/");
      router.refresh();
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="error">{error}</div>}

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

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
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </button>

      <p>
        Already have an account? <Link href="/auth/login">Login</Link>
      </p>
    </form>
  );
}
