import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET() {
  try {
    // Leggi tutti i video dal database KV
    const videosData = await kv.hgetall('videos')
    
    if (!videosData) {
      return NextResponse.json([])
    }

    // Converti i dati dal formato KV al formato array
    const videos = Object.values(videosData).map((videoStr: any) => {
      try {
        return JSON.parse(videoStr)
      } catch {
        return null
      }
    }).filter(Boolean)

    // Filtra solo i video attivi
    const activeVideos = videos.filter((video: any) => {
      // I video senza isActive sono considerati attivi (video di default)
      if (video.isActive === undefined) return true
      return video.isActive
    })

    return NextResponse.json(activeVideos)
  } catch (error) {
    console.error('Errore durante la lettura dei video:', error)
    return NextResponse.json(
      { error: 'Errore durante la lettura dei video' },
      { status: 500 }
    )
  }
} 