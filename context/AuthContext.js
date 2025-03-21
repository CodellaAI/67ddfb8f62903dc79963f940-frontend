
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { withCredentials: true }
        )
        setUser(response.data)
      } catch (err) {
        // Not authenticated or error
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      setUser(response.data.user)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      )
      setUser(null)
      // Clear any auth cookies
      Cookies.remove('jwt')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        userData
      )
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    register
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
