
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiHome, FiCompass, FiClock, FiThumbsUp, 
  FiPlayCircle, FiTrendingUp, FiMusic, FiFilm, 
  FiMonitor, FiGamepad, FiNewspaper, FiAward,
  FiSettings, FiHelpCircle, FiFlag
} from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

export default function Sidebar() {
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)

  const isActive = (path) => pathname === path

  // Main navigation items
  const mainNavItems = [
    { icon: <FiHome className="sidebar-icon" />, label: 'Home', path: '/' },
    { icon: <FiCompass className="sidebar-icon" />, label: 'Explore', path: '/explore' },
    { icon: <FiPlayCircle className="sidebar-icon" />, label: 'Shorts', path: '/shorts' },
    { icon: <FiTrendingUp className="sidebar-icon" />, label: 'Trending', path: '/trending' },
  ]

  // User-specific navigation items (only shown when logged in)
  const userNavItems = [
    { icon: <FiClock className="sidebar-icon" />, label: 'History', path: '/history' },
    { icon: <FiThumbsUp className="sidebar-icon" />, label: 'Liked videos', path: '/liked' },
  ]

  // Categories
  const categoryItems = [
    { icon: <FiMusic className="sidebar-icon" />, label: 'Music', path: '/category/music' },
    { icon: <FiFilm className="sidebar-icon" />, label: 'Movies', path: '/category/movies' },
    { icon: <FiMonitor className="sidebar-icon" />, label: 'TV Shows', path: '/category/tv' },
    { icon: <FiGamepad className="sidebar-icon" />, label: 'Gaming', path: '/category/gaming' },
    { icon: <FiNewspaper className="sidebar-icon" />, label: 'News', path: '/category/news' },
    { icon: <FiAward className="sidebar-icon" />, label: 'Sports', path: '/category/sports' },
  ]

  // Footer items
  const footerItems = [
    { icon: <FiSettings className="sidebar-icon" />, label: 'Settings', path: '/settings' },
    { icon: <FiHelpCircle className="sidebar-icon" />, label: 'Help', path: '/help' },
    { icon: <FiFlag className="sidebar-icon" />, label: 'Report', path: '/report' },
  ]

  return (
    <aside className={`h-full overflow-y-auto bg-yt-black ${expanded ? 'w-60' : 'w-20'} transition-width duration-300 hidden md:block`}>
      <div className="py-4">
        {/* Main navigation */}
        <div className="mb-4">
          {mainNavItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.path}
              className={`flex items-center px-4 py-2 my-1 rounded-lg ${
                isActive(item.path) ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              {expanded && <span className="ml-4">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* User-specific navigation (only when logged in) */}
        {isAuthenticated && (
          <div className="mb-4 border-t border-gray-800 pt-4">
            <h3 className={`text-sm text-gray-400 mb-2 ${expanded ? 'px-4' : 'text-center'}`}>
              {expanded ? 'You' : ''}
            </h3>
            
            <Link 
              href={`/channel/${user._id}`}
              className={`flex items-center px-4 py-2 my-1 rounded-lg ${
                pathname.startsWith(`/channel/${user._id}`) ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <div className="text-xl">
                <FiUser className="sidebar-icon" />
              </div>
              {expanded && <span className="ml-4">Your channel</span>}
            </Link>
            
            {userNavItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.path}
                className={`flex items-center px-4 py-2 my-1 rounded-lg ${
                  isActive(item.path) ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <div className="text-xl">{item.icon}</div>
                {expanded && <span className="ml-4">{item.label}</span>}
              </Link>
            ))}
          </div>
        )}

        {/* Categories */}
        <div className="mb-4 border-t border-gray-800 pt-4">
          <h3 className={`text-sm text-gray-400 mb-2 ${expanded ? 'px-4' : 'text-center'}`}>
            {expanded ? 'Categories' : ''}
          </h3>
          
          {categoryItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.path}
              className={`flex items-center px-4 py-2 my-1 rounded-lg ${
                isActive(item.path) ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              {expanded && <span className="ml-4">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 pt-4">
          {footerItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.path}
              className={`flex items-center px-4 py-2 my-1 rounded-lg ${
                isActive(item.path) ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              {expanded && <span className="ml-4">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Toggle button */}
        <button
          className="mt-4 mx-auto block text-gray-400 hover:text-white"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '« Collapse' : '»'}
        </button>
      </div>
    </aside>
  )
}

function FiUser(props) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
