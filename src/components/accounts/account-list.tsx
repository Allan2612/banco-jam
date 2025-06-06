import { AccountCard } from "./account-card"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import type { Account } from "@/lib/services/accounts.service"

interface AccountListProps {
  accounts: Account[]
}

export function AccountList({ accounts }: AccountListProps) {
  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes cuentas registradas</h3>
          <p className="text-gray-600">Contacta a tu banco para abrir una nueva cuenta</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}
