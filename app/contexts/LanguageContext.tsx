'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'it' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  it: {
    'hero.title': 'Il Mio Secondo di Fama',
    'hero.subtitle': 'Vendi secondi di un video YouTube che gira 24/7',
    'hero.price': 'Ogni secondo costa €1',
    'hero.description': 'Il video diventa virale per la sua stranezza',
    'nav.home': 'Home',
    'nav.upload': 'Carica Video',
    'nav.buy': 'Compra Secondi',
    'nav.about': 'Chi Siamo',
    'language.italian': 'Italiano',
    'language.english': 'English',
    'upload.title': 'Carica il Tuo Video',
    'upload.description': 'Condividi il tuo momento di fama',
    'upload.dropzone': 'Trascina qui il tuo video o clicca per selezionare',
    'upload.button': 'Carica Video',
    'buy.title': 'Compra i Tuoi Secondi di Fama',
    'buy.description': 'Ogni secondo costa €1. Scegli il tuo momento!',
    'buy.button': 'Compra Ora',
    'footer.copyright': '© 2024 Il Mio Secondo di Fama. Tutti i diritti riservati.',
  },
  en: {
    'hero.title': 'My Second of Fame',
    'hero.subtitle': 'Sell seconds of a YouTube video that runs 24/7',
    'hero.price': 'Each second costs €1',
    'hero.description': 'The video goes viral for its strangeness',
    'nav.home': 'Home',
    'nav.upload': 'Upload Video',
    'nav.buy': 'Buy Seconds',
    'nav.about': 'About',
    'language.italian': 'Italiano',
    'language.english': 'English',
    'upload.title': 'Upload Your Video',
    'upload.description': 'Share your moment of fame',
    'upload.dropzone': 'Drag your video here or click to select',
    'upload.button': 'Upload Video',
    'buy.title': 'Buy Your Seconds of Fame',
    'buy.description': 'Each second costs €1. Choose your moment!',
    'buy.button': 'Buy Now',
    'footer.copyright': '© 2024 My Second of Fame. All rights reserved.',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('it')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 