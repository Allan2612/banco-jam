import { useAuthStore } from "@/app/stores/auth-store"


export function useAuth() {
  const {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setUser,
    fetchUser,
  } = useAuthStore()

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setUser,
    fetchUser,
    isAuthenticated: !!user,
  }
}