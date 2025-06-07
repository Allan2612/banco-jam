"use client"

import { useState, useEffect } from "react"
import { authService } from "@/lib/services/auth.service"
import { User } from "@/app/models/models"
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } else {
        const mockUser = await authService.getCurrentUser()
        setUser(mockUser)
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
    } finally {
      setLoading(false)
    }
  }

  /*const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const { user } = await authService.login(credentials)
      setUser(user)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const { user } = await authService.register(data)
      setUser(user)
      return true
    } catch (error) {
      console.error("Register error:", error)
      return false
    }
  }*/

  const logout = () => {
    authService.removeToken()
    setUser(null)
  }

  return {
    user,
    loading,
    //login,
    //register,
    logout,
    isAuthenticated: !!user,
  }
}
