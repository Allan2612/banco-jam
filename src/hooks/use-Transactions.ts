import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/stores/auth-store";
import { getUserTransfers } from "@/app/services/transferService";

export function useUserTransfers() {
  const user = useAuthStore((state) => state.user);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setTransfers([]);
      setLoading(false);
      setError("No hay usuario autenticado");
      return;
    }
    setLoading(true);
    getUserTransfers(user.id)
      .then((transactions) => {
        setTransfers(transactions);
        setError(null);
      })
      .catch((e) => setError(e.message || "Error al cargar transferencias"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return { transfers, loading, error };
}