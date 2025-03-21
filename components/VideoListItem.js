
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

export default function VideoListItem({ video }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 hover:bg-yt-light-black p-2 rounded-lg transition duration-200">
      <Link href={`/watch/${video._id}`} className="md:w-96 flex-shrink-0">
        <div className="relative pb-[56.25%] md:pb-0 md:h-full">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover rounded-lg"
          />
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </Link>
      
      <div className="flex-1">
        <Link href={`/watch/${video._id}`}>
          <h3 className="font-medium text-lg mb-2 hover:text-blue-400">
            {video.title}
          </h3>
        </Link>
        
        <div className="text-gray-400 text-sm mb-2">
          {video.views} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
        </div>
        
        <Link href={`/channel/${video.user._id}`} className="flex items-center mb-3">
          <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
            <Image
              src={video.user.profilePicture || 'https://yt3.ggpht.com/ytc/AAUvwnjuH8xEZYYnXE9jY9MgHvOy-rQTjYZGXZIBSXny=s88-c-k-c0x00ffffff-no-rj'}
              alt={video.user.username}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span className="text-gray-400 text-sm hover:text-gray-300">
            {video.user.username}
          </span>
        </Link>
        
        <p className="text-gray-400 text-sm line-clamp-2">
          {video.description}
        </p>
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
