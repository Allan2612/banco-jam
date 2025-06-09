"use client";

import type React from "react";
import { useState } from "react";
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
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { useTransfers } from "@/hooks/use-transfers";
import { toast } from "sonner";
import { ArrowLeftRight } from "lucide-react";
import type { Account } from "@/app/models/models";

interface TransferFormProps {
  accounts: Account[];
  allAccounts: Account[];
  onTransferSuccess?: (fromId: string, amount: number) => void;
  onSuccess?: () => void;
}

export function TransferForm({
  accounts,
  allAccounts,
  onTransferSuccess,
  onSuccess,
}: TransferFormProps) {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const { createTransfer, loading } = useTransfers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromAccount || !toAccount || !amount) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (fromAccount === toAccount) {
      toast.error("No puedes transferir a la misma cuenta");
      return;
    }

    const transferAmount = Number.parseFloat(amount);
    const sourceAccount = accounts.find((acc) => acc.id === fromAccount);

    if (sourceAccount && transferAmount > sourceAccount.balance) {
      toast.error("Saldo insuficiente");
      return;
    }

    // Datos obligatorios para newTransfer
    const status = "completed";
    const transactionId = crypto.randomUUID();
    const currency = sourceAccount?.currency?.symbol || "$";
    const hmacHash = "";

    const success = await createTransfer({
      fromId: fromAccount,
      toId: toAccount,
      amount: transferAmount,
      status,
      transactionId,
      currency,
      hmacHash,
      description,
    });

    if (success) {
      setFromAccount("");
      setToAccount("");
      setAmount("");
      setDescription("");
      toast.success("Transferencia realizada correctamente");
      onTransferSuccess?.(fromAccount, transferAmount);
      onSuccess?.();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowLeftRight className="h-5 w-5 mr-2" />
          Nueva Transferencia
        </CardTitle>
        <CardDescription>
          Transfiere dinero entre tus cuentas bancarias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fromAccount">Cuenta de origen</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona cuenta de origen" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
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
            <Label htmlFor="toAccount">Cuenta de destino</Label>
            <Select value={toAccount} onValueChange={setToAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona cuenta de destino" />
              </SelectTrigger>
              <SelectContent>
                {allAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.iban} - {account.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Motivo de la transferencia"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Procesando..." : "Realizar Transferencia"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}