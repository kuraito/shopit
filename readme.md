# Shopit - Ecommerce di Buoni

## Overview

Shopit è un semplice ecommerce per l’acquisto di buoni regalo.  
Ogni prodotto ha:

- Un nome
- Una descrizione
- Una serie di tagli di prezzo
- Una serie di asset (immagini)

Non è presente la funzionalità di carrello: l’utente può acquistare direttamente i buoni.

L’obiettivo del progetto è creare un’applicazione **full-stack containerizzata**, con backend in Node.js + TypeScript + Express, frontend in React + TailwindCSS e database MySQL.

---
## Avvio rapido

### Con Docker Compose

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
| descrizione | VARCHAR(500) NOT NULL | Descrizione della variante di prezzo (es. "Pizzeria da Ciro") |

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

## API REST - Documentazione

### Base URL
```
http://localhost:4000
```

### Autenticazione
Le API protette richiedono un JWT token nell'header.

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

- **409 Conflict**: Username già esistente

- **500 Internal Server Error**:


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

- **401 Unauthorized**: Credenziali non valide

- **500 Internal Server Error**:


**Token JWT:**
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
    "name": "Buono Pizza",
    "description": "Buono acquisto per Pizza",
    "amount": ["10.00", "25.00", "50.00"],
    "descr_dett": ["Pizzeria Da Ciro", "Pizzeria Da Gino"],
    "images": [
      "images/pizza1.jpg",
      "images/pizza2.jpg"
    ]
  },
  ...
]
```

**Errori:**
- **500 Internal Server Error**:

---

## ACQUISTI

### 4. POST /dashboard/purchase
Crea un nuovo acquisto (richiede autenticazione).

**Request:**
```
POST http://localhost:4000/dashboard/purchase
Content-Type: application/json

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

- **500 Internal Server Error**:

---

### 5. GET /dashboard/purchases
Recupera gli acquisti dell'utente autenticato.

**Request:**
```
GET http://localhost:4000/dashboard/purchases
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Buono Pizza",
    "description": "Buono acquisto per Pizza",
    "price_snapshot": 10.00,
    "created_at": "2026-02-11T14:30:00.000Z"
  },
  ...
]
```

**Errori:**
- **401 Unauthorized**: Token non trovato o non valido

- **500 Internal Server Error**:

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

---

## Backend - Dettagli

Backend Node.js + Express + TypeScript per l'API REST di Shopit.


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
---

**Disclaimer**

Questo progetto è stato sviluppato in modo rapido e funzionale, con l'obiettivo di soddisfare i requisiti della traccia.

Sono consapevole che alcune best practice non sono state adottate, ad esempio il file .env che è stato incluso anche se non dovrebbe essere versionato su Git.

**Possibili sviluppi futuri**

Spostare le immagini dei prodotti su un servizio di storage cloud (es. S3 di AWS) per una gestione più scalabile.

Migliorare la gestione delle variabili di ambiente.
