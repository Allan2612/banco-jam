"use client"

import { useState } from "react"
import { newAccountTransfer, newSinpeTransfer } from "@/app/services/transferService"
import { toast } from "sonner"

export interface TransferRequest {
  fromId: string
  toId: string
  amount: number
  status: string
  transactionId: string
  currency: string
  hmacHash: string
  description: string
}

export interface SinpeTransferRequest {
  fromId: string
  toPhoneNumber: string
  amount: number
  status: string
  transactionId: string
  currency: string
  hmacHash: string
  description: string
}
export function useTransfers() {
  const [loading, setLoading] = useState(false)

  const createTransfer = async (transferData: TransferRequest): Promise<boolean> => {
    try {
      setLoading(true)
      await newAccountTransfer(
        transferData.fromId,
        transferData.toId,
        transferData.amount,
        transferData.status,
        transferData.transactionId,
        transferData.currency,
        transferData.hmacHash,
        transferData.description
      )
      toast.success("Transferencia exitosa: Fondos transferidos correctamente.")
      return true
    } catch (error: any) {
      toast.error(error.message || "No se pudo procesar la transferencia")
      return false
    } finally {
      setLoading(false)
    }
  }

  const createSinpeTransfer = async (transferData: SinpeTransferRequest): Promise<boolean> => {
    try {
      setLoading(true)
      await newSinpeTransfer(
        transferData.fromId,
        transferData.toPhoneNumber,
        transferData.amount,
        transferData.status,
        transferData.transactionId,
        transferData.currency,
        transferData.hmacHash,
        transferData.description
      )
       toast.success(
        `Transferencia SINPE exitosa: Se ha enviado ₡${transferData.amount.toLocaleString()} al número ${transferData.toPhoneNumber}`
      )
      return true
    } catch (error: any) {
      toast.error(error.message || "No se pudo procesar la transferencia SINPE")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    createTransfer,
    createSinpeTransfer,
  }
}