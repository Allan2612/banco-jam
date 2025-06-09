"use client"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/app/stores/auth-store"
import { LogOut } from "lucide-react"
import Link from "next/link"
export function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl">🍯</div>
          <div>
            <h1 className="text-xl font-bold text-white">JAM Bank</h1>
            <p className="text-sm text-gray-300">Sistema SINPE</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-300">{user.email}</p>
            </div>
            
            <Link href="/"><Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button></Link>
          </div>
        )}
      </div>
    </header>
  )
}
