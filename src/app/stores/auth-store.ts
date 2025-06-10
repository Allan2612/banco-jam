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
  } else {
    localStorage.removeItem("jam_user")
  }
}
let hasRefreshedUser = false
export const useAuthStore = create<AuthState>((set, get) => ({
  user: typeof window !== "undefined" ? getUserFromStorage() : null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const data = await getUserByEmailAndPassword(email, password)
      if (data.success) {
        setUserToStorage(data.user)
        set({ user: data.user, loading: false })
        return true
      } else {
        set({ error: data.message || "Credenciales incorrectas", loading: false })
        return false
      }
    } catch {
      set({ error: "Error de red", loading: false })
      return false
    }
  },

  register: async (name, email, password, phone, currency) => {
    set({ loading: true, error: null })
    try {
      const data = await newUser(name, email, password, phone, currency)
      if (data.success) {
        setUserToStorage(data.user)
        set({ user: data.user, loading: false })
        return true
      } else {
        set({ error: data.message || "No se pudo registrar", loading: false })
        return false
      }
    } catch {
      set({ error: "Error de red", loading: false })
      return false
    }
  },

  logout: () => {
    setUserToStorage(null)
    set({ user: null })
  },
  setUser: (user) => {
    setUserToStorage(user)
    set({ user })
  },
  
fetchUser: async () => {
  const user = get().user;
  if (!user) return;
  set({ loading: true });
  const freshUser = await fetchUserById(user.id);
  setUserToStorage(freshUser);
  set({ user: freshUser, loading: false });
},

refreshUserOnce: async () => {
  if (hasRefreshedUser) return;
  hasRefreshedUser = true;
  const user = get().user;
  if (!user) return;
  set({ loading: true });
  const freshUser = await fetchUserById(user.id);
  setUserToStorage(freshUser);
  set({ user: freshUser, loading: false });
},
}))