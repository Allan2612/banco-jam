"use client";

import { useEffect } from "react";
import { useAccounts } from "@/hooks/use-accounts";
import { useAuthStore } from "@/app/stores/auth-store";
import { AccountList } from "@/components/accounts/account-list";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AccountsPage() {
  const { accounts, loading, error } = useAccounts();
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    // Solo llama a fetchUser si user existe pero no tiene cuentas cargadas
    if (user && user.accounts && user.accounts.length > 0 && user.accounts[0].account?.currency) {
      // Ya está todo cargado, no hagas nada
      return;
    }
    // Si no hay usuario o no tiene cuentas cargadas, haz fetch
    if (user) {
      fetchUser();
    }
  }, [user]); // Solo depende de user

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Mi Cuenta</h1>
        <p className="text-gray-300">Gestiona tu cuenta bancaria</p>
      </div>
      <AccountList accounts={accounts} />
    </div>
  );
}