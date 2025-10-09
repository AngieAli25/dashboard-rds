# Guida Deploy su Vercel con Postgres

## 🚀 Setup Vercel Postgres

### 1. Deploy iniziale su Vercel
1. Pusha il codice su GitHub
2. Importa il progetto su Vercel
3. Configura:
   - **Root Directory**: `web-team-dashboard`
   - **Framework**: Next.js (auto-detect)

### 2. Aggiungi Vercel Postgres
1. Nel dashboard Vercel, vai al tuo progetto
2. Vai su **Storage** → **Create Database**
3. Seleziona **Postgres** → **Continue**
4. Scegli un nome e la region (es. Washington D.C.)
5. Clicca **Create**

Vercel aggiungerà automaticamente queste variabili d'ambiente:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 3. Ri-deploya
1. Vai su **Deployments**
2. Clicca sui tre puntini dell'ultimo deployment
3. Seleziona **Redeploy**

Il deploy eseguirà automaticamente:
- `prisma generate` - Genera il client Prisma
- `prisma migrate deploy` - Applica le migrations
- `next build` - Builda l'applicazione

### 4. Popola il Database (opzionale)
Puoi aggiungere dati di test direttamente dal Prisma Studio:
```bash
# Localmente (dopo aver configurato DATABASE_URL)
npx prisma studio
```

O tramite script SQL direttamente nel dashboard Vercel Postgres.

## 📝 Note
- Le migrations sono già create in `prisma/migrations/`
- Il database viene creato automaticamente al primo deploy
- Tutti gli endpoint API sono sotto `/api/*`
- Non serve più il backend Django separato!

## 🔧 Sviluppo Locale (opzionale)
Se vuoi testare localmente con database:

1. Crea un database Postgres locale o usa Vercel Postgres
2. Copia `.env.local.example` in `.env.local`
3. Aggiungi le variabili del database
4. Esegui migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Avvia il dev server:
   ```bash
   npm run dev
   ```

## 🎯 Architettura Finale
```
Frontend (Next.js) + Backend (API Routes) + Database (Vercel Postgres)
└─ Tutto deployato su Vercel in un unico progetto
```
