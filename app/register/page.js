
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function RegisterPage() {
  const router = useRouter()
  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        username,
        email,
        password
      })
      
      router.push('/login?registered=true')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.response?.data?.message || 'Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-yt-light-black rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            placeholder="Choose a username"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Create a password"
            minLength="6"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="Confirm your password"
            minLength="6"
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full py-2"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  )
}
