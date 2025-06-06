import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService, type User, type LoginCredentials, type RegisterData } from "@/lib/services/auth.service"

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      isAuthenticated: false,

      initializeAuth: async () => {
        try {
          set({ loading: true })
          if (authService.isAuthenticated()) {
            const currentUser = await authService.getCurrentUser()
            set({ user: currentUser, isAuthenticated: true })
          } else {
            // For testing: auto-login with mock user
            const mockUser = await authService.getCurrentUser()
            set({ user: mockUser, isAuthenticated: true })
          }
        } catch (error) {
          console.error("Auth initialization error:", error)
          set({ user: null, isAuthenticated: false })
        } finally {
          set({ loading: false })
        }
      },

      login: async (credentials: LoginCredentials) => {
        try {
          set({ loading: true })
          const { user } = await authService.login(credentials)
          set({ user, isAuthenticated: true })
          return true
        } catch (error) {
          console.error("Login error:", error)
          return false
        } finally {
          set({ loading: false })
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ loading: true })
          const { user } = await authService.register(data)
          set({ user, isAuthenticated: true })
          return true
        } catch (error) {
          console.error("Register error:", error)
          return false
        } finally {
          set({ loading: false })
        }
      },

      logout: () => {
        authService.removeToken()
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "jam-bank-auth",
      // Only store user and isAuthenticated in localStorage
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
