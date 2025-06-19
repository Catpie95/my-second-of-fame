import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

interface VideoData {
  id: string
  url: string
  duration: number
  uploadedAt: string
  schedule: {
    days: string[]
    startTime: string
    endTime: string
    timezone: string
  }
  isActive: boolean
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const video = formData.get('video') as File
    const scheduleData = formData.get('schedule') as string
    
    if (!video) {
      return NextResponse.json(
        { error: 'Nessun video caricato' },
        { status: 400 }
      )
    }

    if (!scheduleData) {
      return NextResponse.json(
        { error: 'Dati di programmazione mancanti' },
        { status: 400 }
      )
    }

    const schedule = JSON.parse(scheduleData)

    // Per ora, simuliamo il salvataggio del video
    // In produzione, useresti un servizio come Cloudinary o AWS S3
    const videoId = Date.now().toString()
    const filename = `${videoId}-${video.name}`
    
    // Calcola la durata del video (approssimativa)
    const duration = Math.ceil(video.size / (1024 * 1024)) // Approssimazione basata sulla dimensione

    // Salva i dati nel database Vercel KV
    const newVideo: VideoData = {
      id: videoId,
      url: `/videos/${filename}`, // In produzione, questo sarebbe l'URL del CDN
      duration,
      uploadedAt: new Date().toISOString(),
      schedule,
      isActive: true
    }

    // Salva nel database KV
    await kv.hset('videos', { [videoId]: JSON.stringify(newVideo) })

    // Restituisci il path relativo del video
    return NextResponse.json({ 
      success: true,
      videoPath: `/videos/${filename}`,
      videoId,
      duration,
      schedule
    })

  } catch (error) {
    console.error('Errore durante il salvataggio del video:', error)
    return NextResponse.json(
      { error: 'Errore durante il salvataggio del video' },
      { status: 500 }
    )
  }
} 