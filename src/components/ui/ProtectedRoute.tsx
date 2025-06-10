"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si no está cargando y se requiere autenticación pero no está autenticado
    if (!loading && requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
      router.push(redirectUrl)
    }
    
    // Si no está cargando y NO se requiere autenticación pero SÍ está autenticado
    if (!loading && !requireAuth && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, loading, requireAuth, redirectTo, router])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-4xl mb-2">🍯</div>
          <div className="text-white">Cargando...</div>
        </div>
      </div>
    )
  }

  // Si se requiere auth y no está autenticado, no mostrar nada (se redirige)
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Si NO se requiere auth y está autenticado, no mostrar nada (se redirige)
  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}

// Hook personalizado para proteger páginas específicas
export function useProtectedRoute(requireAuth = true) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        const currentPath = window.location.pathname
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
      } else if (!requireAuth && isAuthenticated) {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, loading, requireAuth, router])

  return { isAuthenticated, loading }
}