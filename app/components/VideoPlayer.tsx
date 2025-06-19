'use client'

import React, { useRef, useEffect, useState } from 'react'

interface VideoPlayerProps {
  src: string
  className?: string
}

export default function VideoPlayer({ src, className = '' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoAspectRatio, setVideoAspectRatio] = useState(16/9)
  const [containerAspectRatio, setContainerAspectRatio] = useState(16/9)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current

    if (!video || !container) return

    console.log('VideoPlayer: Caricamento video:', src)

    const handleLoadedMetadata = () => {
      console.log('VideoPlayer: Metadata caricati per:', src)
      const videoWidth = video.videoWidth
      const videoHeight = video.videoHeight
      const aspectRatio = videoWidth / videoHeight
      setVideoAspectRatio(aspectRatio)

      // Calcola l'aspect ratio del container
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      const containerAspect = containerWidth / containerHeight
      setContainerAspectRatio(containerAspect)

      setVideoLoaded(true)
      setVideoError(null)

      // Strategia 1: Prova autoplay con audio
      const playWithAudio = async () => {
        try {
          video.muted = false
          video.volume = 0.5
          await video.play()
          console.log('Audio attivato con successo!')
          setAudioBlocked(false)
        } catch (error) {
          console.log('Autoplay con audio bloccato, riprovo con strategie alternative:', error)
          
          // Strategia 2: Prova con volume basso
          try {
            video.volume = 0.1
            await video.play()
            console.log('Audio attivato con volume basso!')
            setAudioBlocked(false)
          } catch (error2) {
            console.log('Anche volume basso bloccato, riprovo con muted:', error2)
            
            // Strategia 3: Fallback con muted
            video.muted = true
            await video.play()
            setAudioBlocked(true)
          }
        }
      }

      playWithAudio()
    }

    const handleUserInteraction = () => {
      if (!userInteracted && video) {
        setUserInteracted(true)
        // Quando l'utente interagisce, prova ad attivare l'audio
        video.muted = false
        video.volume = 0.5
        video.play().catch(() => {
          console.log('Audio ancora bloccato dopo interazione utente')
        })
      }
    }

    const handleError = (e: Event) => {
      console.error('VideoPlayer: Errore nel caricamento del video:', src, e)
      setVideoError('Errore nel caricamento del video')
      setVideoLoaded(false)
    }

    const handleResize = () => {
      if (container) {
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        const containerAspect = containerWidth / containerHeight
        setContainerAspectRatio(containerAspect)
      }
    }

    // Aggiungi event listeners per interazione utente
    const events = ['click', 'touchstart', 'keydown', 'mousedown']
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true })
    })

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('error', handleError)
    window.addEventListener('resize', handleResize)

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction)
      })
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('error', handleError)
      window.removeEventListener('resize', handleResize)
    }
  }, [src, userInteracted])

  // Determina se il video è più largo o più alto del container
  const isVideoWider = videoAspectRatio > containerAspectRatio
  const isVideoTaller = videoAspectRatio < containerAspectRatio

  const handleVideoClick = () => {
    const video = videoRef.current
    if (video && audioBlocked) {
      // Prova ad attivare l'audio quando l'utente clicca
      video.muted = false
      video.volume = 0.5
      video.play().then(() => {
        setAudioBlocked(false)
      }).catch(() => {
        console.log('Audio ancora bloccato dopo click')
      })
    }
  }

  if (videoError) {
    return (
      <div className={`relative w-full h-full bg-black flex items-center justify-center ${className}`}>
        <div className="text-white/60 text-center">
          <p>Errore nel caricamento del video</p>
          <p className="text-sm mt-2">{src}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {/* Video principale */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        playsInline
        onClick={handleVideoClick}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 cursor-pointer ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          objectPosition: isVideoWider ? 'center' : 'center',
          transform: isVideoWider 
            ? `scale(${containerAspectRatio / videoAspectRatio})`
            : `scale(${videoAspectRatio / containerAspectRatio})`
        }}
      />

      {/* Overlay di blur per riempire gli spazi vuoti */}
      {videoLoaded && (
        <>
          {/* Blur laterale per video verticali */}
          {isVideoTaller && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center blur-sm"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundPosition: 'center',
                  transform: `scale(${videoAspectRatio / containerAspectRatio})`,
                  zIndex: -1
                }}
              />
              <div className="absolute inset-0 bg-black/20" />
            </>
          )}

          {/* Blur superiore/inferiore per video orizzontali */}
          {isVideoWider && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center blur-sm"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundPosition: 'center',
                  transform: `scale(${containerAspectRatio / videoAspectRatio})`,
                  zIndex: -1
                }}
              />
              <div className="absolute inset-0 bg-black/20" />
            </>
          )}
        </>
      )}

      {/* Indicatore Audio Bloccato con Pulsante */}
      {audioBlocked && (
        <div 
          onClick={handleVideoClick}
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white/80 text-sm cursor-pointer hover:bg-black/70 transition-colors"
        >
          🔇 Clicca per attivare audio
        </div>
      )}

      {/* Loading indicator */}
      {!videoLoaded && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full"></div>
        </div>
      )}
    </div>
  )
} 