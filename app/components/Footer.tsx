'use client'

import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { motion } from 'framer-motion'
import { Heart, Star, TrendingUp } from 'lucide-react'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-black/50 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient mb-4">
              {t('hero.title')}
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              La piattaforma rivoluzionaria che ti permette di vendere secondi di un video YouTube che gira 24/7. 
              Ogni secondo costa €1 e puoi mettere il tuo nome/logo.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Star className="h-4 w-4 text-primary-400" />
                <span>Fama Garantita</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <TrendingUp className="h-4 w-4 text-fame-400" />
                <span>Viral 24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Link Rapidi</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#upload" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Carica Video
                </a>
              </li>
              <li>
                <a href="#buy" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Compra Secondi
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Chi Siamo
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contatti</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@miosecondodifama.com</li>
              <li>Tel: +39 123 456 7890</li>
              <li>Orari: 24/7</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 animate-pulse" />
            <span>for fame</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 