import { apiService } from "./api"
import { User } from "@/app/models/models"
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

class AuthService {

  /*async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>("/auth/register", data)
      this.setToken(response.token)
      return response
    } catch (error) {
      // Mock response for development
      const mockUser: User = {
        id: "mock-user-1",
      name: "Usuario de Prueba",
      email: "prueba@jambank.com",
      password: "mock-password",
      accounts: [],
      createdAt: new Date().toISOString(),
      logs: [],
      }
      const mockToken = "mock-token-123"
      this.setToken(mockToken)
      return { user: mockUser, token: mockToken }
    }
  }*/

  async getCurrentUser(): Promise<User> {
    try {
      //const response = await apiService.get<{ user: User }>("/auth/me")
      //return response.user
      return {
      id: "mock-user-1",
      name: "Usuario de Prueba",
      email: "prueba@jambank.com",
      password: "mock-password",
      accounts: [],
      createdAt: new Date().toISOString(),
      logs: [],
    }
    } catch (error) {
      return {
      id: "mock-user-1",
      name: "Usuario de Prueba",
      email: "prueba@jambank.com",
      password: "mock-password",
      accounts: [],
      createdAt: new Date().toISOString(),
      logs: [],
    }
    }
  }

  setToken(token: string): void {
    localStorage.setItem("token", token)
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  removeToken(): void {
    localStorage.removeItem("token")
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
