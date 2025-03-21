
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import Loading from '@/components/Loading'

export default function VideoGrid({ videos: initialVideos, category }) {
  const [videos, setVideos] = useState(initialVideos || [])
  const [loading, setLoading] = useState(!initialVideos)
  const [error, setError] = useState(null)

  useEffect(() => {
    // If videos were passed as props, use those
    if (initialVideos) {
      setVideos(initialVideos)
      setLoading(false)
      return
    }

    // Otherwise fetch videos from API
    const fetchVideos = async () => {
      try {
        setLoading(true)
        let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/videos`
        
        if (category) {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/videos/category/${category}`
        }
        
        const response = await axios.get(endpoint)
        setVideos(response.data)
      } catch (err) {
        console.error('Error fetching videos:', err)
        setError('Failed to load videos. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [initialVideos, category])

  if (loading) return <Loading />
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>
  if (videos.length === 0) return <div className="text-center mt-10">No videos found</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map(video => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  )
}
