'use client'

import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

const translations = {
  en: {
    dashboard: 'Dashboard',
    marketplace: 'Marketplace',
    advisory: 'AI Advisory',
    welfare: 'Welfare Services',
    login: 'Login',
    phone: 'Phone Number',
    otp: 'OTP',
    sendOtp: 'Send OTP',
    verify: 'Verify',
    welcome: 'Welcome',
    sellCrops: 'Sell Crops',
    buyProducts: 'Buy Products',
    checkPrices: 'Check Prices',
    groupSelling: 'Group Selling'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    marketplace: 'बाज़ार',
    advisory: 'AI सलाह',
    welfare: 'कल्याण सेवाएं',
    login: 'लॉगिन',
    phone: 'फोन नंबर',
    otp: 'OTP',
    sendOtp: 'OTP भेजें',
    verify: 'सत्यापित करें',
    welcome: 'स्वागत है',
    sellCrops: 'फसल बेचें',
    buyProducts: 'उत्पाद खरीदें',
    checkPrices: 'कीमत देखें',
    groupSelling: 'समूह बिक्री'
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    marketplace: 'சந்தை',
    advisory: 'AI ஆலோசனை',
    welfare: 'நலன் சேவைகள்',
    login: 'உள்நுழைவு',
    phone: 'தொலைபேசி எண்',
    otp: 'OTP',
    sendOtp: 'OTP அனுப்பு',
    verify: 'சரிபார்க்க',
    welcome: 'வரவேற்கிறோம்',
    sellCrops: 'பயிர் விற்க',
    buyProducts: 'பொருட்கள் வாங்க',
    checkPrices: 'விலை பார்க்க',
    groupSelling: 'குழு விற்பனை'
  }
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const t = (key) => {
    return translations[language][key] || key
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const value = {
    language,
    t,
    changeLanguage,
    availableLanguages: Object.keys(translations)
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}