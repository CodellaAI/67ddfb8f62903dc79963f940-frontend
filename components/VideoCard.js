
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

export default function VideoCard({ video }) {
  return (
    <div className="video-card">
      <Link href={`/watch/${video._id}`}>
        <div className="relative pb-[56.25%]">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover rounded-t-lg"
          />
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-3 flex">
        <Link href={`/channel/${video.user._id}`} className="flex-shrink-0 mr-3">
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image
              src={video.user.profilePicture || 'https://yt3.ggpht.com/ytc/AAUvwnjuH8xEZYYnXE9jY9MgHvOy-rQTjYZGXZIBSXny=s88-c-k-c0x00ffffff-no-rj'}
              alt={video.user.username}
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
        </Link>
        
        <div>
          <Link href={`/watch/${video._id}`}>
            <h3 className="font-medium text-sm line-clamp-2 mb-1 hover:text-blue-400">
              {video.title}
            </h3>
          </Link>
          
          <Link href={`/channel/${video.user._id}`} className="text-gray-400 text-sm hover:text-gray-300">
            {video.user.username}
          </Link>
          
          <div className="text-gray-400 text-xs">
            {video.views} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDuration(seconds) {
  if (!seconds) return '0:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
