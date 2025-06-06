"use client"

import type React from "react"

import { useAuthContext } from "@/components/providers/auth-provider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}
