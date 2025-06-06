"use client"

import { useState } from "react"
import { transfersService, type TransferRequest, type SinpeTransferRequest } from "@/lib/services/transfers.service"
import { useToast } from "@/hooks/use-toast"

export function useTransfers() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const createTransfer = async (transferData: TransferRequest): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await transfersService.createTransfer(transferData)

      toast({
        title: "Transferencia exitosa",
        description: response.message,
      })

      return true
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
      const response = await transfersService.createSinpeTransfer(transferData)

      toast({
        title: "Transferencia SINPE exitosa",
        description: `Se ha enviado ₡${transferData.amount.toLocaleString()} al número ${transferData.toPhoneNumber}`,
      })

      return true
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
