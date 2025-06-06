"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, CreditCard, ArrowLeftRight, Download } from "lucide-react"
import { useAccountDetail } from "@/hooks/use-accounts"

export default function AccountDetailPage() {
  const params = useParams()
  const { account, loading, error } = useAccountDetail(params.id as string)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white">Cuenta no encontrada</h2>
        <Link href="/dashboard/accounts">
          <Button className="mt-4">Volver a Cuentas</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/accounts">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Cuentas
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">Detalle de Cuenta</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle>{account.type}</CardTitle>
                  <CardDescription className="font-mono">{account.number}</CardDescription>
                </div>
              </div>
              <StatusBadge status={account.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Saldo disponible</p>
                <CurrencyDisplay
                  amount={account.balance}
                  currency={account.currency}
                  className="text-3xl font-bold text-green-600"
                />
                <p className="text-sm text-gray-500">{account.currency}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard/transfers">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Nueva Transferencia
              </Link>
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Descargar Estado
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movimientos Recientes</CardTitle>
          <CardDescription>Últimas transacciones de esta cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {account.transactions?.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <div className="text-right space-y-1">
                  <CurrencyDisplay
                    amount={transaction.amount}
                    currency={account.currency}
                    className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                    showSign
                  />
                  <StatusBadge status={transaction.status} />
                </div>
              </div>
            ))}
          </div>

          {(!account.transactions || account.transactions.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay transacciones recientes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
