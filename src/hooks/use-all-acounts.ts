import { useEffect, useState } from "react";
import { getAllAccounts } from "@/app/services/accountService";
import type { Account } from "@/app/models/models";

export function useAllAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllAccounts()
      .then((accounts) => {
        setAccounts(accounts);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Error al cargar las cuentas");
        setLoading(false);
      });
  }, []);

  return { accounts, loading, error };
}