import { useEffect, useState } from "react";
import { getAccountById } from "@/app/services/accountService";
import type { Account } from "@/app/models/models";

export function useAccountById(accountId: string | undefined) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setAccount(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getAccountById(accountId)
      .then((res) => {
        if (res.success) {
          setAccount(res.account);
          setError(null);
        } else {
          setAccount(null);
          setError(res.message || "No se pudo cargar la cuenta");
        }
        setLoading(false);
      })
      .catch(() => {
        setAccount(null);
        setError("Error al cargar la cuenta");
        setLoading(false);
      });
  }, [accountId]);

  return { account, loading, error };
}