
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import VideoGrid from '@/components/VideoGrid'
import Loading from '@/components/Loading'
import { useAuth } from '@/context/AuthContext'

export default function ChannelPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true)
        
        // Fetch channel info
        const channelResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`)
        setChannel(channelResponse.data)
        setSubscriberCount(channelResponse.data.subscriberCount)
        
        // Fetch channel videos
        const videosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/user/${id}`)
        setVideos(videosResponse.data)
        
        // Check if logged in user is subscribed to this channel
        if (user) {
          const subscriptionResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/check-subscription/${id}`,
            { withCredentials: true }
          )
          setIsSubscribed(subscriptionResponse.data.isSubscribed)
        }
      } catch (err) {
        console.error('Error fetching channel data:', err)
        setError('Failed to load channel. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchChannelData()
    }
  }, [id, user])

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = `/login?redirect=/channel/${id}`
      return
    }
    
    try {
      if (isSubscribed) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/unsubscribe/${id}`,
          { withCredentials: true }
        )
        setIsSubscribed(false)
        setSubscriberCount(prev => prev - 1)
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/subscribe/${id}`,
          {},
          { withCredentials: true }
        )
        setIsSubscribed(true)
        setSubscriberCount(prev => prev + 1)
      }
    } catch (err) {
      console.error('Error updating subscription:', err)
    }
  }

  if (loading) return <Loading />
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>
  if (!channel) return <div className="text-center mt-10">Channel not found</div>

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative">
        {/* Channel banner */}
        <div className="w-full h-40 bg-gradient-to-r from-purple-800 to-blue-800 rounded-lg"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-4 p-4">
          {/* Channel avatar */}
          <div className="relative w-24 h-24 md:w-28 md:h-28">
            <Image
              src={channel.profilePicture || 'https://yt3.ggpht.com/ytc/AAUvwnjuH8xEZYYnXE9jY9MgHvOy-rQTjYZGXZIBSXny=s88-c-k-c0x00ffffff-no-rj'}
              alt={channel.username}
              width={112}
              height={112}
              className="rounded-full"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{channel.username}</h1>
            <p className="text-gray-400 mt-1">
              {subscriberCount} {subscriberCount === 1 ? 'subscriber' : 'subscribers'} • {videos.length} {videos.length === 1 ? 'video' : 'videos'}
            </p>
            <p className="text-gray-400 mt-2 max-w-2xl">{channel.bio || 'No bio available'}</p>
          </div>
          
          {user && user._id !== id && (
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full font-medium ${
                isSubscribed
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-yt-red hover:bg-red-700'
              } transition duration-200`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Videos</h2>
        {videos.length === 0 ? (
          <p className="text-center py-10 text-gray-400">This channel hasn't uploaded any videos yet.</p>
        ) : (
          <VideoGrid videos={videos} />
        )}
      </div>
    </div>
  )
}
