import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🍯</div>
          <h1 className="text-4xl font-bold text-white mb-4">Bienvenido a JAM Bank</h1>
          <p className="text-xl text-gray-300 mb-8">Tu sistema bancario SINPE de confianza</p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Link href="/register">Crear Cuenta</Link>
            </Button>

          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
                Cuentas Bancarias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Gestiona todas tus cuentas bancarias desde un solo lugar</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowLeftRight className="h-6 w-6 mr-2 text-green-600" />
                Transferencias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Realiza transferencias rápidas y seguras entre cuentas</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-6 w-6 mr-2 text-purple-600" />
                SINPE Móvil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Transfiere dinero usando solo el número de teléfono</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CreditCard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  )
}

function ArrowLeftRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16l-4-4m0 0l4-4m-4 4h18m-6 8l4-4m0 0l-4-4m4 4H3"
      />
    </svg>
  )
}

function Smartphone({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  )
}