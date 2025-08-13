import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-transparent opacity-30"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-playfair font-bold text-gray-800 mb-8 fade-in-up">
            Twój <span className="text-gold">Weselny Asystent</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto fade-in-up">
            Kompleksowe narzędzie do planowania wymarzonego wesela. Organizuj, planuj i ciesz się każdą chwilą przygotowań.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up">
            <Link href="/register" className="btn btn-primary btn-large">
              Rozpocznij za darmo
            </Link>
            <Link href="/dashboard" className="btn btn-secondary btn-large">
              Zobacz demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-6">
              Wszystko w jednym miejscu
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nasze moduły pomogą Ci zorganizować każdy aspekt przygotowań do wesela
            </p>
          </div>
          
          <div className="grid-3">
            <div className="card card-feature fade-in-up">
              <div className="icon">📅</div>
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                Planowanie czasu
              </h3>
              <p className="text-gray-600">
                Twórz harmonogramy, ustawiaj przypomnienia i śledź postępy w przygotowaniach.
              </p>
            </div>
            
            <div className="card card-feature fade-in-up">
              <div className="icon">💰</div>
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                Zarządzanie budżetem
              </h3>
              <p className="text-gray-600">
                Kontroluj wydatki, planuj koszty i trzymaj się założonego budżetu weselnego.
              </p>
            </div>
            
            <div className="card card-feature fade-in-up">
              <div className="icon">👥</div>
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                Lista gości
              </h3>
              <p className="text-gray-600">
                Zarządzaj listą gości, śledź potwierdzenia i organizuj miejsca przy stole.
              </p>
            </div>
            
            <div className="card card-feature fade-in-up">
              <div className="icon">🎵</div>
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                Muzyka i rozrywka
              </h3>
              <p className="text-gray-600">
                Twórz playlisty, planuj rozrywkę i organizuj atrakcje dla gości.
              </p>
            </div>
            
            <div className="card card-feature fade-in-up">
              <div className="icon">🍽️</div>
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                Menu i catering
              </h3>
              <p className="text-gray-600">
                Planuj menu, organizuj degustacje i koordynuj usługi cateringowe.
              </p>
            </div>
            
            <div className="card card-feature fade-in-up">
              <div className="icon">📋</div>
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                Listy kontrolne
              </h3>
              <p className="text-gray-600">
                Gotowe szablony i personalizowane listy kontrolne dla każdego etapu przygotowań.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-amber-500 to-amber-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-8">
            Gotowy na wymarzone wesele?
          </h2>
          <p className="text-xl text-amber-100 mb-12 max-w-2xl mx-auto">
            Dołącz do tysięcy par, które już ufają naszemu asystentowi w organizacji ich najważniejszego dnia.
          </p>
          <Link href="/register" className="btn bg-white text-amber-700 hover:bg-gray-100 btn-large">
            Rozpocznij teraz
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid-4 text-center">
            <div className="fade-in-up">
              <div className="text-4xl md:text-5xl font-playfair font-bold text-amber-600 mb-2">
                10,000+
              </div>
              <p className="text-gray-600">Zadowolonych par</p>
            </div>
            
            <div className="fade-in-up">
              <div className="text-4xl md:text-5xl font-playfair font-bold text-amber-600 mb-2">
                98%
              </div>
              <p className="text-gray-600">Sukcesu w organizacji</p>
            </div>
            
            <div className="fade-in-up">
              <div className="text-4xl md:text-5xl font-playfair font-bold text-amber-600 mb-2">
                24/7
              </div>
              <p className="text-gray-600">Wsparcie techniczne</p>
            </div>
            
            <div className="fade-in-up">
              <div className="text-4xl md:text-5xl font-playfair font-bold text-amber-600 mb-2">
                50+
              </div>
              <p className="text-gray-600">Funkcji i modułów</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
