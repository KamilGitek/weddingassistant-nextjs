'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  id: number
  email: string
  profile?: {
    first_name: string
    last_name: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Pobranie danych użytkownika z localStorage
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (userData && token) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
            Dostęp zabroniony
          </h2>
          <p className="text-gray-600 mb-6">
            Musisz się zalogować, aby uzyskać dostęp do dashboard.
          </p>
          <Link href="/login" className="btn btn-primary">
            Zaloguj się
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-6">
            Witaj, {user.profile?.first_name || 'Użytkowniku'}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Twój osobisty asystent do planowania wymarzonego wesela. Oto co możesz zrobić:
          </p>
        </div>

        {/* User Info Card */}
        <div className="card max-w-2xl mx-auto mb-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">
              {user.profile?.first_name?.[0] || user.email[0].toUpperCase()}
            </span>
          </div>
          <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-2">
            {user.profile?.first_name} {user.profile?.last_name}
          </h3>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Aktywny
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid-3 mb-16">
          <div className="card text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">0</div>
            <p className="text-gray-600">Aktywnych zadań</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">0</div>
            <p className="text-gray-600">Ukończonych zadań</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">0</div>
            <p className="text-gray-600">Dni do wesela</p>
          </div>
        </div>

        {/* Available Modules */}
        <div className="mb-16">
          <h2 className="text-3xl font-playfair font-bold text-gray-800 text-center mb-12">
            Dostępne moduły
          </h2>
          <div className="grid-3">
            <div className="card text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">
                Planowanie czasu
              </h3>
              <p className="text-gray-600 mb-4">
                Twórz harmonogramy i śledź postępy w przygotowaniach.
              </p>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Dostępny
              </span>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">
                Zarządzanie budżetem
              </h3>
              <p className="text-gray-600 mb-4">
                Kontroluj wydatki i planuj koszty weselne.
              </p>
              <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Wkrótce
              </span>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">
                Lista gości
              </h3>
              <p className="text-gray-600 mb-4">
                Zarządzaj listą gości i organizuj miejsca przy stole.
              </p>
              <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Wkrótce
              </span>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">
                Muzyka i rozrywka
              </h3>
              <p className="text-gray-600 mb-4">
                Twórz playlisty i planuj rozrywkę dla gości.
              </p>
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                Planowany
              </span>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">
                Menu i catering
              </h3>
              <p className="text-gray-600 mb-4">
                Planuj menu i koordynuj usługi cateringowe.
              </p>
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                Planowany
              </span>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">
                Listy kontrolne
              </h3>
              <p className="text-gray-600 mb-4">
                Gotowe szablony i personalizowane listy kontrolne.
              </p>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Dostępny
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-8">
            Szybkie akcje
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary btn-large">
              Utwórz nowe zadanie
            </button>
            <button className="btn btn-secondary btn-large">
              Dodaj wydatek
            </button>
            <button className="btn btn-secondary btn-large">
              Zaplanuj spotkanie
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
