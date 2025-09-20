# 🚀 Guide de Déploiement Vercel - Lumina Backend

## 📋 Problème Identifié
Le CLI Vercel ne peut pas déployer automatiquement à cause des permissions d'équipe. **Solution : Déploiement via Dashboard Vercel**

## 🎯 Déploiement Manuel via Dashboard

### Étape 1 : Accéder au Dashboard
1. Allez sur : https://vercel.com/dashboard
2. Connectez-vous avec votre compte Vercel

### Étape 2 : Créer un Nouveau Projet
1. Cliquez sur **"New Project"**
2. Sélectionnez **"Import Git Repository"**
3. Choisissez : `https://github.com/ElieFritz/Lumina`

### Étape 3 : Configuration du Projet
```
Project Name: lumina-backend
Framework Preset: Other
Root Directory: backend
Build Command: npm run vercel-build
Output Directory: dist
Install Command: npm install
```

### Étape 4 : Variables d'Environnement
Ajoutez ces variables dans l'onglet "Environment Variables" :

```
NODE_ENV = production
DATABASE_URL = postgresql://postgres.baoywgzpmndrbiagiczs:Eliefritz97@aws-1-ca-central-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL = https://baoywgzpmndrbiagiczs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb3l3Z3pwbW5kcmJpYWdpY3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTA2NjUsImV4cCI6MjA3MzUyNjY2NX0.KP9VMywToT5YvHikWqmTi5pO6HEWitL14-cnJ9jETYs
FRONTEND_URL = https://lumina-africa-frontend.vercel.app
```

### Étape 5 : Déploiement
1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine (2-3 minutes)
3. Notez l'URL de déploiement

## 🧪 Test de l'API

Une fois déployé, testez avec :
```bash
curl https://[VOTRE-URL-VERCEL]/api/health
```

Vous devriez recevoir :
```json
{
  "status": "ok",
  "timestamp": "2025-09-20T12:00:00.000Z",
  "uptime": 123.456
}
```

## 📊 Endpoints Disponibles

- `GET /api/health` - Santé de l'API
- `GET /api/users` - Liste des utilisateurs
- `GET /api/venues` - Liste des lieux
- `GET /api/events` - Liste des événements
- `GET /api/bookings` - Liste des réservations
- `GET /api/reviews` - Liste des avis
- `GET /api/stats` - Statistiques

## 🔧 Configuration Technique

### Fichiers de Configuration
- `vercel.json` - Configuration Vercel
- `api/index.js` - Handler API pour Vercel
- `package.json` - Scripts de build optimisés

### Build Process
1. `npm install` - Installation des dépendances
2. `npm run vercel-build` - Build optimisé (Prisma + NestJS)
3. Déploiement de `dist/` et `api/`

## 🆚 Comparaison Vercel vs Render

| Fonctionnalité | Vercel | Render |
|----------------|--------|--------|
| **Déploiement** | ✅ Dashboard | ❌ CLI bloqué |
| **Performance** | ⚡ Edge Functions | 🐌 Serveur unique |
| **Intégration** | ✅ Parfaite | ⚠️ Moyenne |
| **Monitoring** | ✅ Avancé | ✅ Basique |
| **Coût** | 💰 Payant après usage | 💰 Gratuit limité |

## 🎉 Avantages Vercel

1. **Performance Supérieure** - Edge Functions + CDN global
2. **Intégration Parfaite** - Avec votre frontend Vercel
3. **Déploiement Automatique** - À chaque push GitHub
4. **Monitoring Avancé** - Logs, métriques, analytics
5. **Évolutivité** - Mise à l'échelle automatique

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans le dashboard Vercel
2. Vérifiez que toutes les variables d'environnement sont configurées
3. Vérifiez que le build se termine sans erreur

**Votre backend sera prêt en quelques minutes !** 🚀
