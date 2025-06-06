"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { History, Search, Filter } from "lucide-react"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "transfer" | "sinpe" | "deposit" | "withdrawal"
  status: "completed" | "pending" | "failed"
  fromAccount?: string
  toAccount?: string
  currency: string
}

const StatusBadge = ({ status }: { status: string }) => {
  let color = "gray"
  if (status === "completed") {
    color = "green"
  } else if (status === "pending") {
    color = "yellow"
  } else if (status === "failed") {
    color = "red"
  }

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
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        setTransactions(data.transactions || [])
      } catch (error) {
        console.error("Error fetching transactions:", error)
        const mockTransactions = [
          {
            id: "1",
            date: "2024-01-15T14:30:00Z",
            description: "Transferencia a Juan Pérez",
            amount: -50000,
            type: "transfer" as const,
            status: "completed" as const,
            fromAccount: "001-234567-89",
            toAccount: "001-987654-32",
            currency: "CRC",
          },
          {
            id: "2",
            date: "2024-01-14T09:15:00Z",
            description: "SINPE Móvil a 8888-9999",
            amount: -25000,
            type: "sinpe" as const,
            status: "completed" as const,
            fromAccount: "001-234567-89",
            currency: "CRC",
          },
          {
            id: "3",
            date: "2024-01-13T16:45:00Z",
            description: "Depósito de salario",
            amount: 800000,
            type: "deposit" as const,
            status: "completed" as const,
            toAccount: "001-234567-89",
            currency: "CRC",
          },
          {
            id: "4",
            date: "2024-01-12T11:20:00Z",
            description: "Transferencia pendiente",
            amount: -75000,
            type: "transfer" as const,
            status: "pending" as const,
            fromAccount: "001-234567-89",
            toAccount: "001-987654-32",
            currency: "CRC",
          },
          {
            id: "5",
            date: "2024-01-11T08:30:00Z",
            description: "SINPE Móvil fallido",
            amount: -30000,
            type: "sinpe" as const,
            status: "failed" as const,
            fromAccount: "001-234567-89",
            currency: "CRC",
          },
        ]
        setTransactions(mockTransactions)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  useEffect(() => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.fromAccount?.includes(searchTerm) ||
          transaction.toAccount?.includes(searchTerm),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === typeFilter)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, statusFilter, typeFilter])

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "transfer":
        return "Transferencia"
      case "sinpe":
        return "SINPE Móvil"
      case "deposit":
        return "Depósito"
      case "withdrawal":
        return "Retiro"
      default:
        return type
    }
  }

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                  <SelectItem value="sinpe">SINPE Móvil</SelectItem>
                  <SelectItem value="deposit">Depósito</SelectItem>
                  <SelectItem value="withdrawal">Retiro</SelectItem>
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
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-white">{transaction.description}</p>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {getTypeLabel(transaction.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">{formatDate(transaction.date)}</p>
                  {transaction.fromAccount && <p className="text-xs text-gray-500">Desde: {transaction.fromAccount}</p>}
                  {transaction.toAccount && <p className="text-xs text-gray-500">Hacia: {transaction.toAccount}</p>}
                </div>
                <div className="text-right space-y-1">
                  <CurrencyDisplay
                    amount={transaction.amount}
                    currency={transaction.currency}
                    className={`font-medium ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}
                    showSign
                  />
                  <StatusBadge status={transaction.status} />
                </div>
              </div>
            ))}
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
