import { apiService } from "./api"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
}

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
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>("/auth/login", credentials)
      this.setToken(response.token)
      return response
    } catch (error) {
      // Mock response for development
      const mockUser: User = {
        id: "mock-user-1",
        name: credentials.email.split("@")[0] || "Usuario de Prueba",
        email: credentials.email,
        phone: "8888-1234",
      }
      const mockToken = "mock-token-123"
      this.setToken(mockToken)
      return { user: mockUser, token: mockToken }
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>("/auth/register", data)
      this.setToken(response.token)
      return response
    } catch (error) {
      // Mock response for development
      const mockUser: User = {
        id: "mock-user-1",
        name: data.name,
        email: data.email,
        phone: "8888-1234",
      }
      const mockToken = "mock-token-123"
      this.setToken(mockToken)
      return { user: mockUser, token: mockToken }
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<{ user: User }>("/auth/me")
      return response.user
    } catch (error) {
      // Mock user for development
      return {
        id: "mock-user-1",
        name: "Usuario de Prueba",
        email: "prueba@jambank.com",
        phone: "8888-1234",
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
