"use client"

import { useAccounts } from "@/hooks/use-accounts"
import { AccountList } from "@/components/accounts/account-list"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuthStore } from "@/lib/stores/auth-store"

export default function AccountsPage() {
  const { accounts, loading, error } = useAccounts()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Mi Cuenta</h1>
        <p className="text-gray-300">Gestiona tu cuenta bancaria</p>
      </div>

      <AccountList accounts={accounts} />
    </div>
  )
}
