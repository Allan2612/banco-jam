import { apiService } from "./api"

export interface Account {
  id: string
  number: string
  type: string
  currency: string
  balance: number
  status: "active" | "inactive"
}

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "credit" | "debit"
  status: "completed" | "pending" | "failed"
}

export interface AccountDetail extends Account {
  transactions: Transaction[]
}

class AccountsService {
  async getAccounts(): Promise<Account[]> {
    try {
      const response = await apiService.get<{ accounts: Account[] }>("/accounts")
      return response.accounts
    } catch (error) {
      // Mock data for development
      return [
        {
          id: "1",
          number: "001-234567-89",
          type: "Cuenta Corriente",
          currency: "CRC",
          balance: 1250000,
          status: "active",
        },
        {
          id: "2",
          number: "001-987654-32",
          type: "Cuenta de Ahorros",
          currency: "CRC",
          balance: 850000,
          status: "active",
        },
        {
          id: "3",
          number: "001-456789-12",
          type: "Cuenta Dólares",
          currency: "USD",
          balance: 2500,
          status: "active",
        },
      ]
    }
  }

  async getAccountDetail(accountId: string): Promise<AccountDetail> {
    try {
      const response = await apiService.get<{ account: AccountDetail }>(`/accounts/${accountId}`)
      return response.account
    } catch (error) {
      // Mock data for development
      return {
        id: accountId,
        number: "001-234567-89",
        type: "Cuenta Corriente",
        currency: "CRC",
        balance: 1250000,
        status: "active",
        transactions: [
          {
            id: "1",
            date: "2024-01-15",
            description: "Transferencia recibida de Juan Pérez",
            amount: 50000,
            type: "credit",
            status: "completed",
          },
          {
            id: "2",
            date: "2024-01-14",
            description: "Pago de servicios públicos",
            amount: -25000,
            type: "debit",
            status: "completed",
          },
        ],
      }
    }
  }
}

export const accountsService = new AccountsService()
