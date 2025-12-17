"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getCurrentUser } from "@/actions/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Hydrate auth state on mount
    getCurrentUser().then((user) => {
      setUser(user);
    });
  }, [setUser]);

  return <>{children}</>;
}
