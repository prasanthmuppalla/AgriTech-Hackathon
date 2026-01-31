'use client'

import { Home, Sprout, MessageCircle, Package } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Navigation({ activeTab, setActiveTab }) {
  const { t } = useLanguage()

  const tabs = [
    { id: 'dashboard', icon: Home, label: t('dashboard') },
    { id: 'marketplace', icon: Sprout, label: t('marketplace') },
    { id: 'advisory', icon: MessageCircle, label: t('advisory') },
    { id: 'welfare', icon: Package, label: t('welfare') }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === id
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}