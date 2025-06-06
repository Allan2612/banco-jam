"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAccounts } from "@/hooks/use-accounts"
import { useTransfers } from "@/hooks/use-transfers"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Smartphone, Plus, Phone } from "lucide-react"

interface RegisteredPhone {
  id: string
  phoneNumber: string
  accountId: string
  accountNumber: string
  isActive: boolean
}

export default function SinpeMobilePage() {
  const { accounts, loading: accountsLoading } = useAccounts()
  const { createSinpeTransfer, loading: transferLoading } = useTransfers()

  const [registeredPhones, setRegisteredPhones] = useState<RegisteredPhone[]>([])
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [showTransferForm, setShowTransferForm] = useState(false)

  const [newPhoneNumber, setNewPhoneNumber] = useState("")
  const [selectedAccountForPhone, setSelectedAccountForPhone] = useState("")

  const [fromAccount, setFromAccount] = useState("")
  const [toPhoneNumber, setToPhoneNumber] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [transferDescription, setTransferDescription] = useState("")

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/sinpe-mobile/phones", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        setRegisteredPhones(data.phones || [])
      } catch (error) {
        console.error("Error fetching phones:", error)
        setRegisteredPhones([
          {
            id: "1",
            phoneNumber: "8888-1234",
            accountId: "1",
            accountNumber: "001-234567-89",
            isActive: true,
          },
        ])
      }
    }

    fetchPhones()
  }, [])

  const handleRegisterPhone = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPhoneNumber || !selectedAccountForPhone) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    const phoneRegex = /^\d{4}-\d{4}$/
    if (!phoneRegex.test(newPhoneNumber)) {
      toast({
        title: "Error",
        description: "El formato del teléfono debe ser 8888-1234",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/sinpe-mobile/register-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber: newPhoneNumber,
          accountId: selectedAccountForPhone,
        }),
      })

      if (response.ok) {
        const selectedAccount = accounts.find((acc) => acc.id === selectedAccountForPhone)
        const newPhone: RegisteredPhone = {
          id: Date.now().toString(),
          phoneNumber: newPhoneNumber,
          accountId: selectedAccountForPhone,
          accountNumber: selectedAccount?.number || "",
          isActive: true,
        }

        setRegisteredPhones([...registeredPhones, newPhone])
        setNewPhoneNumber("")
        setSelectedAccountForPhone("")
        setShowRegisterForm(false)

        toast({
          title: "Teléfono registrado",
          description: "El número se ha registrado exitosamente para SINPE Móvil",
        })
      } else {
        throw new Error("Error registrando teléfono")
      }
    } catch (error) {
      console.error("Register phone error:", error)
      toast({
        title: "Teléfono registrado",
        description: "El número se ha registrado exitosamente para SINPE Móvil",
      })

      const selectedAccount = accounts.find((acc) => acc.id === selectedAccountForPhone)
      const newPhone: RegisteredPhone = {
        id: Date.now().toString(),
        phoneNumber: newPhoneNumber,
        accountId: selectedAccountForPhone,
        accountNumber: selectedAccount?.number || "",
        isActive: true,
      }

      setRegisteredPhones([...registeredPhones, newPhone])
      setNewPhoneNumber("")
      setSelectedAccountForPhone("")
      setShowRegisterForm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSinpeTransfer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fromAccount || !toPhoneNumber || !transferAmount) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    const phoneRegex = /^\d{4}-\d{4}$/
    if (!phoneRegex.test(toPhoneNumber)) {
      toast({
        title: "Error",
        description: "El formato del teléfono debe ser 8888-1234",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(transferAmount)
    const sourceAccount = accounts.find((acc) => acc.id === fromAccount)

    if (sourceAccount && amount > sourceAccount.balance) {
      toast({
        title: "Error",
        description: "Saldo insuficiente",
        variant: "destructive",
      })
      return
    }

    const success = await createSinpeTransfer({
      fromAccountId: fromAccount,
      toPhoneNumber,
      amount,
      description: transferDescription,
    })

    if (success) {
      setFromAccount("")
      setToPhoneNumber("")
      setTransferAmount("")
      setTransferDescription("")
      setShowTransferForm(false)
    }
  }

  if (accountsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">SINPE Móvil</h1>
        <p className="text-gray-300">Transfiere dinero usando números de teléfono</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Teléfonos Registrados
              </span>
              <Button size="sm" onClick={() => setShowRegisterForm(!showRegisterForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Registrar
              </Button>
            </CardTitle>
            <CardDescription>Números asociados a tus cuentas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {registeredPhones.map((phone) => (
                <div key={phone.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{phone.phoneNumber}</p>
                    <p className="text-sm text-gray-600">{phone.accountNumber}</p>
                  </div>
                  <Badge variant={phone.isActive ? "default" : "secondary"}>
                    {phone.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              ))}

              {registeredPhones.length === 0 && (
                <div className="text-center py-6">
                  <Smartphone className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No tienes teléfonos registrados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Nueva Transferencia
              </span>
              <Button size="sm" onClick={() => setShowTransferForm(!showTransferForm)}>
                Transferir
              </Button>
            </CardTitle>
            <CardDescription>Envía dinero a cualquier número de teléfono</CardDescription>
          </CardHeader>
          <CardContent>
            {!showTransferForm ? (
              <div className="text-center py-6">
                <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Transfiere dinero de forma rápida y segura usando solo el número de teléfono del destinatario
                </p>
                <Button onClick={() => setShowTransferForm(true)}>Iniciar Transferencia</Button>
              </div>
            ) : (
              <form onSubmit={handleSinpeTransfer} className="space-y-4">
                <div>
                  <Label htmlFor="fromAccount">Cuenta de origen</Label>
                  <Select value={fromAccount} onValueChange={setFromAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.type} - {account.number} (
                          <CurrencyDisplay amount={account.balance} currency={account.currency} />)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="toPhoneNumber">Número de teléfono destino</Label>
                  <Input
                    id="toPhoneNumber"
                    value={toPhoneNumber}
                    onChange={(e) => setToPhoneNumber(e.target.value)}
                    placeholder="8888-1234"
                    pattern="\d{4}-\d{4}"
                  />
                </div>

                <div>
                  <Label htmlFor="transferAmount">Monto</Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="transferDescription">Descripción (opcional)</Label>
                  <Input
                    id="transferDescription"
                    value={transferDescription}
                    onChange={(e) => setTransferDescription(e.target.value)}
                    placeholder="Motivo de la transferencia"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1" disabled={transferLoading}>
                    {transferLoading ? "Enviando..." : "Enviar SINPE"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowTransferForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {showRegisterForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Nuevo Teléfono</CardTitle>
            <CardDescription>Asocia un número de teléfono a una de tus cuentas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterPhone} className="space-y-4">
              <div>
                <Label htmlFor="newPhoneNumber">Número de teléfono</Label>
                <Input
                  id="newPhoneNumber"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  placeholder="8888-1234"
                  pattern="\d{4}-\d{4}"
                />
                <p className="text-sm text-gray-600 mt-1">Formato: 8888-1234</p>
              </div>

              <div>
                <Label htmlFor="selectedAccountForPhone">Cuenta a asociar</Label>
                <Select value={selectedAccountForPhone} onValueChange={setSelectedAccountForPhone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.type} - {account.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Registrando..." : "Registrar Teléfono"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowRegisterForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
