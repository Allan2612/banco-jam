"use client";

import { useState } from "react";
import { generarHmac } from "@/lib/hmac";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAccounts } from "@/hooks/use-accounts";
import { useTransfers } from "@/hooks/use-transfers";
import { useAuthStore } from "@/app/stores/auth-store";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Smartphone, Phone } from "lucide-react";

export default function SinpeMobilePage() {
  const { accounts, loading: accountsLoading } = useAccounts();
  const { createSinpeTransfer, loading: transferLoading } = useTransfers();
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [showTransferForm, setShowTransferForm] = useState(false);
  const [fromAccount, setFromAccount] = useState("");
  const [toPhoneNumber, setToPhoneNumber] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDescription, setTransferDescription] = useState("");

  if (accountsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Solo cuentas con teléfono registrado
  const accountsWithPhone = (accounts ?? []).filter((acc) => !!acc.phone);

  const handleSinpeTransfer = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!fromAccount || !toPhoneNumber || !transferAmount) {
    toast.error("Todos los campos son obligatorios");
    return;
  }

  const amount = Number.parseFloat(transferAmount);
  if (isNaN(amount) || amount <= 0) {
    toast.error("El monto debe ser mayor a cero");
    return;
  }

  const sourceAccount = accounts?.find((acc) => acc.id === fromAccount);

  if (sourceAccount && amount > sourceAccount.balance) {
    toast.error("Saldo insuficiente");
    return;
  }

  const status = "completed";
  const transactionId = crypto.randomUUID();
  const currency = sourceAccount?.currency?.symbol || "$";
 const hmacData = `${fromAccount}|${toPhoneNumber}|${amount}|${transferDescription || ""}`;
  const hmacHash = generarHmac(hmacData);

  const success = await createSinpeTransfer({
    fromId: fromAccount,
    toPhoneNumber,
    amount,
    status,
    transactionId,
    currency,
    hmacHash,
    description: transferDescription,
  });

  if (success) {
    setFromAccount("");
    setToPhoneNumber("");
    setTransferAmount("");
    setTransferDescription("");
    setShowTransferForm(false);
    await fetchUser();
    toast.success("Transferencia realizada correctamente");
  } else {
    toast.error("No se pudo realizar la transferencia. Intenta de nuevo.");
  }
};

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">SINPE Móvil</h1>
        <p className="text-gray-300">
          Transfiere dinero usando números de teléfono
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Teléfono Registrado
            </CardTitle>
            <CardDescription>Número asociado a tus cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountsWithPhone.length > 0 ? (
                accountsWithPhone.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{account.phone}</p>
                      <p className="text-sm text-gray-600">
                        {account.iban} - {account.number}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Smartphone className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    No tienes teléfonos registrados en tus cuentas
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Nueva Transferencia
            </CardTitle>
            <CardDescription>
              Envía dinero a cualquier número de teléfono
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showTransferForm ? (
              <div className="text-center py-6">
                <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Transfiere dinero de forma rápida y segura usando solo el
                  número de teléfono del destinatario
                </p>
                <Button onClick={() => setShowTransferForm(true)}>
                  Iniciar Transferencia
                </Button>
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
                      {(accounts ?? []).map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.iban} - {account.number} (
                          <CurrencyDisplay
                            amount={account.balance}
                            currency={account.currency?.symbol || "$"}
                          />
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="toPhoneNumber">
                    Número de teléfono destino
                  </Label>
                  <Input
                    id="toPhoneNumber"
                    value={toPhoneNumber}
                    onChange={(e) => setToPhoneNumber(e.target.value)}
                    placeholder="88881234"
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
                  <Label htmlFor="transferDescription">
                    Descripción (opcional)
                  </Label>
                  <Input
                    id="transferDescription"
                    value={transferDescription}
                    onChange={(e) => setTransferDescription(e.target.value)}
                    placeholder="Motivo de la transferencia"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={transferLoading}
                  >
                    {transferLoading ? "Enviando..." : "Enviar SINPE"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTransferForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
