// components/DashboardTabs.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tab } from '@headlessui/react'
import PostsList from './PostsList'
import MediaGallery from './MediaGallery'
import DocumentsList from './DocumentsList'
import EventsCalendar from './EventsCalendar'
import { MotionDiv } from '../motion'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardTabs() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const tabs = [
    { name: 'Posts', component: <PostsList /> },
    { name: 'Media', component: <MediaGallery /> },
    { name: 'Documents', component: <DocumentsList /> },
    { name: 'Events', component: <EventsCalendar /> },
  ]

  return (
    <div className="w-full px-2 sm:px-0">
      <Tab.Group
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <AnimatePresence mode="wait">
            {tabs.map((tab, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2'
                )}
              >
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.component}
                </MotionDiv>
              </Tab.Panel>
            ))}
          </AnimatePresence>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}