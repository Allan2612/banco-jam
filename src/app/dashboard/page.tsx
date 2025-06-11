"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, ArrowLeftRight, History, Smartphone } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading, fetchUser } = useAuth()

  useEffect(() => {
    // Solo llama a fetchUser si user existe pero no tiene cuentas cargadas
    if (user && user.accounts && user.accounts.length > 0 && user.accounts[0].account?.currency) {
      // Ya está todo cargado, no hagas nada
      return
    }
    // Si no hay usuario o no tiene cuentas cargadas, haz fetch
    if (user) {
      fetchUser()
    }
  }, [user]) // Solo depende de user

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-white">Cargando usuario...</span>
      </div>
    )
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-white">Cargando usuario...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 ">
        <h1 className="text-3xl font-bold text-white">Bienvenido, {user.name}</h1>
        <p className="text-gray-300">Gestiona tus finanzas desde tu panel de control</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>Funciones más utilizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-10">
              <Link href="/dashboard/accounts">
                <button className=" w-full h-40 flex flex-col justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-800 text-left bg-gray-800">
                  <CreditCard className="h-6 w-6 text-blue-400 mb-2" />
                  <p className="font-medium text-white">Ver Cuentas</p>
                  <p className="text-sm text-gray-400">Consultar saldos</p>
                </button>
              </Link> 
              <Link href="/dashboard/transfers">
              <button className="w-full h-40 flex flex-col justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-800 text-left bg-gray-800">
                <ArrowLeftRight className="h-6 w-6 text-green-400 mb-2" />
                <p className="font-medium text-white">Transferir</p>
                <p className="text-sm text-gray-400">Entre cuentas</p>
              </button></Link>
              <Link href="/dashboard/sinpe-mobile">
              <button className=" w-full h-40 flex flex-col justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-800 text-left bg-gray-800">
              
                <Smartphone className="h-6 w-6 text-purple-400 mb-2" />
                <p className="font-medium text-white">SINPE Móvil</p>
                <p className="text-sm text-gray-400">Por teléfono</p>
              </button>
              </Link>
              <Link href="/dashboard/history">
              <button className=" w-full h-40 flex flex-col justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-800 text-left bg-gray-800">
               
                <History className="h-6 w-6 text-orange-400 mb-2" />
                <p className="font-medium text-white">Historial</p>
                <p className="text-sm text-gray-400">Ver movimientos</p>
              </button> 
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}