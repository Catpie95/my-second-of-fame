'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VideoPlayer from './components/VideoPlayer'
import Link from 'next/link'

interface Video {
  id: string
  url: string
  duration: number
  uploadedAt: string
  schedule?: {
    days: string[]
    startTime: string
    endTime: string
    timezone: string
  }
  isActive?: boolean
}

export default function Home() {
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const hasLoadedRef = useRef(false)
  
  // Video di default se non ci sono video caricati
  const defaultVideos = [
    '/videos/intro.mp4',
    '/videos/promo.mp4'
  ]

  // Funzione per verificare se un video deve essere mostrato ora
  const isVideoScheduled = (video: Video): boolean => {
    if (!video.schedule || !video.isActive) return true // Video di default sempre attivi
    
    const now = new Date()
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const currentDay = days[now.getDay()]
    const currentTime = now.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })

    // Verifica se oggi è un giorno programmato
    if (!video.schedule.days.includes(currentDay)) {
      return false
    }

    // Verifica se siamo nell'orario programmato
    const startTime = video.schedule.startTime
    const endTime = video.schedule.endTime
    
    return currentTime >= startTime && currentTime <= endTime
  }

  // Filtra i video attivi e programmati
  const getActiveVideos = (): string[] => {
    if (videos.length === 0) return defaultVideos
    
    const activeVideos = videos.filter(isVideoScheduled)
    return activeVideos.map(v => v.url)
  }

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }, [searchParams])

  useEffect(() => {
    // Evita di caricare più volte
    if (hasLoadedRef.current) return
    
    const loadVideos = async () => {
      try {
        const response = await fetch('/api/videos')
        if (response.ok) {
          const videoList = await response.json()
          setVideos(videoList)
        }
      } catch (error) {
        console.error('Errore nel caricamento dei video:', error)
      } finally {
        setIsLoading(false)
        hasLoadedRef.current = true
      }
    }

    loadVideos()
  }, [])

  useEffect(() => {
    const activeVideos = getActiveVideos()
    if (activeVideos.length === 0) return

    // Cambia video ogni 30 secondi, ma solo se ci sono video attivi
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % activeVideos.length)
    }, 30000)

    return () => clearInterval(interval)
  }, [videos])

  // Usa i video attivi e programmati
  const activeVideoList = getActiveVideos()

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full"></div>
      </div>
    )
  }

  // Se non ci sono video attivi, mostra un messaggio
  if (activeVideoList.length === 0) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white/60">
          <p className="text-2xl mb-4">📺</p>
          <p className="text-lg mb-2">Nessun video programmato per ora</p>
          <p className="text-sm">I video appariranno automaticamente negli orari programmati</p>
          <Link
            href="/upload"
            className="inline-block mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
          >
            Carica un Video
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Video Player */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentVideoIndex}-${activeVideoList[currentVideoIndex]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-full h-full"
        >
          <VideoPlayer 
            src={activeVideoList[currentVideoIndex]} 
            className="w-full h-full"
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottone Upload */}
      <Link
        href="/upload"
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 border border-white/10 hover:scale-110"
      >
        <span className="text-3xl opacity-60 hover:opacity-100">📹</span>
      </Link>

      {/* Indicatore Video Attivo */}
      {activeVideoList.length > 1 && (
        <div className="absolute top-6 left-6 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/60 text-sm">
          Video {currentVideoIndex + 1} di {activeVideoList.length}
        </div>
      )}

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-green-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium"
          >
            ✅ Video caricato con successo!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 