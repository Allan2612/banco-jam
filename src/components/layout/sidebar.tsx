"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CreditCard, ArrowLeftRight, History, Smartphone, Home } from "lucide-react"

const navigation = [
  { name: "Panel Principal", href: "/dashboard", icon: Home },
  { name: "Mis Cuentas", href: "/dashboard/accounts", icon: CreditCard },
  { name: "Transferencias", href: "/dashboard/transfers", icon: ArrowLeftRight },
  { name: "Historial", href: "/dashboard/history", icon: History },
  { name: "SINPE Móvil", href: "/dashboard/sinpe-mobile", icon: Smartphone },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
