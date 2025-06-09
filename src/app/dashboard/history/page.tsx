"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { History, Search, Filter } from "lucide-react"
import { useUserTransfers } from "@/hooks/use-Transactions"
import type { Transfer } from "@/app/models/models"
import { useAuth } from "@/hooks/use-auth"

const StatusBadge = ({ status }: { status: string }) => {
  let color = "gray"
  if (status === "completed") color = "green"
  else if (status === "pending") color = "yellow"
  else if (status === "failed") color = "red"

  return (
    <Badge
      variant="secondary"
      className={`bg-${color}-100 text-${color}-800 dark:bg-${color}-800 dark:text-${color}-100`}
    >
      {status}
    </Badge>
  )
}

export default function HistoryPage() {
  const { transfers, loading, error } = useUserTransfers()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Obtener los IDs de las cuentas del usuario logueado
  const userAccountIds = user?.accounts?.map(acc => acc.accountId) || []

  // Filtro y búsqueda
  const filteredTransactions = useMemo(() => {
    let filtered: Transfer[] = transfers

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.fromId?.includes(searchTerm) ||
          t.toId?.includes(searchTerm)
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    return filtered
  }, [transfers, searchTerm, statusFilter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Historial de Transacciones</h1>
        <p className="text-gray-300">Consulta todas tus transacciones y movimientos</p>
      </div>

      <Card className="mb-6 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar transacciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <History className="h-5 w-5 mr-2" />
            Transacciones
          </CardTitle>
          <CardDescription className="text-gray-300">
            {filteredTransactions.length} transacciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => {
              // Si la cuenta logueada es la de origen, es un envío (rojo y negativo)
              const isOutgoing = userAccountIds.includes(transaction.fromId)
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-white">{transaction.description || "Sin descripción"}</p>
                    </div>
                    <p className="text-sm text-gray-400">{formatDate(transaction.date as string)}</p>
                    <p className="text-xs text-gray-500">Desde: {transaction.from?.iban}</p>
                    <p className="text-xs text-gray-500">Hacia: {transaction.to?.iban}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <CurrencyDisplay
                      amount={isOutgoing ? -transaction.amount : transaction.amount}
                      currency={transaction.currency || "$"}
                      className={`font-medium ${isOutgoing ? "text-red-400" : "text-green-400"}`}
                      showSign
                    />
                    <StatusBadge status={transaction.status} />
                  </div>
                </div>
              )
            })}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No se encontraron transacciones</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}