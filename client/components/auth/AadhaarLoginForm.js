'use client'

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { User, CreditCard, Shield, CheckCircle, ArrowRight, Globe, IdCard, Phone } from 'lucide-react'

export default function AadhaarLoginForm() {
  const [step, setStep] = useState('name') // 'name', 'aadhaar', 'verification', 'details'
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    otp: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [farmerDetails, setFarmerDetails] = useState(null)
  
  const { login } = useAuth()
  const { t, changeLanguage, language, availableLanguages } = useLanguage()

  // Demo farmer database
  const demoFarmers = {
    '123456789012': {
      name: 'राम कुमार शर्मा',
      fatherName: 'श्याम लाल शर्मा',
      village: 'रामपुर',
      district: 'मेरठ',
      state: 'उत्तर प्रदेश',
      rationCard: 'UP1234567890',
      landSize: '2.5 एकड़',
      crops: ['गेहूं', 'धान', 'गन्ना'],
      phone: '9876543210',
      bankAccount: 'SBI-1234567890',
      pmKisan: 'Active'
    },
    '234567890123': {
      name: 'सुनीता देवी',
      fatherName: 'राजेश कुमार',
      village: 'गोकुलपुर',
      district: 'गाजियाबाद',
      state: 'उत्तर प्रदेश',
      rationCard: 'UP2345678901',
      landSize: '1.8 एकड़',
      crops: ['टमाटर', 'आलू', 'प्याज'],
      phone: '9765432109',
      bankAccount: 'PNB-2345678901',
      pmKisan: 'Active'
    },
    '345678901234': {
      name: 'मुकेश पटेल',
      fatherName: 'हरिश्चंद्र पटेल',
      village: 'किसानगंज',
      district: 'बुलंदशहर',
      state: 'उत्तर प्रदेश',
      rationCard: 'UP3456789012',
      landSize: '3.2 एकड़',
      crops: ['मक्का', 'बाजरा', 'सरसों'],
      phone: '9654321098',
      bankAccount: 'BOI-3456789012',
      pmKisan: 'Pending'
    }
  }

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim().length < 3) {
      setError('कृपया अपना पूरा नाम दर्ज करें')
      return
    }
    setError('')
    setStep('aadhaar')
  }

  const handleAadhaarSubmit = (e) => {
    e.preventDefault()
    if (formData.aadhaar.length !== 12) {
      setError('कृपया 12 अंकों का आधार नंबर दर्ज करें')
      return
    }
    
    setLoading(true)
    setError('')
    
    // Simulate API call to fetch farmer details
    setTimeout(() => {
      const details = demoFarmers[formData.aadhaar]
      if (details) {
        setFarmerDetails(details)
        setStep('details')
      } else {
        setError('आधार नंबर से कोई किसान रिकॉर्ड नहीं मिला। कृपया सही आधार नंबर दर्ज करें।')
      }
      setLoading(false)
    }, 2000)
  }

  const handleDetailsConfirm = () => {
    setStep('verification')
  }

  const handleVerification = async (e) => {
    e.preventDefault()
    if (formData.otp.length !== 6) {
      setError('कृपया 6 अंकों का OTP दर्ज करें')
      return
    }
    
    setLoading(true)
    setError('')
    
    // Demo login with farmer details
    const result = await login(farmerDetails.phone, formData.otp, farmerDetails)
    
    if (!result.success) {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatAadhaar = (value) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/)
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ')
    }
    return cleaned
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Language Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  language === lang
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {lang === 'hi' ? 'हिंदी' : lang === 'en' ? 'English' : 'தமிழ்'}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="floating-animation inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <IdCard className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">किसान पोर्टल</h1>
          <p className="text-gray-600 text-lg">आधार आधारित प्रमाणीकरण</p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className={`flex items-center gap-2 ${step === 'name' ? 'text-green-600' : step !== 'name' ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'name' ? 'bg-green-100 border-2 border-green-500' : step !== 'name' ? 'bg-green-500' : 'bg-gray-200'}`}>
                {step !== 'name' ? <CheckCircle className="h-5 w-5 text-white" /> : <span className="text-sm font-bold">1</span>}
              </div>
              <span className="text-sm font-medium">नाम</span>
            </div>
            
            <ArrowRight className="h-4 w-4 text-gray-400" />
            
            <div className={`flex items-center gap-2 ${step === 'aadhaar' ? 'text-green-600' : ['details', 'verification'].includes(step) ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'aadhaar' ? 'bg-green-100 border-2 border-green-500' : ['details', 'verification'].includes(step) ? 'bg-green-500' : 'bg-gray-200'}`}>
                {['details', 'verification'].includes(step) ? <CheckCircle className="h-5 w-5 text-white" /> : <span className="text-sm font-bold">2</span>}
              </div>
              <span className="text-sm font-medium">आधार</span>
            </div>
            
            <ArrowRight className="h-4 w-4 text-gray-400" />
            
            <div className={`flex items-center gap-2 ${step === 'verification' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'verification' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-200'}`}>
                <span className="text-sm font-bold">3</span>
              </div>
              <span className="text-sm font-medium">OTP</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="card shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          {/* Step 1: Name Input */}
          {step === 'name' && (
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">अपना नाम दर्ज करें</h2>
                <p className="text-gray-600 text-sm mt-1">आधार कार्ड के अनुसार पूरा नाम लिखें</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  पूरा नाम (आधार कार्ड के अनुसार)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="input-field text-lg font-medium"
                  placeholder="उदाहरण: राम कुमार शर्मा"
                  required
                />
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                  <div className="text-red-500 text-sm font-medium">{error}</div>
                </div>
              )}
              
              <button
                type="submit"
                className="btn-primary w-full text-lg py-4"
              >
                <div className="flex items-center justify-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  आगे बढ़ें
                </div>
              </button>
            </form>
          )}

          {/* Step 2: Aadhaar Input */}
          {step === 'aadhaar' && (
            <form onSubmit={handleAadhaarSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">आधार नंबर दर्ज करें</h2>
                <p className="text-gray-600 text-sm mt-1">12 अंकों का आधार नंबर</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  आधार नंबर
                </label>
                <input
                  type="text"
                  value={formatAadhaar(formData.aadhaar)}
                  onChange={(e) => updateFormData('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))}
                  className="input-field text-center text-xl font-bold tracking-wider"
                  placeholder="1234 5678 9012"
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  डेमो: 123456789012, 234567890123, 345678901234
                </p>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                  <div className="text-red-500 text-sm font-medium">{error}</div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('name')}
                  className="btn-secondary flex-1 py-4"
                >
                  वापस
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.aadhaar.length !== 12}
                  className="btn-primary flex-1 py-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      खोज रहे हैं...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-5 w-5" />
                      सत्यापित करें
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Farmer Details Display */}
          {step === 'details' && farmerDetails && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">किसान विवरण मिल गया</h2>
                <p className="text-gray-600 text-sm mt-1">कृपया अपनी जानकारी की पुष्टि करें</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">नाम:</span>
                    <p className="font-semibold text-gray-900">{farmerDetails.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">पिता का नाम:</span>
                    <p className="font-semibold text-gray-900">{farmerDetails.fatherName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">गांव:</span>
                    <p className="font-semibold text-gray-900">{farmerDetails.village}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">जिला:</span>
                    <p className="font-semibold text-gray-900">{farmerDetails.district}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">राशन कार्ड:</span>
                    <p className="font-semibold text-gray-900">{farmerDetails.rationCard}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">भूमि:</span>
                    <p className="font-semibold text-gray-900">{farmerDetails.landSize}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="text-gray-600 text-sm">मुख्य फसलें:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {farmerDetails.crops.map((crop, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('aadhaar')}
                  className="btn-secondary flex-1 py-4"
                >
                  वापस
                </button>
                <button
                  onClick={handleDetailsConfirm}
                  className="btn-primary flex-1 py-4"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    पुष्टि करें
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: OTP Verification */}
          {step === 'verification' && (
            <form onSubmit={handleVerification} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">OTP सत्यापन</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {farmerDetails?.phone} पर भेजा गया OTP दर्ज करें
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  6 अंकों का OTP
                </label>
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => updateFormData('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl tracking-widest font-bold"
                  placeholder="● ● ● ● ● ●"
                  required
                />
                <p className="text-xs text-gray-500 mt-3 text-center">
                  डेमो: कोई भी 6 अंकों का कोड उपयोग करें
                </p>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                  <div className="text-red-500 text-sm font-medium">{error}</div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="btn-secondary flex-1 py-4"
                >
                  वापस
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.otp.length !== 6}
                  className="btn-primary flex-1 py-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      लॉगिन हो रहे हैं...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-5 w-5" />
                      लॉगिन करें
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Info */}
        <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            सुरक्षा सुविधाएं
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              आधार आधारित प्रमाणीकरण
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              OTP सत्यापन
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              एन्क्रिप्टेड डेटा
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              बहुभाषी समर्थन
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}