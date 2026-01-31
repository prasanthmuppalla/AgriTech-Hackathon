'use client'

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Phone, MessageSquare, Globe, Shield, Smartphone, Key } from 'lucide-react'

export default function LoginForm() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone') // 'phone' or 'otp'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const { t, changeLanguage, language, availableLanguages } = useLanguage()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    
    setLoading(true)
    setError('')
    
    // Simulate OTP sending
    setTimeout(() => {
      setStep('otp')
      setLoading(false)
    }, 1000)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }
    
    setLoading(true)
    setError('')
    
    const result = await login(phone, otp)
    
    if (!result.success) {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  language === lang
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div className="floating-animation inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Smartphone className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Agritech Platform</h1>
          <p className="text-gray-600 text-lg">Your farming companion</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
            <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
          </div>
        </div>

        {/* Login Form */}
        <div className="card shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Enter Phone Number</h2>
                <p className="text-gray-600 text-sm mt-1">We'll send you a verification code</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('phone')}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-500 font-medium">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="input-field pl-16 text-lg font-medium"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                  <div className="flex items-center">
                    <div className="text-red-500 text-sm font-medium">{error}</div>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="btn-primary w-full text-lg py-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {t('sendOtp')}
                  </div>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Key className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Verify OTP</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Code sent to +91 {phone}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Enter 6-digit verification code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl tracking-widest font-bold"
                  placeholder="● ● ● ● ● ●"
                  required
                />
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Demo: Use any 6-digit code
                </p>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                  <div className="text-red-500 text-sm font-medium">{error}</div>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="btn-primary w-full text-lg py-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-5 w-5" />
                      {t('verify')}
                    </div>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="btn-secondary w-full text-lg py-4"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-5 w-5" />
                    Change Number
                  </div>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Features */}
        <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-600" />
            Security Features
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              SMS OTP verification
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              JWT authentication
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Encrypted transmission
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Multi-language support
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Demo Instructions
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
              Use any 10-digit phone number
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
              Enter any 6-digit OTP to login
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
              Try different languages using buttons above
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}