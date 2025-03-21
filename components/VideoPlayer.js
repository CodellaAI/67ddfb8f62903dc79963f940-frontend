
'use client'

import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'

export default function VideoPlayer({ videoUrl }) {
  const [hasWindow, setHasWindow] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [volume, setVolume] = useState(0.8)
  const [played, setPlayed] = useState(0)
  const [seeking, setSeeking] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true)
    }
  }, [])

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value))
  }

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played)
    }
  }

  const handleSeekMouseDown = () => {
    setSeeking(true)
  }

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value))
  }

  const handleSeekMouseUp = (e) => {
    setSeeking(false)
    // Seek to the position
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat(e.target.value))
    }
  }

  const playerRef = React.useRef(null)

  if (!hasWindow) return null

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        onProgress={handleProgress}
        progressInterval={1000}
        controls={true}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
      />
    </div>
  )
}
