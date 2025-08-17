import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Pobierz token z nagłówka Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Brak tokenu autoryzacji' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Usuń "Bearer "

    // Znajdź sesję użytkownika
    const session = await prisma.userSession.findFirst({
      where: {
        token: token,
        expires_at: {
          gt: new Date()
        }
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Nieprawidłowy lub wygasły token' },
        { status: 401 }
      )
    }

    // Zwróć dane użytkownika
    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        first_name: session.user.profile?.first_name,
        last_name: session.user.profile?.last_name,
        phone: session.user.profile?.phone,
        address: session.user.profile?.address,
        city: session.user.profile?.city,
        postal_code: session.user.profile?.postal_code,
        country: session.user.profile?.country
      }
    })

  } catch (error) {
    console.error('Błąd podczas pobierania profilu:', error)
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    )
  }
}
