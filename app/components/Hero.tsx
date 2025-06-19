'use client'

import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { motion } from 'framer-motion'
import { Play, Star, TrendingUp } from 'lucide-react'
import VideoPlayer from './VideoPlayer'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fame-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="text-gradient">{t('hero.title')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <VideoPlayer />
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 text-2xl font-bold text-primary-400">
              <Star className="h-8 w-8 animate-bounce-slow" />
              <span>{t('hero.price')}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-lg text-gray-300">
              <TrendingUp className="h-6 w-6" />
              <span>{t('hero.description')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              <Play className="inline-block mr-2 h-6 w-6" />
              {t('buy.button')}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              {t('upload.button')}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-400 mb-2">24/7</div>
            <div className="text-gray-300">Video Continuo</div>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl font-bold text-fame-400 mb-2">€1</div>
            <div className="text-gray-300">Per Secondo</div>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-400 mb-2">∞</div>
            <div className="text-gray-300">Possibilità</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 