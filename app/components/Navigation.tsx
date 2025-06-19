'use client'

import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { motion } from 'framer-motion'

export default function Navigation() {
  const { t } = useLanguage()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleUploadClick = () => {
    setIsUploadModalOpen(true)
  }

  return (
    <nav className="bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-fame-500 bg-clip-text text-transparent">
              Il Mio Secondo di Fama
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-fame-500 hover:bg-fame-600 rounded-full font-medium transition-colors flex items-center space-x-2"
            >
              <span>📹</span>
              <span>Carica Video (€1/secondo)</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center space-x-2 text-white/80">
              <span>🌍</span>
              <select 
                className="bg-transparent border-none outline-none cursor-pointer"
                defaultValue="it"
              >
                <option value="it">Italiano</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 border border-white/10 rounded-xl p-6 max-w-lg w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Carica il tuo Video</h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <span className="text-4xl mb-4 block">📹</span>
                  <p className="text-white/80 mb-2">
                    Trascina qui il tuo video o clicca per selezionarlo
                  </p>
                  <p className="text-sm text-white/60">
                    Massimo 100MB - Formati supportati: MP4, WebM
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium mb-2">Riepilogo Costi</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Durata Video:</span>
                    <span>-- secondi</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Costo Totale:</span>
                    <span>€-- (€1/secondo)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-white/60 hover:text-white"
                >
                  Annulla
                </button>
                <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-full">
                  Procedi al Pagamento
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </nav>
  )
} 