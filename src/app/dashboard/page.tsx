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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total en Cuentas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₡2,450,000</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferencias del Mes</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SINPE Móvil</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Transferencias este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Actividad</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Hoy</div>
            <p className="text-xs text-muted-foreground">Transferencia completada</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Transferencia a Juan Pérez</p>
                  <p className="text-sm text-gray-600">Hoy, 2:30 PM</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-₡50,000</p>
                  <p className="text-sm text-green-600">Completado</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Depósito de salario</p>
                  <p className="text-sm text-gray-600">Ayer, 9:00 AM</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+₡800,000</p>
                  <p className="text-sm text-green-600">Completado</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SINPE Móvil a 8888-9999</p>
                  <p className="text-sm text-gray-600">2 días atrás</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-₡25,000</p>
                  <p className="text-sm text-green-600">Completado</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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
