import { useState } from "react";
import { newAccountTransferByIban } from "@/app/services/transferService";
import { toast } from "sonner";

export interface TransferByIbanRequest {
  fromId: string;
  toIban: string;
  amount: number;
  status: string;
  transactionId: string;
  currency: string;
  hmacHash: string;
  description: string;
}

export function useTransferByIban() {
  const [loading, setLoading] = useState(false);

  const createTransferByIban = async (transferData: TransferByIbanRequest): Promise<boolean> => {
    try {
      setLoading(true);
      await newAccountTransferByIban(
        transferData.fromId,
        transferData.toIban,
        transferData.amount,
        transferData.status,
        transferData.transactionId,
        transferData.currency,
        transferData.hmacHash,
        transferData.description
      );
      toast.success("Transferencia por IBAN exitosa.");
      return true;
    } catch (error: any) {
      toast.error(error.message || "No se pudo procesar la transferencia por IBAN");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createTransferByIban,
  };
}