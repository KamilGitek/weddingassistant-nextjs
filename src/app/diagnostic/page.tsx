'use client'

import { useState } from 'react'

export default function DiagnosticPage() {
  const [isTesting, setIsTesting] = useState(false)
  const [password, setPassword] = useState('')
  const [hashedPassword, setHashedPassword] = useState('')
  const [isHashing, setIsHashing] = useState(false)
  const [testResults, setTestResults] = useState<Array<{
    success: boolean
    host: string
    url: string
    error?: string
    tableCount?: number
    userCount?: number
    users?: Array<{
      id: number
      email: string
      role: string
      created_at: string
      status: string
    }>
    modules?: Array<{
      id: number
      name: string
      is_active: boolean
    }>
    timestamp: string
  }>>([])
  const [loginTestResult, setLoginTestResult] = useState<{
    success: boolean
    error?: string
    details?: {
      email: string
      userExists: boolean
      passwordValid?: boolean
      user?: {
        id: number
        email: string
        role: string
        status: string
        created_at: string
        hasProfile: boolean
      }
      timestamp: string
    }
  } | null>(null)
  const [isTestingLogin, setIsTestingLogin] = useState(false)

  const runAllTests = async () => {
    setIsTesting(true)
    setTestResults([])
    
    try {
      const response = await fetch('/api/diagnostic/connection')
      const data = await response.json()
      
      if (data.success) {
        setTestResults(data.results)
      } else {
        console.error('Błąd testów:', data.error)
      }
    } catch (error) {
      console.error('Błąd połączenia z API:', error)
    } finally {
      setIsTesting(false)
    }
  }

  const hashPassword = async () => {
    if (!password) return
    
    setIsHashing(true)
    try {
      const response = await fetch('/api/diagnostic/hash-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, rounds: 10 }),
      })

      const data = await response.json()
      
      if (data.success) {
        setHashedPassword(data.hashedPassword)
      } else {
        console.error('Błąd hashowania:', data.error)
      }
    } catch (error) {
      console.error('Błąd połączenia z API:', error)
    } finally {
      setIsHashing(false)
    }
  }

  const testLogin = async (email: string, password: string) => {
    setIsTestingLogin(true)
    setLoginTestResult(null)
    
    try {
      const response = await fetch('/api/diagnostic/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      setLoginTestResult(data)
    } catch {
      setLoginTestResult({ success: false, error: 'Błąd połączenia z API' })
    } finally {
      setIsTestingLogin(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🔧 Panel Diagnostyczny - Wedding Assistant
          </h1>

          {/* Test połączenia z bazą danych */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              🗄️ Test połączenia z bazą danych
            </h2>
            
            <button
              onClick={runAllTests}
              disabled={isTesting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
            >
              {isTesting ? 'Testowanie...' : 'Uruchom testy połączenia'}
            </button>

            {testResults.length > 0 && (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      result.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">
                        {result.success ? '✅' : '❌'} {result.host}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        result.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.success ? 'DZIAŁA' : 'BŁĄD'}
                      </span>
                    </div>
                    
                    {result.success ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>URL:</strong> {result.url}</p>
                        <p><strong>Liczba tabel:</strong> {result.tableCount}</p>
                        <p><strong>Liczba użytkowników:</strong> {result.userCount}</p>
                        {result.users && result.users.length > 0 && (
                          <div>
                            <p><strong>Użytkownicy w bazie:</strong></p>
                            <ul className="ml-4 list-disc">
                              {result.users.map((user: {
                                id: number
                                email: string
                                role: string
                                created_at: string
                                status: string
                              }) => (
                                <li key={user.id}>
                                  {user.email} ({user.role}) - {new Date(user.created_at).toLocaleDateString()}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-red-600">
                        <p><strong>Błąd:</strong> {result.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generator haseł */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              🔐 Generator zahashowanych haseł
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hasło do zahashowania:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Wprowadź hasło..."
                />
                <button
                  onClick={hashPassword}
                  disabled={!password || isHashing}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isHashing ? 'Hashowanie...' : 'Zahashuj hasło'}
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zahashowane hasło:
                </label>
                <textarea
                  value={hashedPassword}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                  rows={3}
                  placeholder="Zahashowane hasło pojawi się tutaj..."
                />
                {hashedPassword && (
                  <button
                    onClick={() => navigator.clipboard.writeText(hashedPassword)}
                    className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                  >
                    📋 Kopiuj do schowka
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Test logowania */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              🔑 Test logowania
            </h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Uwaga:</strong> Ten test sprawdzi czy API logowania działa poprawnie z aktualną konfiguracją bazy danych.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  defaultValue="admin@weddingassistant.pl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hasło:
                </label>
                <input
                  type="password"
                  placeholder="Wprowadź hasło..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={async () => {
                const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
                const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement
                await testLogin(emailInput.value, passwordInput.value)
              }}
              disabled={isTestingLogin}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isTestingLogin ? 'Testowanie...' : '🧪 Testuj logowanie'}
            </button>

            {loginTestResult && (
              <div className={`mt-4 p-4 rounded-lg border-2 ${
                loginTestResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h4 className="font-semibold text-lg mb-2">
                  {loginTestResult.success ? '✅' : '❌'} Wynik testu logowania
                </h4>
                <div className="text-sm space-y-1">
                  <p><strong>Status:</strong> {loginTestResult.success ? 'SUKCES' : 'BŁĄD'}</p>
                  {loginTestResult.error && (
                    <p><strong>Błąd:</strong> {loginTestResult.error}</p>
                  )}
                  {loginTestResult.details && (
                    <div className="mt-2">
                      <p><strong>Email:</strong> {loginTestResult.details.email}</p>
                      <p><strong>Użytkownik istnieje:</strong> {loginTestResult.details.userExists ? 'TAK' : 'NIE'}</p>
                      {loginTestResult.details.passwordValid !== undefined && (
                        <p><strong>Hasło poprawne:</strong> {loginTestResult.details.passwordValid ? 'TAK' : 'NIE'}</p>
                      )}
                      {loginTestResult.details.user && (
                        <div className="mt-2 p-2 bg-gray-100 rounded">
                          <p><strong>ID:</strong> {loginTestResult.details.user.id}</p>
                          <p><strong>Rola:</strong> {loginTestResult.details.user.role}</p>
                          <p><strong>Status:</strong> {loginTestResult.details.user.status}</p>
                          <p><strong>Utworzony:</strong> {new Date(loginTestResult.details.user.created_at).toLocaleString('pl-PL')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Informacje o środowisku */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              ℹ️ Informacje o środowisku
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Node.js:</strong> {typeof window !== 'undefined' ? 'N/A (client-side)' : process.version}</p>
                  <p><strong>Prisma:</strong> Dostępny</p>
                  <p><strong>bcryptjs:</strong> Dostępny</p>
                </div>
                <div>
                  <p><strong>Środowisko:</strong> {process.env.NODE_ENV || 'development'}</p>
                  <p><strong>Platforma:</strong> {typeof window !== 'undefined' ? 'Browser' : 'Server'}</p>
                  <p><strong>Data:</strong> {new Date().toLocaleString('pl-PL')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instrukcje */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              📋 Instrukcje rozwiązywania problemów
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>1. Problem z połączeniem:</strong> Sprawdź czy host bazy danych jest dostępny i czy dane logowania są poprawne.</p>
              <p><strong>2. Problem z logowaniem:</strong> Upewnij się, że użytkownik istnieje w bazie i hasło jest prawidłowo zahashowane.</p>
              <p><strong>3. Problem z Vercel:</strong> Sprawdź zmienne środowiskowe w panelu Vercel (DATABASE_URL).</p>
              <p><strong>4. Generator haseł:</strong> Użyj do tworzenia nowych haseł lub aktualizacji istniejących w bazie danych.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
