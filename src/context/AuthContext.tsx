import { createContext, useContext, useEffect, useState } from 'react'
import { type JWTResponse, type LoginDto, type SignUpDto } from '../utils/types'
import { authApi } from '../api/authApi'
import { authService } from '../services/authService'

interface AuthCtx {
  user: JWTResponse | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  login: (d: LoginDto) => Promise<void>
  signUp: (d: SignUpDto) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<JWTResponse | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on app start
  useEffect(() => {
    const stored = authService.getStoredUser()
    if (stored) setUser(stored)
    setLoading(false)
  }, [])

  const login = async (d: LoginDto) => {
    const res = await authApi.login(d)
    authService.persist(res)
    setUser(res)
  }

  const signUp = async (d: SignUpDto) => {
    const res = await authApi.signUp(d)
    authService.persist(res)
    setUser(res)
  }

  const logout = () => {
    authService.clear()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      loading,
      login,
      signUp,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
