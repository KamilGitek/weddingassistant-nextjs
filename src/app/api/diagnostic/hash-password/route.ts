import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { password, rounds = 10 } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Hasło jest wymagane' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Hasło musi być tekstem' },
        { status: 400 }
      )
    }

    if (password.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Hasło musi mieć co najmniej 3 znaki' },
        { status: 400 }
      )
    }

    // Generowanie zahashowanego hasła
    const hashedPassword = await bcrypt.hash(password, rounds)

    // Test weryfikacji hasła
    const isValid = await bcrypt.compare(password, hashedPassword)

    return NextResponse.json({
      success: true,
      originalPassword: password,
      hashedPassword,
      rounds,
      verificationTest: isValid,
      timestamp: new Date().toISOString(),
      info: {
        algorithm: 'bcrypt',
        saltRounds: rounds,
        length: hashedPassword.length
      }
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd'
    return NextResponse.json(
      { 
        success: false, 
        error: 'Błąd podczas hashowania hasła',
        details: errorMessage 
      },
      { status: 500 }
    )
  }
}
