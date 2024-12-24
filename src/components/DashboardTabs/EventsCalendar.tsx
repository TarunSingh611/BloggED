// components/EventsCalendar.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { MotionDiv } from '../motion'

interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  allDay: boolean
  color: string
}

export default function EventsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate)
      return isSameDay(date, eventStart)
    })
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
        <h3 className="text-lg font-medium">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 rounded-md hover:bg-gray-100"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {getDaysInMonth().map((date) => {
          const dayEvents = getEventsForDate(date)
          return (
            <MotionDiv
              key={date.toISOString()}
              whileHover={{ scale: 1.05 }}
              className={`
                bg-white p-2 min-h-[100px] cursor-pointer
                ${!isSameMonth(date, currentDate) && 'text-gray-400'}
                ${isToday(date) && 'bg-indigo-50'}
                ${selectedDate && isSameDay(date, selectedDate) && 'ring-2 ring-indigo-600'}
              `}
              onClick={() => setSelectedDate(date)}
            >
              <div className="font-medium text-sm">
                {format(date, 'd')}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded truncate"
                    style={{ backgroundColor: event.color + '20', color: event.color }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </MotionDiv>
          )
        })}
      </div>

      {selectedDate && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">
            Events for {format(selectedDate, 'MMMM d, yyyy')}
          </h4>
          <div className="space-y-2">
            {getEventsForDate(selectedDate).map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg shadow-sm border"
                style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-500">
                  {event.allDay
                    ? 'All day'
                    : `${format(new Date(event.startDate), 'h:mm a')} - ${format(
                        new Date(event.endDate),
                        'h:mm a'
                      )}`}
                </div>
                {event.description && (
                  <div className="text-sm text-gray-600 mt-1">
                    {event.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}