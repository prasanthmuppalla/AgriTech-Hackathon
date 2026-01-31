'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Store, 
  Package, 
  MessageSquare, 
  Brain, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Users, 
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Wheat,
  ShoppingCart,
  AlertTriangle,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react'

export default function FarmerDashboard() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [selectedFeature, setSelectedFeature] = useState(null)

  const features = [
    {
      id: 'marketplace',
      title: 'डिजिटल मार्केटप्लेस',
      subtitle: 'फसल बेचें और खरीदें',
      icon: Store,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      description: 'सीधे खरीदारों से जुड़ें, बेहतर दाम पाएं',
      features: ['फसल बेचना', 'मार्केट रेट', 'ग्रुप सेलिंग', 'ऑनलाइन पेमेंट']
    },
    {
      id: 'ration',
      title: 'राशन वितरण',
      subtitle: 'डिजिटल राशन सेवा',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      description: 'राशन कार्ड और सरकारी योजनाएं',
      features: ['राशन स्टेटस', 'QR स्कैन', 'सरकारी योजना', 'लाभार्थी सूची']
    },
    {
      id: 'complaints',
      title: 'शिकायत निवारण',
      subtitle: 'समस्या समाधान केंद्र',
      icon: MessageSquare,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      description: 'अपनी समस्याओं का तुरंत समाधान',
      features: ['शिकायत दर्ज करें', 'स्टेटस ट्रैक करें', 'फीडबैक दें', 'हेल्पलाइन']
    },
    {
      id: 'ai-advisory',
      title: 'AI सलाहकार',
      subtitle: 'स्मार्ट खेती सलाह',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      description: 'फसल, मौसम और कीट की जानकारी',
      features: ['फसल सलाह', 'मौसम अपडेट', 'कीट नियंत्रण', 'मिट्टी परीक्षण']
    },
    {
      id: 'financial',
      title: 'वित्तीय सेवाएं',
      subtitle: 'लोन और बीमा',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      description: 'किसान क्रेडिट कार्ड और बीमा',
      features: ['KCC लोन', 'फसल बीमा', 'सब्सिडी', 'बैंक लिंकिंग']
    },
    {
      id: 'documents',
      title: 'दस्तावेज़ केंद्र',
      subtitle: 'डिजिटल दस्तावेज़',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
      description: 'सभी जरूरी कागजात एक जगह',
      features: ['आधार कार्ड', 'राशन कार्ड', 'भूमि रिकॉर्ड', 'बैंक पासबुक']
    }
  ]

  if (selectedFeature) {
    return <FeatureDetail feature={selectedFeature} onBack={() => setSelectedFeature(null)} user={user} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="gradient-bg text-white p-6 shadow-2xl">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">स्वागत है, {user?.name || 'किसान जी'}!</h1>
                <p className="text-white/90 flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  {user?.village}, {user?.district}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={logout}
                className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+15%</span>
            </div>
            <p className="text-sm text-gray-600">इस महीने की आय</p>
            <p className="text-2xl font-bold text-gray-900">₹45,230</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <Wheat className="h-8 w-8 text-orange-500" />
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">रबी</span>
            </div>
            <p className="text-sm text-gray-600">वर्तमान फसल</p>
            <p className="text-2xl font-bold text-gray-900">गेहूं</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <Package className="h-8 w-8 text-blue-500" />
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">उपलब्ध</span>
            </div>
            <p className="text-sm text-gray-600">राशन स्टेटस</p>
            <p className="text-2xl font-bold text-gray-900">5 किलो</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="h-8 w-8 text-purple-500" />
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">आज</span>
            </div>
            <p className="text-sm text-gray-600">मौसम</p>
            <p className="text-2xl font-bold text-gray-900">28°C</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <div
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${feature.bgColor} p-8 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{feature.subtitle}</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {feature.features.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">खोलें</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">त्वरित कार्य</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-2xl transition-all duration-300 hover:scale-105 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold text-gray-900">फसल बेचें</p>
              </div>
            </button>
            
            <button className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl transition-all duration-300 hover:scale-105 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold text-gray-900">राशन चेक करें</p>
              </div>
            </button>
            
            <button className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl transition-all duration-300 hover:scale-105 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold text-gray-900">AI सलाह</p>
              </div>
            </button>
            
            <button className="p-6 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-2xl transition-all duration-300 hover:scale-105 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold text-gray-900">हेल्पलाइन</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Feature Detail Component
function FeatureDetail({ feature, onBack, user }) {
  const IconComponent = feature.icon

  const getFeatureContent = () => {
    switch (feature.id) {
      case 'marketplace':
        return <MarketplaceModule user={user} />
      case 'ration':
        return <RationModule user={user} />
      case 'complaints':
        return <ComplaintsModule user={user} />
      case 'ai-advisory':
        return <AIAdvisoryModule user={user} />
      case 'financial':
        return <FinancialModule user={user} />
      case 'documents':
        return <DocumentsModule user={user} />
      default:
        return <div>Feature coming soon...</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${feature.color} text-white p-6 shadow-2xl`}>
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{feature.title}</h1>
              <p className="text-white/90">{feature.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {getFeatureContent()}
      </div>
    </div>
  )
}

// Marketplace Module
function MarketplaceModule({ user }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">आज के भाव</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span>गेहूं (क्विंटल)</span>
              <span className="font-bold text-green-600">₹2,350</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span>धान (क्विंटल)</span>
              <span className="font-bold text-green-600">₹2,150</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span>टमाटर (किलो)</span>
              <span className="font-bold text-green-600">₹45</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">फसल बेचें</h3>
          <div className="space-y-4">
            <button className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              नई लिस्टिंग बनाएं
            </button>
            <button className="w-full p-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              ग्रुप सेलिंग जॉइन करें
            </button>
            <button className="w-full p-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              मेरी लिस्टिंग देखें
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Ration Module
function RationModule({ user }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">राशन कार्ड विवरण</h3>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl mb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">राशन कार्ड नंबर</p>
              <p className="text-xl font-bold">{user?.rationCard || 'UP1234567890'}</p>
              <p className="text-sm opacity-90 mt-2">श्रेणी: BPL</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">परिवार के सदस्य</p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">मासिक कोटा</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                <span>चावल (5 किलो)</span>
                <span className="text-green-600 font-semibold">उपलब्ध</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                <span>गेहूं (5 किलो)</span>
                <span className="text-green-600 font-semibold">उपलब्ध</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                <span>चीनी (1 किलो)</span>
                <span className="text-orange-600 font-semibold">लिया गया</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">त्वरित कार्य</h4>
            <div className="space-y-3">
              <button className="w-full p-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all">
                QR कोड स्कैन करें
              </button>
              <button className="w-full p-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                नजदीकी दुकान खोजें
              </button>
              <button className="w-full p-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                वितरण इतिहास
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Complaints Module
function ComplaintsModule({ user }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">नई शिकायत दर्ज करें</h3>
          <div className="space-y-4">
            <select className="w-full p-3 border border-gray-300 rounded-xl">
              <option>शिकायत का प्रकार चुनें</option>
              <option>राशन संबंधी</option>
              <option>फसल बीमा</option>
              <option>सब्सिडी</option>
              <option>भूमि रिकॉर्ड</option>
              <option>अन्य</option>
            </select>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-xl h-32" 
              placeholder="अपनी समस्या का विस्तार से वर्णन करें..."
            ></textarea>
            <button className="w-full p-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all">
              शिकायत दर्ज करें
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">मेरी शिकायतें</h3>
          <div className="space-y-3">
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-900">राशन कार्ड अपडेट</span>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">प्रगति में</span>
              </div>
              <p className="text-sm text-gray-600">शिकायत ID: #12345</p>
              <p className="text-xs text-gray-500 mt-1">2 दिन पहले</p>
            </div>
            
            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-900">फसल बीमा क्लेम</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">हल हो गया</span>
              </div>
              <p className="text-sm text-gray-600">शिकायत ID: #12344</p>
              <p className="text-xs text-gray-500 mt-1">1 सप्ताह पहले</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">हेल्पलाइन नंबर</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <Phone className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">किसान हेल्पलाइन</p>
            <p className="text-blue-600 font-bold">1800-180-1551</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl text-center">
            <Phone className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">PM-KISAN</p>
            <p className="text-green-600 font-bold">155261</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl text-center">
            <Phone className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">राशन कार्ड</p>
            <p className="text-orange-600 font-bold">1967</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// AI Advisory Module
function AIAdvisoryModule({ user }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">AI से पूछें</h3>
        <div className="space-y-4">
          <textarea 
            className="w-full p-4 border border-gray-300 rounded-xl h-32" 
            placeholder="अपना सवाल यहाँ लिखें... जैसे: गेहूं की फसल में पीले पत्ते क्यों हो रहे हैं?"
          ></textarea>
          <button className="w-full p-4 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all">
            AI से पूछें
          </button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">मौसम अपडेट</h3>
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🌤️</div>
            <p className="text-2xl font-bold text-gray-900">28°C</p>
            <p className="text-gray-600">आंशिक बादल</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>आर्द्रता:</span>
              <span>65%</span>
            </div>
            <div className="flex justify-between">
              <span>हवा की गति:</span>
              <span>12 km/h</span>
            </div>
            <div className="flex justify-between">
              <span>बारिश की संभावना:</span>
              <span>20%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">फसल सलाह</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <p className="font-semibold text-green-800">गेहूं की फसल</p>
              <p className="text-sm text-green-700">सिंचाई का समय है। मिट्टी में नमी की जांच करें।</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <p className="font-semibold text-yellow-800">कीट चेतावनी</p>
              <p className="text-sm text-yellow-700">माहू के लिए फसल की जांच करें।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Financial Module
function FinancialModule({ user }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">KCC लोन स्टेटस</h3>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl mb-4">
            <p className="text-sm opacity-90">उपलब्ध लिमिट</p>
            <p className="text-2xl font-bold">₹2,50,000</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>उपयोग की गई राशि:</span>
              <span>₹1,20,000</span>
            </div>
            <div className="flex justify-between">
              <span>ब्याज दर:</span>
              <span>4% प्रति वर्ष</span>
            </div>
            <div className="flex justify-between">
              <span>अगली EMI:</span>
              <span>₹8,500</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">फसल बीमा</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="font-semibold text-blue-800">गेहूं - 2024</p>
              <p className="text-sm text-blue-700">बीमा राशि: ₹50,000</p>
              <p className="text-xs text-blue-600">स्टेटस: सक्रिय</p>
            </div>
            <button className="w-full p-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all">
              नया बीमा करवाएं
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Documents Module
function DocumentsModule({ user }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">मेरे दस्तावेज़</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <IdCard className="h-5 w-5 text-green-600" />
                <span>आधार कार्ड</span>
              </div>
              <span className="text-green-600 text-sm">✓ सत्यापित</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-green-600" />
                <span>राशन कार्ड</span>
              </div>
              <span className="text-green-600 text-sm">✓ सत्यापित</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-yellow-600" />
                <span>भूमि रिकॉर्ड</span>
              </div>
              <span className="text-yellow-600 text-sm">⏳ प्रगति में</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">दस्तावेज़ अपलोड करें</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">फ़ाइल चुनें या यहाँ ड्रैग करें</p>
            </div>
            <button className="w-full p-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-all">
              अपलोड करें
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}