import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'Wedding Assistant - Twój Weselny Asystent',
  description: 'Kompleksowe narzędzie do planowania wymarzonego wesela. Organizuj, planuj i ciesz się każdą chwilą przygotowań.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} ${playfair.variable} font-inter`}>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}
