import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from './contexts/LanguageContext'
import { VideoProvider } from './contexts/VideoContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Il Mio Secondo di Fama',
  description: 'Vendi secondi di un video YouTube che gira 24/7 - Ogni secondo costa €1',
  keywords: ['video', 'fama', 'youtube', 'viral', 'secondi', 'fame'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <LanguageProvider>
          <VideoProvider>
            {children}
          </VideoProvider>
        </LanguageProvider>
      </body>
    </html>
  )
} 