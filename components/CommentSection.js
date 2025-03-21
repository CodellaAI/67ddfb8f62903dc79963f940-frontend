
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

export default function CommentSection({ videoId }) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/comments`)
        setComments(response.data)
      } catch (err) {
        console.error('Error fetching comments:', err)
        setError('Failed to load comments. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [videoId])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/watch/${videoId}`
      return
    }
    
    if (!commentText.trim()) return
    
    try {
      setSubmitting(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/comments`,
        { content: commentText },
        { withCredentials: true }
      )
      
      setComments(prevComments => [response.data, ...prevComments])
      setCommentText('')
    } catch (err) {
      console.error('Error posting comment:', err)
      alert('Failed to post comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>
      
      {isAuthenticated && (
        <form onSubmit={handleSubmitComment} className="flex mb-6 items-start">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
            <Image
              src={user?.profilePicture || 'https://yt3.ggpht.com/ytc/AAUvwnjuH8xEZYYnXE9jY9MgHvOy-rQTjYZGXZIBSXny=s88-c-k-c0x00ffffff-no-rj'}
              alt={user?.username || 'User'}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent border-b border-gray-700 focus:border-blue-500 outline-none py-1 resize-none"
              rows={1}
            />
            
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setCommentText('')}
                className="px-3 py-1 mr-2 text-sm rounded-full hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!commentText.trim() || submitting}
                className={`px-3 py-1 text-sm rounded-full ${
                  commentText.trim() && !submitting
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </form>
      )}
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-400 py-4">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment._id} className="flex">
              <Link href={`/channel/${comment.user._id}`} className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={comment.user.profilePicture || 'https://yt3.ggpht.com/ytc/AAUvwnjuH8xEZYYnXE9jY9MgHvOy-rQTjYZGXZIBSXny=s88-c-k-c0x00ffffff-no-rj'}
                    alt={comment.user.username}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </Link>
              
              <div>
                <div className="flex items-center">
                  <Link href={`/channel/${comment.user._id}`} className="font-medium mr-2 hover:text-blue-400">
                    {comment.user.username}
                  </Link>
                  <span className="text-gray-400 text-sm">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="mt-1">{comment.content}</p>
                
                <div className="flex items-center mt-2 text-sm text-gray-400">
                  <button className="flex items-center mr-4 hover:text-white">
                    <FiThumbsUp className="mr-1" />
                    {comment.likes > 0 && comment.likes}
                  </button>
                  <button className="flex items-center mr-4 hover:text-white">
                    <FiThumbsDown className="mr-1" />
                  </button>
                  <button className="hover:text-white">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FiThumbsUp(props) {
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
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
    </svg>
  );
}

function FiThumbsDown(props) {
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
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
    </svg>
  );
}
