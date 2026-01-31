'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import AadhaarLoginForm from '../components/auth/AadhaarLoginForm'
import FarmerDashboard from '../components/FarmerDashboard'

export default function Home() {
  const { user, loading } = useAuth()
  const { t, language } = useLanguage()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AadhaarLoginForm />
  }

  return <FarmerDashboard />
}