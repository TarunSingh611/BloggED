// components/MediaGallery.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { MotionDiv } from '../motion'

interface MediaItem {
  id: string
  title: string
  type: string
  url: string
  thumbnail: string
  size: number
  format: string
  createdAt: string
}

export default function MediaGallery() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/media')
      const data = await response.json()
      setMedia(data)
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Media Gallery</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-md ${view === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-md ${view === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <MotionDiv
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={item.thumbnail || item.url}
                alt={item.title}
                className="object-cover w-full h-full group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-center p-4">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm">{formatFileSize(item.size)}</p>
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {media.map((item) => (
            <MotionDiv
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow"
            >
              <div className="h-16 w-16 flex-shrink-0">
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title}
                  className="h-full w-full object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{item.title}</h4>
                <div className="text-sm text-gray-500 space-x-4">
                  <span>{formatFileSize(item.size)}</span>
                  <span>•</span>
                  <span>{item.format.toUpperCase()}</span>
                  <span>•</span>
                  <span>{format(new Date(item.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-600 hover:text-indigo-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-red-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </MotionDiv>
          ))}
        </div>
      )}
    </div>
  )
}