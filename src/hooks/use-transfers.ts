"use client"

import { useState } from "react"
import { newAccountTransfer, newSinpeTransfer } from "@/app/services/transferService"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

  const createTransfer = async (transferData: TransferRequest): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await newAccountTransfer(
        transferData.fromId,
        transferData.toId,
        transferData.amount,
        transferData.status,
        transferData.transactionId,
        transferData.currency,
        transferData.hmacHash,
        transferData.description
      )
      if (response.success) {
        toast({
          title: "Transferencia exitosa",
          description: "Fondos transferidos correctamente.",
        })
        return true
      } else {
        toast({
          title: "Error en transferencia",
          description: response.message || "No se pudo procesar la transferencia",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Error en transferencia",
        description: "No se pudo procesar la transferencia",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const createSinpeTransfer = async (transferData: SinpeTransferRequest): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await newSinpeTransfer(
        transferData.fromId,
        transferData.toPhoneNumber,
        transferData.amount,
        transferData.status,
        transferData.transactionId,
        transferData.currency,
        transferData.hmacHash,
        transferData.description
      )
      if (response.success) {
        toast({
          title: "Transferencia SINPE exitosa",
          description: `Se ha enviado ₡${transferData.amount.toLocaleString()} al número ${transferData.toPhoneNumber}`,
        })
        return true
      } else {
        toast({
          title: "Error en transferencia SINPE",
          description: response.message || "No se pudo procesar la transferencia",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Error en transferencia SINPE",
        description: "No se pudo procesar la transferencia",
        variant: "destructive",
      })
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