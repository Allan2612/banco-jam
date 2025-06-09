
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import { Account } from "@/app/models/models"
interface AccountCardProps {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
      <CardHeader>

        <CardTitle className="text-lg text-white">IBAN: {account.iban}</CardTitle>
        <CardDescription className="font-mono text-gray-300">Número de cuenta: {account.number}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Saldo disponible</p>
            <CurrencyDisplay
              amount={account.balance}
              currency={account.currency?.symbol || "$"}
              className="text-2xl font-bold text-green-400"
            />
            <p className="text-sm text-gray-500">{account.currency?.name}</p>
          </div>
          
        </div>
      </CardContent>
    </Card>
  )
}
