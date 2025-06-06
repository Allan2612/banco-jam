"use client"

import { useState, useEffect } from "react"
import { accountsService, type Account, type AccountDetail } from "@/lib/services/accounts.service"

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await accountsService.getAccounts()
      setAccounts(data)
    } catch (err) {
      setError("Error al cargar las cuentas")
      console.error("Fetch accounts error:", err)
    } finally {
      setLoading(false)
    }
  }

  const refreshAccounts = () => {
    fetchAccounts()
  }

  return {
    accounts,
    loading,
    error,
    refreshAccounts,
  }
}

export function useAccountDetail(accountId: string) {
  const [account, setAccount] = useState<AccountDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (accountId) {
      fetchAccountDetail()
    }
  }, [accountId])

  const fetchAccountDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await accountsService.getAccountDetail(accountId)
      setAccount(data)
    } catch (err) {
      setError("Error al cargar el detalle de la cuenta")
      console.error("Fetch account detail error:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    account,
    loading,
    error,
    refreshAccount: fetchAccountDetail,
  }
}
