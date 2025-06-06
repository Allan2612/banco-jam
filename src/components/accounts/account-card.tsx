import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import { StatusBadge } from "@/components/ui/status-badge"
import { CreditCard, Eye } from "lucide-react"
import type { Account } from "@/lib/services/accounts.service"

interface AccountCardProps {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CreditCard className="h-8 w-8 text-blue-600" />
          <StatusBadge status={account.status} />
        </div>
        <CardTitle className="text-lg">{account.type}</CardTitle>
        <CardDescription className="font-mono">{account.number}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Saldo disponible</p>
            <CurrencyDisplay
              amount={account.balance}
              currency={account.currency}
              className="text-2xl font-bold text-green-600"
            />
            <p className="text-sm text-gray-500">{account.currency}</p>
          </div>
          <Button asChild className="w-full">
            <Link href={`/dashboard/accounts/${account.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalles
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
