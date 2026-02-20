/*
 * Purpose: Global authentication context for user session, role checks, and auth actions.
 * API Integration: Calls authApi login/register/profile endpoints and stores JWT/user locally.
 * State Management: Maintains user/token/loading state via React context + localStorage persistence.
 * Navigation Flow: Route guards read this state to allow/deny protected and admin routes.
 * Backend Connection: Make sure backend returns { data: { user, token } } from auth endpoints.
 */
import { createContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../services/authApi'
import { getApiErrorMessage } from '../services/apiClient'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'shopsmart_token'
const USER_KEY = 'shopsmart_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  const persistSession = (nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    toast.success('Logged out successfully')
  }

  const login = async (payload) => {
    try {
      setLoading(true)
      const response = await authApi.login(payload)
      persistSession(response.data.user, response.data.token)
      toast.success('Login successful')
      return response
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    try {
      setLoading(true)
      const response = await authApi.register(payload)
      persistSession(response.data.user, response.data.token)
      toast.success('Account created')
      return response
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (!token) {
      setAuthChecked(true)
      return
    }
    try {
      const response = await authApi.getProfile()
      setUser(response.data)
      localStorage.setItem(USER_KEY, JSON.stringify(response.data))
    } catch {
      logout()
    } finally {
      setAuthChecked(true)
    }
  }

  useEffect(() => {
    refreshProfile()
  }, [])

  const value = useMemo(
    () => ({ user, token, loading, authChecked, login, register, logout, refreshProfile }),
    [user, token, loading, authChecked]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
