import { apiService } from "./api"

export interface TransferRequest {
  fromAccountId: string
  toAccountId: string
  amount: number
  description?: string
}

export interface SinpeTransferRequest {
  fromAccountId: string
  toPhoneNumber: string
  amount: number
  description?: string
}

export interface TransferResponse {
  id: string
  status: "completed" | "pending" | "failed"
  message: string
}

class TransfersService {
  async createTransfer(transferData: TransferRequest): Promise<TransferResponse> {
    try {
      const response = await apiService.post<TransferResponse>("/transfers", transferData)
      return response
    } catch (error) {
      // Mock response for development
      return {
        id: Date.now().toString(),
        status: "completed",
        message: "Transferencia procesada exitosamente",
      }
    }
  }

  async createSinpeTransfer(transferData: SinpeTransferRequest): Promise<TransferResponse> {
    try {
      const response = await apiService.post<TransferResponse>("/sinpe-mobile/transfer", transferData)
      return response
    } catch (error) {
      // Mock response for development
      return {
        id: Date.now().toString(),
        status: "completed",
        message: "Transferencia SINPE procesada exitosamente",
      }
    }
  }
}

export const transfersService = new TransfersService()
