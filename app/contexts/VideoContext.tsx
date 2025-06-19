'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface VideoSegment {
  id: string
  url: string
  thumbnail: string
  title: string
  description: string
  startTime: number
  duration: number
  owner: string
  logo?: string
  secondsAvailable: { [key: string]: string | null }
}

interface VideoContextType {
  currentVideo: VideoSegment | null
  playlist: VideoSegment[]
  isPlaying: boolean
  addVideo: (video: VideoSegment) => void
  playNext: () => void
  isLoading: boolean
  error: string | null
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export function VideoProvider({ children }: { children: ReactNode }) {
  const [playlist, setPlaylist] = useState<VideoSegment[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carica i video dal database
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos')
        if (!response.ok) {
          throw new Error('Errore nel caricamento dei video')
        }
        const videos = await response.json()
        setPlaylist(videos)
        setIsLoading(false)
      } catch (err) {
        setError('Errore nel caricamento dei video')
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const addVideo = (video: VideoSegment) => {
    setPlaylist(prev => [...prev, video])
  }

  const playNext = () => {
    setCurrentVideoIndex(prev => (prev + 1) % playlist.length)
  }

  // Effetto per gestire la riproduzione automatica
  useEffect(() => {
    if (isPlaying && playlist.length > 0) {
      const currentVideo = playlist[currentVideoIndex]
      const timer = setTimeout(() => {
        playNext()
      }, currentVideo.duration * 1000)

      return () => clearTimeout(timer)
    }
  }, [currentVideoIndex, isPlaying, playlist])

  const value = {
    currentVideo: playlist[currentVideoIndex] || null,
    playlist,
    isPlaying,
    addVideo,
    playNext,
    isLoading,
    error
  }

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  )
}

export function useVideo() {
  const context = useContext(VideoContext)
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider')
  }
  return context
} 