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
    
    // Genera un nome file sicuro per Vercel Blob
    const timestamp = Date.now()
    const safeName = originalFilename
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Sostituisce caratteri speciali con underscore
      .replace(/_{2,}/g, '_') // Rimuove underscore multipli
      .replace(/^_|_$/g, '') // Rimuove underscore all'inizio e alla fine
    
    const filename = `${timestamp}-${safeName}`
    
    // 1. Carica il video su Vercel Blob
    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: 'video/mp4',
    })

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