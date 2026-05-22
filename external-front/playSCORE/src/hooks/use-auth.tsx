'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { mockUsuarios } from '@/mocks/database'
import type { ReactNode } from 'react'
import type { Usuario } from '@/types'

interface AuthContextValue {
  user: Usuario | null
  isLoggedIn: boolean
  loginAs: (userId: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'playscoreUserId'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)

  useEffect(() => {
    const storedUserId = localStorage.getItem(STORAGE_KEY)
    if (!storedUserId) return

    const userId = Number(storedUserId)
    const foundUser = mockUsuarios.find((u) => u.id === userId)
    if (foundUser) {
      setUser(foundUser)
    }
  }, [])

  const loginAs = (userId: number) => {
    const foundUser = mockUsuarios.find((u) => u.id === userId)
    if (!foundUser) return

    localStorage.setItem(STORAGE_KEY, String(userId))
    setUser(foundUser)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      loginAs,
      logout,
    }),
    [user]
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
