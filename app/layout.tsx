import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from './contexts/LanguageContext'
import { VideoProvider } from './contexts/VideoContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Il Mio Secondo di Fama',
  description: 'Vendi secondi di un video che gira 24/7',
}

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={lang}>
      <body className={`${inter.className} bg-black text-white`}>
        <LanguageProvider lang={lang}>
          <VideoProvider>
            {children}
          </VideoProvider>
        </LanguageProvider>
      </body>
    </html>
  )
} 