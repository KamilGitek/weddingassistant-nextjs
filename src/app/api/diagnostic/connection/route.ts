import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Konfiguracje do przetestowania
    const configs = [
      {
        name: 'localhost',
        url: 'mysql://srv91710_weddingassistant:XaHtW5sgq42MhtgGjPUh@localhost:3306/srv91710_weddingassistant'
      },
      {
        name: 'www.rabiegadevelopment.pl',
        url: 'mysql://srv91710_weddingassistant:XaHtW5sgq42MhtgGjPUh@www.rabiegadevelopment.pl:3306/srv91710_weddingassistant'
      },
      {
        name: 'h63.seohost.pl',
        url: 'mysql://srv91710_weddingassistant:XaHtW5sgq42MhtgGjPUh@h63.seohost.pl:3306/srv91710_weddingassistant'
      }
    ]

    const results = []

    for (const config of configs) {
      try {
        const prisma = new PrismaClient({
          datasources: {
            db: {
              url: config.url
            }
          }
        })

        // Test połączenia
        const testResult = await prisma.$queryRaw`SELECT 1 as test`
        
        // Sprawdzenie tabel
        const tables = await prisma.$queryRaw`SHOW TABLES`
        
        // Sprawdzenie użytkowników
        const users = await prisma.user.findMany({
          select: { 
            id: true, 
            email: true, 
            role: true, 
            created_at: true,
            status: true
          }
        })

        // Sprawdzenie modułów
        const modules = await prisma.module.findMany({
          select: { id: true, name: true, is_active: true }
        })

        await prisma.$disconnect()
        
        results.push({
          success: true,
          host: config.name,
          url: config.url,
          testResult,
          tableCount: tables.length,
          userCount: users.length,
          moduleCount: modules.length,
          users: users,
          modules: modules,
          timestamp: new Date().toISOString()
        })
      } catch (error: any) {
        results.push({
          success: false,
          host: config.name,
          url: config.url,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        working: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    })

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Błąd podczas testowania połączeń',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
