'use client'

import { useLanguage } from '../contexts/LanguageContext'
import { motion } from 'framer-motion'
import { Clock, Euro, Star, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

export default function BuySeconds() {
  const { t } = useLanguage()
  const [selectedSeconds, setSelectedSeconds] = useState(1)
  const [customName, setCustomName] = useState('')
  const [showPayment, setShowPayment] = useState(false)

  const secondsOptions = [1, 5, 10, 30, 60]

  const handleBuy = () => {
    setShowPayment(true)
    // Simulate payment process
    setTimeout(() => {
      setShowPayment(false)
      alert('Acquisto completato! Il tuo secondo di fama è ora attivo!')
    }, 3000)
  }

  return (
    <section id="buy" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">{t('buy.title')}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('buy.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Video Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="card"
          >
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-fame-500/20 animate-pulse-slow"></div>
              <div className="relative z-10 text-center">
                <Clock className="h-16 w-16 mx-auto mb-4 text-primary-400" />
                <p className="text-lg text-gray-300">Video in riproduzione 24/7</p>
                <p className="text-sm text-gray-500 mt-2">Ogni secondo è un'opportunità di fama</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Durata totale: ∞</span>
              <span>Secondi venduti: 1,234</span>
            </div>
          </motion.div>

          {/* Purchase Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="card"
          >
            <h3 className="text-2xl font-bold mb-6">Scegli i tuoi secondi</h3>
            
            {/* Seconds Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Numero di secondi
              </label>
              <div className="grid grid-cols-3 gap-3">
                {secondsOptions.map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => setSelectedSeconds(seconds)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      selectedSeconds === seconds
                        ? 'border-primary-400 bg-primary-500/20 text-primary-400'
                        : 'border-white/20 hover:border-primary-400 text-gray-300'
                    }`}
                  >
                    <div className="text-lg font-bold">{seconds}</div>
                    <div className="text-xs">secondi</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Il tuo nome/logo (opzionale)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Inserisci il tuo nome o logo"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-400"
              />
            </div>

            {/* Price Display */}
            <div className="mb-6 p-4 bg-gradient-to-r from-primary-500/10 to-fame-500/10 rounded-lg border border-primary-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Euro className="h-6 w-6 text-primary-400" />
                  <span className="text-lg font-medium">Prezzo totale:</span>
                </div>
                <div className="text-2xl font-bold text-primary-400">
                  €{selectedSeconds}
                </div>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {selectedSeconds} secondo{selectedSeconds > 1 ? 'i' : ''} × €1
              </div>
            </div>

            {/* Buy Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuy}
              disabled={showPayment}
              className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showPayment ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Elaborazione pagamento...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>{t('buy.button')}</span>
                </div>
              )}
            </motion.button>

            {/* Features */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Star className="h-4 w-4 text-primary-400" />
                <span>Fama istantanea</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Clock className="h-4 w-4 text-fame-400" />
                <span>Disponibile 24/7</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Euro className="h-4 w-4 text-primary-400" />
                <span>Prezzo fisso €1/secondo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 