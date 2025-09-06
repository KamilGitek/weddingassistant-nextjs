# 🔧 Panel Diagnostyczny - Wedding Assistant

## Opis

Panel diagnostyczny to narzędzie do testowania i rozwiązywania problemów z połączeniem do bazy danych oraz systemem logowania w aplikacji Wedding Assistant.

## Dostęp

Panel jest dostępny pod adresem: `/diagnostic`

**Uwaga:** Panel jest dostępny tylko dla użytkowników z rolą `admin`.

## Funkcje

### 1. 🗄️ Test połączenia z bazą danych

- Testuje połączenie z różnymi hostami bazy danych
- Sprawdza dostępność tabel i danych
- Wyświetla listę użytkowników w bazie
- Pokazuje liczbę modułów i tabel

**Dostępne hosty:**
- `localhost` (lokalna baza)
- `www.rabiegadevelopment.pl` (hosting główny)
- `h63.seohost.pl` (hosting alternatywny)

### 2. 🔐 Generator zahashowanych haseł

- Generuje bezpieczne hashe haseł używając bcrypt
- Umożliwia kopiowanie hasha do schowka
- Testuje weryfikację hasła

**Użycie:**
1. Wprowadź hasło w polu tekstowym
2. Kliknij "Zahashuj hasło"
3. Skopiuj wygenerowany hash
4. Użyj hasha w bazie danych

### 3. 🔑 Test logowania

- Testuje proces logowania bez faktycznego logowania
- Sprawdza czy użytkownik istnieje w bazie
- Weryfikuje poprawność hasła
- Wyświetla szczegóły użytkownika

## Rozwiązywanie problemów

### Problem: "Błąd połączenia z serwerem"

**Możliwe przyczyny:**
1. **Brak konfiguracji DATABASE_URL**
   - Sprawdź czy plik `.env.local` istnieje
   - Upewnij się, że `DATABASE_URL` jest ustawiony

2. **Nieprawidłowy host bazy danych**
   - Użyj panelu diagnostycznego do sprawdzenia dostępnych hostów
   - Zaktualizuj `DATABASE_URL` w pliku `.env.local`

3. **Problem z hostingiem**
   - Sprawdź czy hosting bazy danych jest dostępny
   - Skontaktuj się z dostawcą hostingu

### Problem: "Nieprawidłowy email lub hasło"

**Możliwe przyczyny:**
1. **Użytkownik nie istnieje w bazie**
   - Sprawdź czy użytkownik został utworzony
   - Użyj panelu diagnostycznego do sprawdzenia listy użytkowników

2. **Nieprawidłowe hasło**
   - Sprawdź czy hasło jest prawidłowo zahashowane
   - Użyj generatora haseł do utworzenia nowego hasha

3. **Problem z weryfikacją hasła**
   - Sprawdź czy algorytm hashowania jest spójny
   - Upewnij się, że używany jest bcrypt

### Problem: "Błąd serwera podczas logowania"

**Możliwe przyczyny:**
1. **Problem z Prisma**
   - Sprawdź czy schemat Prisma jest aktualny
   - Uruchom `npx prisma generate`

2. **Problem z połączeniem do bazy**
   - Użyj panelu diagnostycznego do sprawdzenia połączenia
   - Sprawdź logi serwera

## Konfiguracja

### 1. Plik .env.local

```env
# URL bazy danych MySQL
DATABASE_URL="mysql://srv91710_weddingassistant:XaHtW5sgq42MhtgGjPUh@www.rabiegadevelopment.pl:3306/srv91710_weddingassistant"

# Środowisko
NODE_ENV="development"
```

### 2. Vercel (produkcja)

W panelu Vercel ustaw zmienną środowiskową:
```
DATABASE_URL=mysql://srv91710_weddingassistant:XaHtW5sgq42MhtgGjPUh@www.rabiegadevelopment.pl:3306/srv91710_weddingassistant
```

## API Endpoints

### GET /api/diagnostic/connection
Testuje połączenie z bazą danych.

**Odpowiedź:**
```json
{
  "success": true,
  "results": [
    {
      "success": true,
      "host": "www.rabiegadevelopment.pl",
      "url": "mysql://...",
      "tableCount": 15,
      "userCount": 1,
      "users": [...],
      "modules": [...]
    }
  ],
  "summary": {
    "total": 3,
    "working": 2,
    "failed": 1
  }
}
```

### POST /api/diagnostic/hash-password
Generuje hash hasła.

**Request:**
```json
{
  "password": "moje_haslo",
  "rounds": 10
}
```

**Odpowiedź:**
```json
{
  "success": true,
  "originalPassword": "moje_haslo",
  "hashedPassword": "$2a$10$...",
  "rounds": 10,
  "verificationTest": true
}
```

### POST /api/diagnostic/test-login
Testuje logowanie bez faktycznego logowania.

**Request:**
```json
{
  "email": "admin@weddingassistant.pl",
  "password": "moje_haslo"
}
```

**Odpowiedź:**
```json
{
  "success": true,
  "details": {
    "email": "admin@weddingassistant.pl",
    "userExists": true,
    "passwordValid": true,
    "user": {
      "id": 1,
      "email": "admin@weddingassistant.pl",
      "role": "admin",
      "status": "active"
    }
  }
}
```

## Bezpieczeństwo

- Panel diagnostyczny jest dostępny tylko dla administratorów
- Nie loguje się automatycznie - tylko testuje proces
- Nie przechowuje haseł w plain text
- Wszystkie operacje są logowane

## Wsparcie

W przypadku problemów:
1. Użyj panelu diagnostycznego do zidentyfikowania problemu
2. Sprawdź logi aplikacji
3. Skontaktuj się z administratorem systemu
