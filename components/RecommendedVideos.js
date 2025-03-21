
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import VideoListItem from '@/components/VideoListItem'
import Loading from '@/components/Loading'

export default function RecommendedVideos({ currentVideoId }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecommendedVideos = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${currentVideoId}/recommended`)
        setVideos(response.data)
      } catch (err) {
        console.error('Error fetching recommended videos:', err)
        setError('Failed to load recommendations')
        
        // Fallback to fetching random videos
        try {
          const fallbackResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
          // Filter out the current video
          const filteredVideos = fallbackResponse.data.filter(video => video._id !== currentVideoId)
          setVideos(filteredVideos)
          setError(null)
        } catch (fallbackErr) {
          console.error('Error fetching fallback videos:', fallbackErr)
        }
      } finally {
        setLoading(false)
      }
    }

    if (currentVideoId) {
      fetchRecommendedVideos()
    }
  }, [currentVideoId])

  if (loading) return <Loading />
  if (error) return <div className="text-center text-red-500 mt-4">{error}</div>
  if (videos.length === 0) return <div className="text-center mt-4">No recommendations available</div>

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Recommended videos</h3>
      <div className="space-y-3">
        {videos.map(video => (
          <VideoListItem key={video._id} video={video} />
        ))}
      </div>
    </div>
  )
}
