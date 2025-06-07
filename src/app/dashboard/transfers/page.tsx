"use client"

import { useAccounts } from "@/hooks/use-accounts"
import { TransferForm } from "@/components/transfers/transfer-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function TransfersPage() {
  const { accounts, loading, error, refreshAccounts } = useAccounts()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Transferencias</h1>
        <p className="text-gray-300">Transfiere dinero entre tus cuentas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransferForm accounts={accounts} onSuccess={refreshAccounts} />

        <Card>
          <CardHeader>
            <CardTitle>Mi Cuenta</CardTitle>
            <CardDescription>Saldos disponibles para transferencia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{account.iban}</p>
                      <p className="text-sm text-gray-600 font-mono">{account.number}</p>
                    </div>
                    <div className="text-right">
                      <CurrencyDisplay
                        amount={account.balance}
                        currency={account.currency}
                        className="font-bold text-green-600"
                      />
                      <p className="text-sm text-gray-500">{account.currency?.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {accounts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No tienes cuentas disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
