import { put } from '@vercel/blob'
import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

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
  const { searchParams } = new URL(request.url)
  const originalFilename = searchParams.get('filename')
  const scheduleData = searchParams.get('schedule')

  console.log('Original filename:', originalFilename)

  if (!originalFilename || !request.body) {
    return NextResponse.json(
      { error: 'Nome del file o corpo della richiesta mancanti' },
      { status: 400 }
    )
  }

  if (!scheduleData) {
    return NextResponse.json(
      { error: 'Dati di programmazione mancanti' },
      { status: 400 }
    )
  }

  try {
    const schedule = JSON.parse(scheduleData)
    
    // Genera un nome file ultra-semplice per Vercel Blob
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const filename = `video_${timestamp}_${randomId}.mp4`
    
    console.log('Generated filename:', filename)
    console.log('Content-Type:', request.headers.get('content-type'))
    
    // 1. Carica il video su Vercel Blob
    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: 'video/mp4',
    })

    console.log('Blob created successfully:', blob.url)

    // 2. Salva i metadati su Vercel KV
    const videoId = blob.pathname
    const newVideo: VideoData = {
      id: videoId,
      url: blob.url,
      duration: 0,
      uploadedAt: new Date().toISOString(),
      schedule,
      isActive: true,
    }

    await kv.hset('videos', { [videoId]: JSON.stringify(newVideo) })

    // 3. Restituisci i dati del blob e del video
    return NextResponse.json({ success: true, ...blob, videoId })

  } catch (error) {
    console.error('Errore durante l\'upload:', error)
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
    return NextResponse.json(
      { error: 'Errore durante il salvataggio del video', details: errorMessage },
      { status: 500 }
    )
  }
} 