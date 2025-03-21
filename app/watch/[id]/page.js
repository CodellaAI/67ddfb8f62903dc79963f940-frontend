
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import VideoPlayer from '@/components/VideoPlayer'
import VideoInfo from '@/components/VideoInfo'
import CommentSection from '@/components/CommentSection'
import RecommendedVideos from '@/components/RecommendedVideos'
import Loading from '@/components/Loading'

export default function WatchPage() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}`)
        setVideo(response.data)
        
        // Increment view count
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}/view`)
      } catch (err) {
        console.error('Error fetching video:', err)
        setError('Failed to load video. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVideo()
    }
  }, [id])

  if (loading) return <Loading />
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>
  if (!video) return <div className="text-center mt-10">Video not found</div>

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-2/3">
        <VideoPlayer videoUrl={video.videoUrl} />
        <VideoInfo video={video} />
        <CommentSection videoId={id} />
      </div>
      <div className="lg:w-1/3">
        <RecommendedVideos currentVideoId={id} />
      </div>
    </div>
  )
}
