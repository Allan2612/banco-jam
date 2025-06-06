"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "@/lib/stores/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return <>{children}</>
}

// Export a helper hook for backward compatibility
export function useAuthContext() {
  const authState = useAuthStore()
  return authState
}
