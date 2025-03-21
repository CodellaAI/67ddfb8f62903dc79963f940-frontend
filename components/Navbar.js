
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiMenu, FiSearch, FiUpload, FiBell, FiUser } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu)
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-yt-black sticky top-0 z-50 py-2 px-4 flex items-center justify-between border-b border-gray-800">
      {/* Left section - Logo and menu */}
      <div className="flex items-center">
        <button className="p-2 mr-2 rounded-full hover:bg-gray-800">
          <FiMenu className="text-white text-xl" />
        </button>
        <Link href="/" className="flex items-center">
          <div className="text-2xl font-bold flex items-center">
            <span className="text-white">Tube</span>
            <span className="text-yt-red">Stream</span>
          </div>
        </Link>
      </div>

      {/* Middle section - Search */}
      <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-yt-black border border-gray-700 rounded-l-full py-2 px-4 focus:outline-none focus:border-blue-500"
          />
          <button 
            type="submit"
            className="bg-gray-800 border border-gray-700 rounded-r-full px-4 hover:bg-gray-700"
          >
            <FiSearch className="text-white text-xl" />
          </button>
        </form>
      </div>

      {/* Right section - User actions */}
      <div className="flex items-center">
        <button 
          onClick={() => router.push('/search')}
          className="md:hidden p-2 mx-1 rounded-full hover:bg-gray-800"
        >
          <FiSearch className="text-white text-xl" />
        </button>

        {isAuthenticated ? (
          <>
            <Link href="/upload" className="p-2 mx-1 rounded-full hover:bg-gray-800">
              <FiUpload className="text-white text-xl" />
            </Link>
            <button className="p-2 mx-1 rounded-full hover:bg-gray-800">
              <FiBell className="text-white text-xl" />
            </button>
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={handleUserMenuToggle}
                className="w-8 h-8 ml-2 rounded-full overflow-hidden"
              >
                {user?.profilePicture ? (
                  <Image 
                    src={user.profilePicture} 
                    alt={user.username}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-yt-light-black rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <Link 
                    href={`/channel/${user._id}`}
                    className="block px-4 py-2 hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Your channel
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-500"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link 
            href="/login" 
            className="flex items-center text-blue-500 border border-blue-500 rounded-full px-4 py-1"
          >
            <FiUser className="mr-2" />
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}
