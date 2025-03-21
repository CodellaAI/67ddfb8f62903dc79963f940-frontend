
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { FiThumbsUp, FiThumbsDown, FiShare2, FiDownload, FiMoreHorizontal } from 'react-icons/fi'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

export default function VideoInfo({ video }) {
  const { user, isAuthenticated } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(video.user.subscriberCount || 0)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [likeCount, setLikeCount] = useState(video.likes || 0)
  const [dislikeCount, setDislikeCount] = useState(video.dislikes || 0)

  useEffect(() => {
    // Check if user is subscribed to the channel
    const checkSubscription = async () => {
      if (!isAuthenticated || !user) return
      
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/check-subscription/${video.user._id}`,
          { withCredentials: true }
        )
        setIsSubscribed(response.data.isSubscribed)
      } catch (err) {
        console.error('Error checking subscription:', err)
      }
    }
    
    // Check if user has liked/disliked the video
    const checkLikeStatus = async () => {
      if (!isAuthenticated || !user) return
      
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}/like-status`,
          { withCredentials: true }
        )
        setLiked(response.data.liked)
        setDisliked(response.data.disliked)
      } catch (err) {
        console.error('Error checking like status:', err)
      }
    }
    
    checkSubscription()
    checkLikeStatus()
  }, [isAuthenticated, user, video])

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/watch/${video._id}`
      return
    }
    
    try {
      if (isSubscribed) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/unsubscribe/${video.user._id}`,
          { withCredentials: true }
        )
        setIsSubscribed(false)
        setSubscriberCount(prev => prev - 1)
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/subscribe/${video.user._id}`,
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

  const handleLike = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/watch/${video._id}`
      return
    }
    
    try {
      if (liked) {
        // Unlike
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}/unlike`,
          { withCredentials: true }
        )
        setLiked(false)
        setLikeCount(prev => prev - 1)
      } else {
        // Like
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}/like`,
          {},
          { withCredentials: true }
        )
        setLiked(true)
        setLikeCount(prev => prev + 1)
        
        // If previously disliked, remove dislike
        if (disliked) {
          setDisliked(false)
          setDislikeCount(prev => prev - 1)
        }
      }
    } catch (err) {
      console.error('Error updating like:', err)
    }
  }

  const handleDislike = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/watch/${video._id}`
      return
    }
    
    try {
      if (disliked) {
        // Undislike
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}/undislike`,
          { withCredentials: true }
        )
        setDisliked(false)
        setDislikeCount(prev => prev - 1)
      } else {
        // Dislike
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}/dislike`,
          {},
          { withCredentials: true }
        )
        setDisliked(true)
        setDislikeCount(prev => prev + 1)
        
        // If previously liked, remove like
        if (liked) {
          setLiked(false)
          setLikeCount(prev => prev - 1)
        }
      }
    } catch (err) {
      console.error('Error updating dislike:', err)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Check out this video: ${video.title}`,
        url: window.location.href,
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="mt-4">
      <h1 className="text-xl font-bold">{video.title}</h1>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-2 gap-4">
        <div className="flex items-center">
          <Link href={`/channel/${video.user._id}`} className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={video.user.profilePicture || 'https://yt3.ggpht.com/ytc/AAUvwnjuH8xEZYYnXE9jY9MgHvOy-rQTjYZGXZIBSXny=s88-c-k-c0x00ffffff-no-rj'}
                alt={video.user.username}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{video.user.username}</p>
              <p className="text-gray-400 text-sm">{subscriberCount} {subscriberCount === 1 ? 'subscriber' : 'subscribers'}</p>
            </div>
          </Link>
          
          <button
            onClick={handleSubscribe}
            className={`ml-4 px-4 py-2 rounded-full font-medium ${
              isSubscribed 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-yt-red hover:bg-red-700'
            } transition duration-200`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex rounded-full bg-yt-light-black overflow-hidden">
            <button 
              onClick={handleLike}
              className={`flex items-center px-4 py-2 ${liked ? 'text-blue-500' : 'hover:bg-gray-700'}`}
            >
              <FiThumbsUp className="mr-2" />
              {likeCount > 0 && likeCount}
            </button>
            <div className="w-px bg-gray-700 h-full"></div>
            <button 
              onClick={handleDislike}
              className={`flex items-center px-4 py-2 ${disliked ? 'text-blue-500' : 'hover:bg-gray-700'}`}
            >
              <FiThumbsDown />
              {dislikeCount > 0 && dislikeCount}
            </button>
          </div>
          
          <button 
            onClick={handleShare}
            className="flex items-center px-4 py-2 rounded-full bg-yt-light-black hover:bg-gray-700"
          >
            <FiShare2 className="mr-2" />
            Share
          </button>
          
          <button className="flex items-center px-4 py-2 rounded-full bg-yt-light-black hover:bg-gray-700">
            <FiDownload className="mr-2" />
            Download
          </button>
          
          <button className="p-2 rounded-full bg-yt-light-black hover:bg-gray-700">
            <FiMoreHorizontal />
          </button>
        </div>
      </div>
      
      <div className="mt-4 bg-yt-light-black rounded-lg p-3">
        <div className="flex text-sm text-gray-400 mb-2">
          <span>{video.views} views</span>
          <span className="mx-1">•</span>
          <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          {video.category && (
            <>
              <span className="mx-1">•</span>
              <span>{video.category}</span>
            </>
          )}
        </div>
        
        <div className={`text-sm ${expanded ? '' : 'line-clamp-2'}`}>
          {video.description}
        </div>
        
        {video.description && video.description.length > 100 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-500 mt-1"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  )
}
