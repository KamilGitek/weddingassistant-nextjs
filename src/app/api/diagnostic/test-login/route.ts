import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

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
      return NextResponse.json({
        success: false,
        error: 'Użytkownik nie został znaleziony',
        details: {
          email,
          userExists: false,
          timestamp: new Date().toISOString()
        }
      })
    }

    // Sprawdzenie hasła
    const isPasswordValid = await bcrypt.compare(password, user.password)

    return NextResponse.json({
      success: isPasswordValid,
      error: isPasswordValid ? null : 'Nieprawidłowe hasło',
      details: {
        email,
        userExists: true,
        passwordValid: isPasswordValid,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          created_at: user.created_at,
          hasProfile: !!user.profile
        },
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Błąd podczas testowania logowania',
        details: error.message 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
