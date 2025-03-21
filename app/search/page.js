
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import VideoListItem from '@/components/VideoListItem'
import Loading from '@/components/Loading'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return
      
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/search?q=${query}`)
        setVideos(response.data)
      } catch (err) {
        console.error('Error searching videos:', err)
        setError('Failed to load search results. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  if (loading) return <Loading />
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Search results for: {query}</h1>
      
      {videos.length === 0 ? (
        <div className="text-center py-10">No videos found matching your search.</div>
      ) : (
        <div className="space-y-4">
          {videos.map(video => (
            <VideoListItem key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}
