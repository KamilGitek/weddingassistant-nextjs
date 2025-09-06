import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Walidacja danych
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email i hasło są wymagane' },
        { status: 400 }
      )
    }

    // Znalezienie użytkownika
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy email lub hasło' },
        { status: 401 }
      )
    }

    // Sprawdzenie hasła
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy email lub hasło' },
        { status: 401 }
      )
    }

    // Generowanie tokenu sesji
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dni

    // Zapisanie sesji w bazie
    await prisma.userSession.create({
      data: {
        user_id: user.id,
        token,
        expires_at: expiresAt
      }
    })

    // Usunięcie hasła z odpowiedzi
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Logowanie udane',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Błąd serwera podczas logowania' },
      { status: 500 }
    )
  }
}

