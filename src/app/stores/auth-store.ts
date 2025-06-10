import { create } from "zustand"
import { User } from "@/app/models/models"
import { getUserByEmailAndPassword, newUser, fetchUserById } from "@/app/services/userService"

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone: string, currency: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
  refreshUserOnce: () => Promise<void>
}

function getUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem("jam_user")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setUserToStorage(user: User | null) {
  if (user) {
    localStorage.setItem("jam_user", JSON.stringify(user))
    // Sincronizar con cookies para el middleware
    document.cookie = `jam_user=${JSON.stringify(user)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  } else {
    localStorage.removeItem("jam_user")
    // Eliminar cookie
    document.cookie = 'jam_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

function getUserFromCookie(): User | null {
  if (typeof document === 'undefined') return null
  
  try {
    const cookies = document.cookie.split(';')
    const userCookie = cookies.find(cookie => 
      cookie.trim().startsWith('jam_user=')
    )
    
    if (userCookie) {
      const cookieValue = userCookie.split('=')[1]
      return JSON.parse(decodeURIComponent(cookieValue))
    }
    return null
  } catch {
    return null
  }
}

function initializeUser(): User | null {
  if (typeof window === "undefined") return null
  
  // Priorizar localStorage, pero verificar cookie como fallback
  const localUser = getUserFromStorage()
  const cookieUser = getUserFromCookie()
  
  if (localUser) {
    // Si hay usuario en localStorage pero no en cookie, sincronizar
    if (!cookieUser) {
      setUserToStorage(localUser)
    }
    return localUser
  }
  
  if (cookieUser) {
    // Si hay usuario en cookie pero no en localStorage, sincronizar
    localStorage.setItem("jam_user", JSON.stringify(cookieUser))
    return cookieUser
  }
  
  return null
}

let hasRefreshedUser = false

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initializeUser(),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const user = await getUserByEmailAndPassword(email, password)
      setUserToStorage(user)
      set({ user, loading: false })
      return true
    } catch (e: any) {
      set({ error: e.message || "Credenciales incorrectas", loading: false })
      return false
    }
  },

  register: async (name, email, password, phone, currency) => {
    set({ loading: true, error: null })
    try {
      const user = await newUser(name, email, password, phone, currency)
      setUserToStorage(user)
      set({ user, loading: false })
      return true
    } catch (e: any) {
      set({ error: e.message || "No se pudo registrar", loading: false })
      return false
    }
  },

  logout: () => {
    setUserToStorage(null)
    set({ user: null })
    // Redirigir al login después del logout
    if (typeof window !== "undefined") {
      window.location.href = '/login'
    }
  },

  setUser: (user) => {
    setUserToStorage(user)
    set({ user })
  },

  fetchUser: async () => {
    const user = get().user;
    if (!user) return;
    set({ loading: true });
    try {
      const freshUser = await fetchUserById(user.id);
      setUserToStorage(freshUser);
      set({ user: freshUser, loading: false });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ loading: false });
    }
  },

  refreshUserOnce: async () => {
    if (hasRefreshedUser) return;
    hasRefreshedUser = true;
    const user = get().user;
    if (!user) return;
    set({ loading: true });
    try {
      const freshUser = await fetchUserById(user.id);
      setUserToStorage(freshUser);
      set({ user: freshUser, loading: false });
    } catch (error) {
      console.error('Error refreshing user:', error);
      set({ loading: false });
    }
  },
}))