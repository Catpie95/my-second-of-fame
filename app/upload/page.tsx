'use client'

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

interface Schedule {
  days: string[]
  startTime: string
  endTime: string
  timezone: string
}

interface UploadResponse {
  url: string
}

const daysOfWeek = [
  { id: 'Mon', name: 'Lunedì' },
  { id: 'Tue', name: 'Martedì' },
  { id: 'Wed', name: 'Mercoledì' },
  { id: 'Thu', name: 'Giovedì' },
  { id: 'Fri', name: 'Venerdì' },
  { id: 'Sat', name: 'Sabato' },
  { id: 'Sun', name: 'Domenica' },
]

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [price, setPrice] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)

  const router = useRouter()

  const [schedule, setSchedule] = useState<Schedule>({
    days: [],
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'Europe/Rome',
  })

  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      if (videoRef.current) {
        videoRef.current.src = url
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration
      setVideoDuration(duration)
      calculatePrice(duration, schedule.days.length)
    }
  }

  const handleDayToggle = (dayId: string) => {
    const newDays = schedule.days.includes(dayId)
      ? schedule.days.filter((d) => d !== dayId)
      : [...schedule.days, dayId]
    setSchedule({ ...schedule, days: newDays })
    calculatePrice(videoDuration, newDays.length)
  }

  const calculatePrice = (duration: number, numDays: number) => {
    const calculatedPrice = duration * 0.5 * numDays
    setPrice(calculatedPrice)
  }

  const processPayment = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          currency: 'eur',
        }),
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Errore durante il pagamento')
      }

      console.log('Payment processed:', data.message || 'Pagamento completato')
      return true
    } catch (error) {
      console.error('Payment error:', error)
      setUploadMessage(`Errore pagamento: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`)
      return false
    }
  }

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (!videoFile || isUploading || isProcessingPayment) return

    setIsProcessingPayment(true)
    setUploadMessage('Elaborazione pagamento...')

    // 1. Processa il pagamento
    const paymentSuccess = await processPayment()
    if (!paymentSuccess) {
      setIsProcessingPayment(false)
      return
    }

    setIsProcessingPayment(false)
    setIsUploading(true)
    setUploadProgress(0)
    setUploadMessage('Caricamento video...')

    const scheduleQueryParam = encodeURIComponent(JSON.stringify(schedule))
    const url = `/api/upload?filename=${encodeURIComponent(
      videoFile.name
    )}&schedule=${scheduleQueryParam}`

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 5
      })
    }, 200)

    try {
      console.log('Uploading file:', videoFile.name, 'Size:', videoFile.size, 'Type:', videoFile.type)
      
      const response = await fetch(url, {
        method: 'POST',
        body: videoFile,
        headers: {
          'Content-Type': videoFile.type || 'video/mp4',
        },
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Upload error response:', errorData)
        throw new Error(errorData.error || errorData.details || 'Errore durante l\'upload')
      }

      const newBlob = (await response.json()) as UploadResponse
      console.log('Upload success:', newBlob)
      setUploadMessage(`Upload completato! Il tuo video è online.`)
      
      setTimeout(() => {
        router.push('/?upload_success=true')
      }, 2000)

    } catch (error) {
      clearInterval(progressInterval)
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
      setUploadMessage(`Errore: ${errorMessage}`)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <video ref={videoRef} onLoadedMetadata={handleLoadedMetadata} className="hidden" />

      <div className="w-full max-w-2xl mx-auto glass-effect p-8 rounded-lg shadow-2xl fame-glow">
        <h1 className="text-4xl font-bold text-center mb-2 text-gradient">
          Carica il Tuo Secondo di Fama
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Programma la messa in onda del tuo video e diventa una star.
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label htmlFor="video-upload" className="block text-lg font-medium mb-2">
              1. Scegli il tuo video
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fame-500 file:text-white hover:file:bg-fame-600"
              required
            />
            {videoDuration > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Durata del video: {videoDuration.toFixed(2)} secondi.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">2. Programma la Messa in Onda</h2>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleDayToggle(day.id)}
                  className={`py-2 px-1 text-xs sm:text-sm rounded-md transition-all duration-200 ${
                    schedule.days.includes(day.id)
                      ? 'bg-fame-500 text-white fame-glow'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">Costo Totale</h3>
            <p className="text-3xl font-bold text-gradient animate-pulse">
              €{price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Pagamento simulato (modalità test)
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isUploading || isProcessingPayment || !videoFile || schedule.days.length === 0}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isProcessingPayment ? 'Elaborazione Pagamento...' : 
               isUploading ? 'Caricamento...' : 'Paga e Carica'}
            </button>
            {(isUploading || isProcessingPayment || uploadMessage) && (
              <div className="mt-4">
                {(isUploading || isProcessingPayment) && (
                   <div className="w-full bg-gray-700 rounded-full h-2.5">
                     <div
                       className="bg-fame-500 h-2.5 rounded-full transition-all duration-300"
                       style={{ width: `${uploadProgress}%` }}
                     ></div>
                   </div>
                )}
                <p className="text-center mt-2 text-sm">{uploadMessage}</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
} 