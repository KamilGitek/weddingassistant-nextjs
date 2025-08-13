const { PrismaClient } = require('@prisma/client');

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
];

async function testConnection(config) {
  console.log(`\n🔍 Testowanie połączenia z: ${config.name}`);
  console.log(`URL: ${config.url}`);
  
  try {
    // Tworzenie nowego klienta Prisma dla każdego testu
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.url
        }
      }
    });

    // Test połączenia - próba wykonania prostego zapytania
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log(`✅ SUKCES! Połączenie z ${config.name} działa!`);
    console.log(`   Wynik testu:`, result);
    
    // Sprawdzenie czy baza ma tabele
    try {
      const tables = await prisma.$queryRaw`SHOW TABLES`;
      console.log(`   Liczba tabel w bazie: ${tables.length}`);
      if (tables.length > 0) {
        console.log(`   Pierwsze tabele:`, tables.slice(0, 3).map(t => Object.values(t)[0]));
      }
    } catch (tableError) {
      console.log(`   ⚠️  Nie można sprawdzić tabel: ${tableError.message}`);
    }
    
    await prisma.$disconnect();
    return { success: true, host: config.name, url: config.url };
    
  } catch (error) {
    console.log(`❌ BŁĄD połączenia z ${config.name}:`);
    console.log(`   ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log(`   💡 Host nie akceptuje połączeń na porcie 3306`);
    } else if (error.message.includes('Access denied')) {
      console.log(`   💡 Problem z autoryzacją - sprawdź login/hasło`);
    } else if (error.message.includes('Unknown database')) {
      console.log(`   💡 Baza danych nie istnieje`);
    }
    
    return { success: false, host: config.name, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Rozpoczynam testowanie połączeń z bazą danych...\n');
  
  const results = [];
  
  for (const config of configs) {
    const result = await testConnection(config);
    results.push(result);
    
    // Krótka przerwa między testami
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 PODSUMOWANIE TESTÓW:');
  console.log('========================');
  
  const workingConnections = results.filter(r => r.success);
  
  if (workingConnections.length > 0) {
    console.log(`✅ Działające połączenia (${workingConnections.length}):`);
    workingConnections.forEach(conn => {
      console.log(`   • ${conn.host}`);
      console.log(`   • URL: ${conn.url}`);
    });
    
    console.log('\n🎯 REKOMENDACJA:');
    console.log(`   Użyj hosta: ${workingConnections[0].host}`);
    console.log(`   W pliku .env ustaw:`);
    console.log(`   DATABASE_URL="${workingConnections[0].url}"`);
    
  } else {
    console.log('❌ Żadne połączenie nie działa!');
    console.log('   Sprawdź:');
    console.log('   • Czy baza danych została utworzona');
    console.log('   • Czy dane logowania są poprawne');
    console.log('   • Czy hosting pozwala na połączenia zewnętrzne');
  }
}

// Uruchom testy
runTests().catch(console.error);
