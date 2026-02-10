# Shopit - Ecommerce di Buoni

## Overview

Shopit è un semplice ecommerce per l’acquisto di buoni regalo.  
Ogni prodotto ha:

- Un nome
- Una descrizione
- Una serie di tagli di prezzo
- Una serie di asset (immagini)

Non è presente la funzionalità di carrello: l’utente può acquistare direttamente i buoni.

L’obiettivo del progetto era creare un’applicazione **full-stack containerizzata**, con backend in Node.js + TypeScript + Express, frontend in React + TailwindCSS e database MySQL.

---
## Avvio rapido

### Con Docker Compose (Consigliato)

```bash
# Dalla root del progetto
docker-compose up --build
```

I servizi saranno disponibili a:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000
- **Database MySQL**: localhost:3306

**Credenziali Database:**
- User: `shopit_user`
- Password: `shopit_pass`
- Database: `shopit_db`

### Avvio Locale (senza Docker)

#### Backend

```bash
cd backend
npm install
npm run dev  # Richiede MySQL in esecuzione localmente
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Database - Schema e Relazioni

### Tabelle

#### 1. **users**
Tabella per la gestione degli utenti registrati.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | INT AUTO_INCREMENT PRIMARY KEY | ID unico dell'utente |
| username | VARCHAR(100) UNIQUE NOT NULL | Username univoco |
| password | VARCHAR(255) NOT NULL | Password hashata con bcrypt |

---

#### 2. **product**
Tabella principale dei prodotti (buoni regalo).

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | INT AUTO_INCREMENT PRIMARY KEY | ID unico del prodotto |
| name | VARCHAR(150) NOT NULL | Nome del buono |
| description | TEXT | Descrizione del buono |

---

#### 3. **product_price**
Tabella per i diversi tagli di prezzo di un prodotto (relazione 1:N con product).

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | INT AUTO_INCREMENT PRIMARY KEY | ID unico della variante di prezzo |
| product_id | INT NOT NULL | Riferimento al prodotto (FK) |
| amount | DECIMAL(10,2) NOT NULL | Prezzo della variante |
| descrizione | VARCHAR(500) NOT NULL | Descrizione della variante (es. "Taglio da €10") |

**Vincolo**: FOREIGN KEY `product_id` → `product.id` (ON DELETE CASCADE)

---

#### 4. **asset**
Tabella per le immagini dei prodotti (relazione 1:N con product).

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | INT AUTO_INCREMENT PRIMARY KEY | ID unico dell'asset |
| product_id | INT NOT NULL | Riferimento al prodotto (FK) |
| url | VARCHAR(500) NOT NULL | URL dell'immagine |

**Vincolo**: FOREIGN KEY `product_id` → `product.id` (ON DELETE CASCADE)

---

#### 5. **purchase**
Tabella per gli acquisti effettuati (relazione 1:N con users e product).

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | INT AUTO_INCREMENT PRIMARY KEY | ID unico dell'acquisto |
| user_id | INT NOT NULL | Riferimento all'utente (FK) |
| product_id | INT NOT NULL | Riferimento al prodotto acquistato (FK) |
| price_snapshot | DECIMAL(10,2) NOT NULL | Prezzo al momento dell'acquisto |
| created_at | TIMESTAMP | Data e ora dell'acquisto |

**Vincoli**: 
- FOREIGN KEY `user_id` → `users.id`
- FOREIGN KEY `product_id` → `product.id`

---

### Diagramma delle Relazioni

```
users (1) ──────────────────── (N) purchase
                                    │
                                    │ (N) ── (1) product (1) ──── (N) product_price
                                    │                             
                                    └──────────────── (1) asset
```

---

## API REST - Documentazione

### Base URL
```
http://localhost:4000
```

### Autenticazione
Le API protette richiedono un JWT token nell'header:
```
Authorization: Bearer <token>
```

---

## AUTENTICAZIONE

### 1. POST /auth/register
Registrazione di un nuovo utente.

**Request:**
```
POST http://localhost:4000/auth/register
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Utente registrato con successo"
}
```

**Errori:**
- **400 Bad Request**: Username o password non forniti
  ```json
  { "error": "Username e password richiesti" }
  ```
- **409 Conflict**: Username già esistente
  ```json
  { "error": "Username già esistente" }
  ```
- **500 Internal Server Error**:
  ```json
  { "error": "Errore interno del server" }
  ```

---

### 2. POST /auth/login
Accesso di un utente esistente.

**Request:**
```
POST http://localhost:4000/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errori:**
- **400 Bad Request**: Username o password non forniti
  ```json
  { "error": "Username e password richiesti" }
  ```
- **401 Unauthorized**: Credenziali non valide
  ```json
  { "error": "Username non valido" }
  ```
  ```json
  { "error": "Password non valida" }
  ```
- **500 Internal Server Error**:
  ```json
  { "error": "Errore interno del server" }
  ```

**Token JWT:**
- Scadenza: 1 ora
- Payload: `{ id: <user_id>, username: <username> }`

---

## PRODOTTI

### 3. GET /dashboard/products
Recupera tutti i prodotti disponibili con dettagli, prezzi e immagini.

**Request:**
```
GET http://localhost:4000/dashboard/products
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Buono Amazon",
    "description": "Buono acquisto per Amazon",
    "amount": ["10.00", "25.00", "50.00"],
    "descr_dett": ["Taglio €10", "Taglio €25", "Taglio €50"],
    "images": [
      "amazon1.jpg",
      "amazon2.jpg"
    ]
  },
  {
    "id": 2,
    "name": "Buono Spotify",
    "description": "Buono per abbonamento Spotify",
    "amount": ["9.99", "30.00"],
    "descr_dett": ["Mese", "3 Mesi"],
    "images": [
      "spotify.jpg"
    ]
  }
]
```

**Errori:**
- **500 Internal Server Error**:
  ```json
  { "error": "Errore nel caricamento dei prodotti" }
  ```

---

## ACQUISTI

### 4. POST /dashboard/purchase
Crea un nuovo acquisto (richiede autenticazione).

**Request:**
```
POST http://localhost:4000/dashboard/purchase
Content-Type: application/json
Authorization: Bearer <token>

{
  "product_id": 1,
  "price": 10.00
}
```

**Response (200 OK):**
```json
{
  "message": "Acquisto effettuato con successo"
}
```

**Errori:**
- **401 Unauthorized**: Token non trovato o non valido
  ```json
  { "error": "Token non trovato" }
  ```
- **500 Internal Server Error**:
  ```json
  { "error": "Errore interno del server" }
  ```

---

### 5. GET /dashboard/purchases
Recupera gli acquisti dell'utente autenticato.

**Request:**
```
GET http://localhost:4000/dashboard/purchases
Authorization: Bearer <token>
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Buono Amazon",
    "description": "Buono acquisto per Amazon",
    "price_snapshot": 10.00,
    "created_at": "2026-02-11T14:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Buono Spotify",
    "description": "Buono per abbonamento Spotify",
    "price_snapshot": 9.99,
    "created_at": "2026-02-11T15:45:00.000Z"
  }
]
```

**Errori:**
- **401 Unauthorized**: Token non trovato o non valido
  ```json
  { "error": "Token non trovato" }
  ```
- **500 Internal Server Error**:
  ```json
  { "error": "Errore nel caricamento degli acquisti" }
  ```
---

## Come ho costruito il progetto

### Passi principali nello sviluppo

1. **Database MySQL**  
   - Creazione delle tabelle per utenti, prodotti, tagli di prezzo, immagini e acquisti.  
   - Popolamento dei dati iniziali tramite `init.sql` e `seed.sql`.  

2. **Backend Node.js + TypeScript**  
   - Setup Express + JWT per autenticazione.  
   - API REST per login, registrazione, visualizzazione prodotti e gestione acquisti.  
   - Collegamento al database MySQL tramite variabili d’ambiente.  

3. **Frontend React + Vite + TailwindCSS**  
   - Creazione di pagine per login, registrazione e catalogo prodotti.  
   - Connessione con il backend tramite Axios e gestione token JWT.  
   - Stile e layout responsive con TailwindCSS.  

4. **Containerizzazione con Docker**  
   - Servizi separati per DB, backend e frontend.  
   - Docker Compose per avviare tutto con un solo comando.

---

## Frontend - Dettagli

Boilerplate React con TypeScript per il frontend dell'applicazione SHOPIT.

### Caratteristiche

- ⚛️ React 18 con TypeScript
- ⚡ Vite come build tool
- 🛣️ React Router v6 per il routing
- 📡 Axios per le chiamate API
- 🎨 Styling CSS con tema gradiente moderno
- 🔐 Pagine di Login e Registrazione

### Pagine

- **Auth**: Login e registrazione degli utenti
- **Dashboard**: Visualizzazione catalogo prodotti
- **Purchase History**: Storico acquisti dell'utente

### Setup

#### Installazione dipendenze

```bash
cd frontend
npm install
```

#### Avvio in sviluppo

```bash
npm run dev
```

#### Build per produzione

```bash
npm run build
```

---

## Backend - Dettagli

Backend Node.js + Express + TypeScript per l'API REST di Shopit.

### Stack Tecnologico

- **Runtime**: Node.js
- **Framework**: Express.js
- **Linguaggio**: TypeScript
- **Autenticazione**: JWT
- **Password Hashing**: bcrypt
- **Database**: MySQL 8.0

### Configurazione Environment

Crea un file `.env` nella cartella `backend`:

```env
DB_HOST=localhost
DB_USER=shopit_user
DB_PASSWORD=shopit_pass
DB_NAME=shopit_db
JWT_SECRET=your-secret-key-here
PORT=4000
```

### Setup Locale

```bash
cd backend
npm install
npm run dev
```

Il server partirà su `http://localhost:4000`

---

## Struttura Directory

```
shopit/
├── docker-compose.yml          # Configurazione Docker Compose
├── readme.md                    # Questo file
├── db/
│   ├── init.sql               # Script di creazione tabelle
│   └── seed.sql               # Script per dati di test
├── backend/
│   ├── dockerfile             # Dockerfile per il backend
│   ├── package.json           # Dipendenze Node.js
│   ├── tsconfig.json          # Configurazione TypeScript
│   ├── src/
│   │   ├── app.ts            # Configurazione Express
│   │   ├── server.ts         # Entry point
│   │   ├── config/
│   │   │   └── database.ts   # Configurazione connessione DB
│   │   ├── controllers/      # Logica delle API
│   │   │   ├── authController.ts
│   │   │   ├── dashboardController.ts
│   │   │   └── purchaseController.ts
│   │   └── routes/          # Definizione rotte
│   │       ├── authRoutes.ts
│   │       └── dashboardRouter.ts
│   └── public/              # File statici (immagini prodotti)
└── frontend/
    ├── dockerfile           # Dockerfile per il frontend
    ├── package.json        # Dipendenze Node.js
    ├── vite.config.ts      # Configurazione Vite
    ├── tailwind.config.js  # Configurazione Tailwind CSS
    ├── index.html          # Entry HTML
    └── src/
        ├── main.tsx       # Entry point React
        ├── App.tsx        # Componente principale
        ├── index.css      # Stili globali
        ├── api/
        │   └── endPointApi.ts  # Configurazione Axios
        ├── components/    # Componenti React riutilizzabili
        │   ├── AuthForm.tsx
        │   └── ProductCard.tsx
        └── pages/        # Pagine dell'applicazione
            ├── Dashboard.tsx
            ├── PurchaseHistory.tsx
            └── Auth/
                ├── Login.tsx
                └── Register.tsx
```

---

## Troubleshooting

### Porta già in uso
Se le porte 3306, 4000 o 5173 sono già in uso, modifica il `docker-compose.yml`:

```yaml
ports:
  - "3307:3306"  # MySQL
  - "4001:4000"  # Backend
  - "5174:5173"  # Frontend
```

### Errore di connessione al database
Assicurati che il servizio MySQL sia in esecuzione:
```bash
docker-compose ps
```

### Errore token JWT
- Verifica che l'header Authorization sia nel formato: `Bearer <token>`
- Assicurati che il token non sia scaduto (scadenza: 1 ora)

---

## Note di Sviluppo

- Il JWT ha scadenza di 1 ora per motivi di sicurezza
- Le password sono hashate con bcrypt (salting: 10 round)
- Gli acquisti mantengono uno snapshot del prezzo al momento della vendita
- Le immagini sono servite staticamente dalla cartella `public/images`
- CORS è abilitato solo per `http://localhost:5173`

