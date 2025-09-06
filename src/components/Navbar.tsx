'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface UserProfile {
  id: number
  email: string
  role: string
  first_name?: string
  last_name?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Dodajemy loading state
  const pathname = usePathname()
  const router = useRouter()

  // Sprawdź czy użytkownik jest zalogowany
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      console.log('🔍 Navbar: Sprawdzam token:', token ? 'Token istnieje' : 'Brak tokenu')
      
      if (token) {
        setIsLoggedIn(true)
        console.log('✅ Navbar: Ustawiam isLoggedIn = true')
        // Pobierz profil użytkownika
        await fetchUserProfile(token)
      } else {
        console.log('❌ Navbar: Brak tokenu, isLoggedIn = false')
        setIsLoggedIn(false)
      }
      setIsLoading(false) // Kończymy loading
    }

    checkAuth()
  }, [])

  const fetchUserProfile = async (token: string) => {
    try {
      console.log('🔍 Navbar: Pobieram profil użytkownika...')
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('📡 Navbar: Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Navbar: Profil pobrany:', data.user)
        setUserProfile(data.user)
      } else {
        console.log('❌ Navbar: Błąd pobierania profilu:', response.status)
        const errorData = await response.json()
        console.log('❌ Navbar: Error details:', errorData)
        // Jeśli token jest nieprawidłowy, usuń go
        localStorage.removeItem('authToken')
        setIsLoggedIn(false)
      }
    } catch (error) {
      console.error('❌ Navbar: Błąd podczas pobierania profilu:', error)
      // W przypadku błędu, usuń token
      localStorage.removeItem('authToken')
      setIsLoggedIn(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setIsLoggedIn(false)
    setUserProfile(null)
    router.push('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Jeśli jeszcze ładujemy, pokaż podstawowy navbar
  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="font-playfair text-2xl font-bold text-gray-800">
                Wedding Assistant
              </span>
            </Link>

            {/* Podstawowa nawigacja podczas ładowania */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-amber-600 transition-colors duration-300 font-medium"
              >
                Strona główna
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-amber-600 transition-colors duration-300 font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" onClick={closeMenu}>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="font-playfair text-2xl font-bold text-gray-800">
              Wedding Assistant
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition-colors duration-300 ${
                pathname === '/' 
                  ? 'text-amber-600 font-semibold' 
                  : 'text-gray-700 hover:text-amber-600'
              }`}
            >
              Strona główna
            </Link>
            <Link 
              href="/dashboard" 
              className={`font-medium transition-colors duration-300 ${
                pathname === '/dashboard' 
                  ? 'text-amber-600 font-semibold' 
                  : 'text-gray-700 hover:text-amber-600'
              }`}
            >
              Dashboard
            </Link>
            {isLoggedIn && userProfile?.role === 'admin' && (
              <Link 
                href="/diagnostic" 
                className={`font-medium transition-colors duration-300 ${
                  pathname === '/diagnostic' 
                    ? 'text-amber-600 font-semibold' 
                    : 'text-gray-700 hover:text-amber-600'
                }`}
              >
                🔧 Diagnostyka
              </Link>
            )}
            
            {/* Warunkowe renderowanie na podstawie stanu logowania */}
            {!isLoggedIn ? (
              <>
                <Link 
                  href="/login" 
                  className="btn btn-secondary"
                >
                  Zaloguj się
                </Link>
                <Link 
                  href="/register" 
                  className="btn btn-primary"
                >
                  Zarejestruj się
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    Witaj, {userProfile?.first_name || 'Użytkowniku'}!
                  </div>
                  <div className="text-xs text-gray-500">
                    {userProfile?.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm px-4 py-2"
                >
                  Wyloguj się
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`font-medium transition-colors duration-300 py-2 ${
                  pathname === '/' 
                    ? 'text-amber-600 font-semibold' 
                    : 'text-gray-700 hover:text-amber-600'
                }`}
                onClick={closeMenu}
              >
                Strona główna
              </Link>
              <Link 
                href="/dashboard" 
                className={`font-medium transition-colors duration-300 py-2 ${
                  pathname === '/dashboard' 
                    ? 'text-amber-600 font-semibold' 
                    : 'text-gray-700 hover:text-amber-600'
                }`}
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              {isLoggedIn && userProfile?.role === 'admin' && (
                <Link 
                  href="/diagnostic" 
                  className={`font-medium transition-colors duration-300 py-2 ${
                    pathname === '/diagnostic' 
                      ? 'text-amber-600 font-semibold' 
                      : 'text-gray-700 hover:text-amber-600'
                  }`}
                  onClick={closeMenu}
                >
                  🔧 Diagnostyka
                </Link>
              )}
              
              {/* Warunkowe renderowanie na mobile */}
              {!isLoggedIn ? (
                <div className="pt-4 space-y-3">
                  <Link 
                    href="/login" 
                    className="btn btn-secondary w-full text-center"
                    onClick={closeMenu}
                  >
                    Zaloguj się
                  </Link>
                  <Link 
                    href="/register" 
                    className="btn btn-primary w-full text-center"
                    onClick={closeMenu}
                  >
                    Zarejestruj się
                  </Link>
                </div>
              ) : (
                <div className="pt-4 space-y-3">
                  <div className="text-center py-2">
                    <div className="text-sm font-medium text-gray-700">
                      Witaj, {userProfile?.first_name || 'Użytkowniku'}!
                    </div>
                    <div className="text-xs text-gray-500">
                      {userProfile?.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary w-full text-center"
                  >
                    Wyloguj się
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
