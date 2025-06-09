"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "@/app/stores/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useAuthContext() {
  return useAuthStore()
}
