'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import api from '@/lib/api'
import type { Usuario } from '@/types'

interface AuthContextValue {
  user: Usuario | null
  isLoggedIn: boolean
  isLoading: boolean // Adicionado aqui
  loginAs: (userId: number) => Promise<void> // Mudou para Promise para podermos usar await
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'playscoreUserId'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Começa como true

  // Carrega o usuário do localStorage ao abrir o app
  useEffect(() => {
    const storedUserId = localStorage.getItem(STORAGE_KEY)
    
    if (!storedUserId) {
      setIsLoading(false) // Não tem usuário guardado, termina o loading
      return
    }

    const userId = Number(storedUserId)
    api.getUsuario(userId)
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY)
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false) // Termina o loading dando certo ou errado
      })
  }, [])

  // Atualizado para async/await para o handleSubmit poder aguardar o término
  const loginAs = async (userId: number) => {
    setIsLoading(true) // Ativa o loading ao tentar logar
    try {
      const u = await api.getUsuario(userId)
      localStorage.setItem(STORAGE_KEY, String(userId))
      setUser(u)
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY)
      setUser(null)
      throw error // Repassa o erro para o handleSubmit tratar se necessário
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      isLoading, // Adicionado no value do contexto
      loginAs,
      logout,
    }),
    [user, isLoading] // Adicionado isLoading nas dependências
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
