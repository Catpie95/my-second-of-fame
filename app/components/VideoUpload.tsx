'use client'

import React, { useState } from 'react'
import { useVideo } from '../contexts/VideoContext'
import { motion } from 'framer-motion'

export default function VideoUpload() {
  const { addVideo } = useVideo()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Controllo formato e dimensione
    if (!file.type.startsWith('video/')) {
      setError('Per favore carica un file video')
      return
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limite
      setError('Il file è troppo grande. Il limite è 100MB')
      return
    }

    setIsUploading(true)
    setError(null)

    // Creazione FormData per l'upload
    const formData = new FormData()
    formData.append('video', file)

    try {
      // Simulazione upload con progress
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100
            setUploadProgress(Math.round(progress))
          }
        }
      })

      if (!response.ok) {
        throw new Error('Errore durante il caricamento')
      }

      const data = await response.json()
      
      // Aggiungi il video alla playlist
      addVideo({
        id: data.id,
        url: data.url,
        thumbnail: data.thumbnail,
        startTime: 0,
        duration: data.duration,
        owner: 'Nuovo Video', // TODO: Aggiungere nome utente
        logo: '🆕'
      })

      setUploadProgress(0)
      setIsUploading(false)
    } catch (err) {
      setError('Errore durante il caricamento. Riprova più tardi.')
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-8 shadow-xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary-500 to-fame-500 bg-clip-text text-transparent">
          Carica il tuo Video
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            accept="video/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
            <div className="mb-4">
              <span className="text-4xl">📹</span>
            </div>
            <p className="text-white/80 mb-2">
              Trascina qui il tuo video o clicca per selezionarlo
            </p>
            <p className="text-sm text-white/60">
              Massimo 100MB - Formati supportati: MP4, WebM
            </p>
          </div>
        </div>

        {isUploading && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Caricamento in corso...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}