import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Il Mio Secondo di Fama',
  description: 'Vendi secondi di un video che gira 24/7',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-black text-white h-full w-full`}>
        {children}
      </body>
    </html>
  )
} 