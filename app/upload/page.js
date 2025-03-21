
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

export default function UploadPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Entertainment')
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const categories = [
    'Entertainment', 'Music', 'Sports', 'Gaming', 'Education',
    'Science & Technology', 'Travel', 'News', 'Comedy', 'Vlogs'
  ]

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login?redirect=/upload')
    return null
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
    } else {
      setError('Please select a valid video file')
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file)
    } else {
      setError('Please select a valid image file for thumbnail')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title || !description || !videoFile || !thumbnailFile) {
      setError('Please fill all the required fields')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('video', videoFile)
      formData.append('thumbnail', thumbnailFile)
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(percentCompleted)
          },
          withCredentials: true
        }
      )
      
      router.push(`/watch/${response.data._id}`)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.response?.data?.message || 'Failed to upload video. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Video Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Enter video title"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-[120px]"
            placeholder="Enter video description"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="block w-full text-sm text-gray-300
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-yt-light-black file:text-white
                      hover:file:bg-gray-700"
            required
          />
          {videoFile && (
            <p className="mt-2 text-sm text-gray-400">
              Selected: {videoFile.name} ({Math.round(videoFile.size / 1024 / 1024 * 100) / 100} MB)
            </p>
          )}
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Thumbnail Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="block w-full text-sm text-gray-300
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-yt-light-black file:text-white
                      hover:file:bg-gray-700"
            required
          />
          {thumbnailFile && (
            <p className="mt-2 text-sm text-gray-400">
              Selected: {thumbnailFile.name}
            </p>
          )}
        </div>
        
        {loading && (
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-yt-red h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
            <p className="text-sm text-center mt-2">{progress}% Uploaded</p>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary mr-4"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>
    </div>
  )
}
