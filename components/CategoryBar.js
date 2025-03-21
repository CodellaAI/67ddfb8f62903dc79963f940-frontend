
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function CategoryBar() {
  const router = useRouter()
  const scrollRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = [
    'All', 'Music', 'Gaming', 'News', 'Sports', 'Comedy', 
    'Education', 'Science & Technology', 'Travel', 'Food', 
    'Fashion', 'Beauty', 'Vlogs', 'Podcasts', 'Animation',
    'Documentaries', 'Pets & Animals', 'Autos', 'Entertainment'
  ]

  const checkArrows = () => {
    if (!scrollRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkArrows)
      // Initial check
      checkArrows()
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkArrows)
      }
    }
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    if (category === 'All') {
      router.push('/')
    } else {
      router.push(`/category/${category.toLowerCase().replace(/ & /g, '-and-')}`)
    }
  }

  return (
    <div className="relative mb-6">
      {showLeftArrow && (
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-yt-black bg-opacity-80 p-1 rounded-full"
        >
          <FiChevronLeft className="text-xl" />
        </button>
      )}
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-4 space-x-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-3 py-1 rounded-full whitespace-nowrap text-sm ${
              activeCategory === category
                ? 'bg-white text-yt-black font-medium'
                : 'bg-yt-light-black hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {showRightArrow && (
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-yt-black bg-opacity-80 p-1 rounded-full"
        >
          <FiChevronRight className="text-xl" />
        </button>
      )}
    </div>
  )
}
