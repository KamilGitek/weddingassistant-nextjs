import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    // Walidacja danych
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Wszystkie pola są wymagane' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Hasło musi mieć co najmniej 6 znaków' },
        { status: 400 }
      )
    }

    // Sprawdzenie czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Użytkownik z tym adresem email już istnieje' },
        { status: 400 }
      )
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 12)

    // Tworzenie użytkownika
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'client',
        profile: {
          create: {
            first_name: firstName,
            last_name: lastName
          }
        }
      },
      include: {
        profile: true
      }
    })

    // Usunięcie hasła z odpowiedzi
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Użytkownik został utworzony pomyślnie',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Błąd serwera podczas rejestracji' },
      { status: 500 }
    )
  }
}

