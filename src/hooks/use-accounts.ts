import { useMemo } from "react"
import { useAuthStore } from "@/app/stores/auth-store"
import type { Account } from "@/app/models/models"

export function useAccounts() {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)
  const fetchUser = useAuthStore((state) => state.fetchUser)

  // Extrae las cuentas directamente del usuario
  const accounts: Account[] = useMemo(() => {
    if (!user?.accounts) return []
    return user.accounts
      .map((ua) => ua.account)
      .filter((acc): acc is Account => !!acc)
  }, [user])

  return {
    accounts,
    loading,
    error,
    refreshAccounts: fetchUser,
  }
}