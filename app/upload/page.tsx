'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface ProgressEvent {
  loaded: number
  total?: number
}

interface ScheduleSettings {
  days: string[]
  startTime: string
  endTime: string
  timezone: string
}

export default function UploadPage() {
  const router = useRouter()
  const [videoDuration, setVideoDuration] = useState(0)
  const [showPaymentTest, setShowPaymentTest] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [schedule, setSchedule] = useState<ScheduleSettings>({
    days: [],
    startTime: '09:00',
    endTime: '18:00',
    timezone: 'Europe/Rome'
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  const daysOfWeek = [
    { value: 'monday', label: 'Lunedì' },
    { value: 'tuesday', label: 'Martedì' },
    { value: 'wednesday', label: 'Mercoledì' },
    { value: 'thursday', label: 'Giovedì' },
    { value: 'friday', label: 'Venerdì' },
    { value: 'saturday', label: 'Sabato' },
    { value: 'sunday', label: 'Domenica' }
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert('Il file è troppo grande. Massimo 100MB.')
        return
      }

      setSelectedFile(file)
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        setVideoDuration(Math.ceil(video.duration))
      }
      video.src = URL.createObjectURL(file)
    }
  }

  const handleDayToggle = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }))
  }

  const calculatePrice = () => {
    const basePrice = videoDuration // €1/secondo
    const daysMultiplier = schedule.days.length
    const timeRange = 24 // Per ora calcoliamo su 24h, poi implementeremo il calcolo reale
    const timeMultiplier = timeRange / 24
    
    return Math.ceil(basePrice * daysMultiplier * timeMultiplier)
  }

  const uploadVideo = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('video', selectedFile)
    formData.append('schedule', JSON.stringify(schedule))

    try {
      // Simula l'upload con XMLHttpRequest per avere il progress
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        
        xhr.upload.onprogress = (event: ProgressEvent) => {
          if (event.total) {
            const progress = (event.loaded / event.total) * 100
            setUploadProgress(Math.round(progress))
          }
        }

        xhr.onload = async () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            console.log('Video caricato:', data)
            resolve(data)
          } else {
            reject(new Error('Errore durante il caricamento'))
          }
        }

        xhr.onerror = () => {
          reject(new Error('Errore di rete'))
        }

        xhr.open('POST', '/api/upload')
        xhr.send(formData)
      })
    } catch (error) {
      console.error('Errore upload:', error)
      alert('Errore durante il caricamento. Riprova.')
      setIsUploading(false)
      return null
    }
  }

  const handleTestPayment = async () => {
    if (schedule.days.length === 0) {
      alert('Seleziona almeno un giorno per la programmazione')
      return
    }

    setShowPaymentTest(true)
    
    // Prima carica il video
    if (selectedFile) {
      const uploadResult = await uploadVideo()
      if (!uploadResult) {
        setShowPaymentTest(false)
        return
      }
    }

    // Simula il pagamento
    setTimeout(() => {
      router.push('/?success=true')
    }, 2000)
  }

  const totalPrice = calculatePrice()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Bottone per tornare alla home */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 border border-white/10"
      >
        <span className="text-2xl opacity-60 hover:opacity-100">←</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-6"
      >
        {/* Area Upload */}
        <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            accept="video/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="pointer-events-none">
            <span className="text-6xl mb-6 block opacity-60">📹</span>
            <p className="text-white/60 text-sm">
              MP4, WebM • Max 100MB
            </p>
            {selectedFile && (
              <p className="text-white/80 mt-4">
                File selezionato: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Progress Upload */}
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-xl p-4"
          >
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Caricamento in corso...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Programmazione Video */}
        {videoDuration > 0 && !showPaymentTest && !isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-2xl p-6"
          >
            <h3 className="text-xl font-medium mb-4">📅 Programmazione Video</h3>
            
            {/* Selezione Giorni */}
            <div className="mb-6">
              <p className="text-white/60 mb-3">Seleziona i giorni di visualizzazione:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day.value}
                    onClick={() => handleDayToggle(day.value)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      schedule.days.includes(day.value)
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selezione Orari */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">Orario di inizio</label>
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => setSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Orario di fine</label>
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => setSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Riepilogo Costi */}
            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex justify-between text-white/60">
                <span>Durata video</span>
                <span>{videoDuration} secondi</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Giorni selezionati</span>
                <span>{schedule.days.length} giorni</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Fascia oraria</span>
                <span>{schedule.startTime} - {schedule.endTime}</span>
              </div>
              <div className="flex justify-between text-xl font-medium border-t border-white/10 pt-3">
                <span>Totale</span>
                <span>€{totalPrice}</span>
              </div>
              <button 
                onClick={handleTestPayment}
                disabled={schedule.days.length === 0}
                className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/40 rounded-xl font-medium transition-colors"
              >
                Procedi al Pagamento
              </button>
              <p className="text-center text-white/40 text-sm mt-2">
                (Modalità Test)
              </p>
            </div>
          </motion.div>
        )}

        {/* Test Payment UI */}
        {showPaymentTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-2xl p-6 text-center"
          >
            <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-white/60">Simulazione Pagamento in corso...</p>
            <p className="text-white/40 text-sm mt-2">
              (Verrai reindirizzato automaticamente)
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 