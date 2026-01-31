'use client'

import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { TrendingUp, Users, Package, AlertCircle, Zap, Award, Target, Calendar } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Header */}
      <div className="gradient-bg text-white p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('welcome')}, {user?.name || 'Farmer'}! 👋
            </h1>
            <p className="text-white/90 text-lg">Ready to grow your farming success</p>
          </div>
          <div className="floating-animation">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="feature-card bg-gradient-to-br from-green-50 to-green-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
              +12%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">This Month Earnings</p>
          <p className="text-2xl font-bold text-gray-900">₹45,230</p>
        </div>
        
        <div className="feature-card bg-gradient-to-br from-blue-50 to-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">
              Active
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Group Sales</p>
          <p className="text-2xl font-bold text-gray-900">12</p>
        </div>

        <div className="feature-card bg-gradient-to-br from-purple-50 to-purple-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">
              4.8★
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Rating</p>
          <p className="text-2xl font-bold text-gray-900">Excellent</p>
        </div>

        <div className="feature-card bg-gradient-to-br from-orange-50 to-orange-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-medium">
              85%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Goal Progress</p>
          <p className="text-2xl font-bold text-gray-900">₹50K</p>
        </div>
      </div>

      {/* Weather Alert */}
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-yellow-800 text-lg">Weather Alert</h3>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-medium">
                Active
              </span>
            </div>
            <p className="text-yellow-700 mb-3">
              Light rain expected tomorrow (5mm). Consider covering sensitive crops and ensure proper drainage.
            </p>
            <div className="flex gap-2">
              <button className="text-sm bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-4 py-2 rounded-xl font-medium transition-colors">
                View Details
              </button>
              <button className="text-sm bg-white hover:bg-gray-50 text-yellow-700 px-4 py-2 rounded-xl font-medium transition-colors border border-yellow-200">
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary-600" />
            Recent Activity
          </h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Tomato sale completed</p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="font-medium text-green-600">₹2,340</span>
                <span>•</span>
                <span>2 hours ago</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                Completed
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Price alert: Rice +5%</p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>Market update</span>
                <span>•</span>
                <span>4 hours ago</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">
                Price Alert
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">AI recommendation received</p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>Crop planning advice</span>
                <span>•</span>
                <span>6 hours ago</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">
                AI Advisory
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary-600" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 rounded-2xl transition-all duration-300 hover:scale-105 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📱</span>
              </div>
              <p className="font-semibold text-gray-900">Scan QR</p>
              <p className="text-xs text-gray-600 mt-1">Quick verification</p>
            </div>
          </button>
          
          <button className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl transition-all duration-300 hover:scale-105 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">💬</span>
              </div>
              <p className="font-semibold text-gray-900">Ask AI</p>
              <p className="text-xs text-gray-600 mt-1">Get farming advice</p>
            </div>
          </button>
          
          <button className="p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-2xl transition-all duration-300 hover:scale-105 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
              <p className="font-semibold text-gray-900">View Prices</p>
              <p className="text-xs text-gray-600 mt-1">Market rates</p>
            </div>
          </button>
          
          <button className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-2xl transition-all duration-300 hover:scale-105 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🚚</span>
              </div>
              <p className="font-semibold text-gray-900">Track Order</p>
              <p className="text-xs text-gray-600 mt-1">Delivery status</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}