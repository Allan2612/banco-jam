import { useAuthStore } from "@/lib/stores/auth-store"
import { useEffect, useState } from "react"
import { getAccountById } from "@/app/services/accountService"
import type { Account } from "@/app/models/models"

export function useAccounts() {
  const user = useAuthStore((state) => state.user)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user?.accounts || user.accounts.length === 0) {
        setAccounts([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        // Trae todas las cuentas asociadas al usuario
        const promises = user.accounts.map(async (ua) => {
          // Si ya tienes la cuenta cargada en ua.account, úsala directamente
          if (ua.account) return ua.account
          // Si no, haz fetch por id
          return await getAccountById(ua.accountId)
        })
        const results = await Promise.all(promises)
        setAccounts(results.filter(Boolean))
      } catch (err) {
        setError("Error al cargar las cuentas")
        setAccounts([])
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [user])

  return {
    accounts,
    loading,
    error,
    refreshAccounts: () => {}, // puedes implementar si necesitas refrescar
  }
}