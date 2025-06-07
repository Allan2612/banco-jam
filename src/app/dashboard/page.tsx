"use client"

import { useAuthStore } from "@/lib/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, ArrowLeftRight, History, Smartphone } from "lucide-react"

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Bienvenido, {user?.name}</h1>
        <p className="text-gray-300">Gestiona tus finanzas desde tu panel de control</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>Funciones más utilizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 text-left bg-gray-800">
                <CreditCard className="h-6 w-6 text-blue-400 mb-2" />
                <p className="font-medium text-white">Ver Cuentas</p>
                <p className="text-sm text-gray-400">Consultar saldos</p>
              </button>
              <button className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 text-left bg-gray-800">
                <ArrowLeftRight className="h-6 w-6 text-green-400 mb-2" />
                <p className="font-medium text-white">Transferir</p>
                <p className="text-sm text-gray-400">Entre cuentas</p>
              </button>
              <button className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 text-left bg-gray-800">
                <Smartphone className="h-6 w-6 text-purple-400 mb-2" />
                <p className="font-medium text-white">SINPE Móvil</p>
                <p className="text-sm text-gray-400">Por teléfono</p>
              </button>
              <button className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 text-left bg-gray-800">
                <History className="h-6 w-6 text-orange-400 mb-2" />
                <p className="font-medium text-white">Historial</p>
                <p className="text-sm text-gray-400">Ver movimientos</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
