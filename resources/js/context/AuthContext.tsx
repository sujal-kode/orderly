import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  api,
  User,
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearAuthStorage,
} from '../services/api.js'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: { email: string; password: string }) => Promise<User>
  signup: (payload: {
    fullName?: string
    email: string
    password: string
    passwordConfirmation: string
  }) => Promise<User>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser())
  const [token, setTokenState] = useState<string | null>(getToken())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const refreshProfile = async () => {
    const currentToken = getToken()
    if (!currentToken) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const profile = await api.auth.profile()
      if (profile && profile.id) {
        setUser(profile)
        setStoredUser(profile)
      }
    } catch (err: unknown) {
      // If token is invalid/expired (401/404), reset
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('401') || msg.includes('404') || msg.includes('Unauthenticated')) {
        clearAuthStorage()
        setTokenState(null)
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshProfile()
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.auth.login(credentials)
    const userData: User = res.user || {
      id: 1,
      email: credentials.email,
      fullName: null,
      role: 'customer',
    }
    setToken(res.token)
    setTokenState(res.token)
    setUser(userData)
    setStoredUser(userData)
    return userData
  }

  const signup = async (payload: {
    fullName?: string
    email: string
    password: string
    passwordConfirmation: string
  }) => {
    const res = await api.auth.signup(payload)
    if (res && res.token) {
      const userData: User = res.user || {
        id: 1,
        email: payload.email,
        fullName: payload.fullName || null,
        role: 'customer',
      }
      setToken(res.token)
      setTokenState(res.token)
      setUser(userData)
      setStoredUser(userData)
      return userData
    }
    // If signup did not auto-return token, login directly
    return login({ email: payload.email, password: payload.password })
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } catch {
      clearAuthStorage()
    } finally {
      setTokenState(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
