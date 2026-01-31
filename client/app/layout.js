'use client'

import './globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'
import { AuthProvider } from '../contexts/AuthContext'
import { LanguageProvider } from '../contexts/LanguageContext'

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="description" content="Unified Agritech & Rural Services Platform" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Sans+Tamil:wght@400;500;600&display=swap" rel="stylesheet" />
        <title>Agritech Rural Platform</title>
      </head>
      <body className="bg-gray-50 min-h-screen">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}