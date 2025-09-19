# Lumina Africa Backend

API backend pour la plateforme Lumina Africa utilisant NestJS et Supabase.

## 🚀 Déploiement sur Render

### Variables d'environnement requises

```bash
NODE_ENV=production
PORT=10000
NEXT_PUBLIC_SUPABASE_URL=https://baoywgzpmndrbiagiczs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.baoywgzpmndrbiagiczs:Eliefritz97@aws-1-ca-central-1.pooler.supabase.com:6543/postgres
POSTGRES_HOST=aws-1-ca-central-1.pooler.supabase.com
POSTGRES_PORT=6543
POSTGRES_USER=postgres.baoywgzpmndrbiagiczs
POSTGRES_PASSWORD=Eliefritz97
POSTGRES_DB=postgres
FRONTEND_URL=https://lumina-africa-frontend.vercel.app
```

### Commandes de déploiement

```bash
# Build
npm run build

# Start
npm run start:prod
```

### Endpoints disponibles

- `GET /api/health` - Health check
- `GET /api/health/supabase` - Supabase connection status
- `GET /api/users` - Liste des utilisateurs
- `GET /api/venues` - Liste des lieux
- `GET /api/events` - Liste des événements
- `GET /api/docs` - Documentation Swagger

## 🔧 Développement local

```bash
# Installation
npm install

# Développement
npm run start:dev

# Build
npm run build

# Production
npm run start:prod
```
