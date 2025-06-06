"use client"

import type React from "react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const loading = useAuthStore((state) => state.loading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}
