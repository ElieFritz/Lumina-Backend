# 🔧 Guide de Dépannage - EventLink Africa

## 🚨 Problèmes Courants et Solutions

### 1. Erreurs Tailwind CSS

**Problème :** `Error: Cannot find module '@tailwindcss/forms'`

**Solution :**
```bash
# Option 1: Installer les plugins manquants
cd frontend
npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio

# Option 2: Les plugins sont déjà commentés dans tailwind.config.js
# Aucune action nécessaire
```

### 2. Erreurs Next.js Configuration

**Problème :** `destination does not start with /, http://, or https://`

**Solution :**
- Vérifiez que `NEXT_PUBLIC_API_URL` est définie
- Créez un fichier `.env.local` dans le dossier frontend :
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > frontend/.env.local
```

### 3. Erreurs de Port

**Problème :** Port déjà utilisé

**Solution :**
```bash
# Vérifier les ports utilisés
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Tuer les processus si nécessaire
kill -9 <PID>
```

### 4. Erreurs de Base de Données

**Problème :** `Connection refused` ou `Database not found`

**Solutions :**

**Option A - Docker (Recommandé) :**
```bash
# Installer Docker Desktop
brew install --cask docker

# Lancer les services
docker-compose up -d
```

**Option B - PostgreSQL Local :**
```bash
# Installer PostgreSQL
brew install postgresql

# Démarrer le service
brew services start postgresql

# Créer la base de données
createdb lumina_africa
```

**Option C - Mode Développement sans DB :**
- Modifier le backend pour utiliser des données mock
- Désactiver la connexion à la base de données

### 5. Erreurs de Dépendances

**Problème :** `npm error code ETARGET` ou modules manquants

**Solution :**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Pour le backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Pour le frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### 6. Erreurs TypeScript

**Problème :** Erreurs de compilation TypeScript

**Solutions :**
```bash
# Vérifier la configuration TypeScript
cd backend
npx tsc --noEmit

# Corriger les erreurs une par une
# Les erreurs courantes sont déjà corrigées dans le code
```

### 7. Erreurs de Permissions

**Problème :** `Permission denied` sur les scripts

**Solution :**
```bash
# Rendre les scripts exécutables
chmod +x scripts/*.sh

# Ou lancer directement avec bash
bash scripts/start-dev.sh
```

## 🛠️ Commandes de Diagnostic

### Vérifier l'État des Services
```bash
# Vérifier les processus Node.js
ps aux | grep node

# Vérifier les ports
lsof -i :3000
lsof -i :3001
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Vérifier Docker
docker ps
docker-compose ps
```

### Logs et Debug
```bash
# Logs du backend
cd backend
npm run start:dev

# Logs du frontend
cd frontend
npm run dev

# Logs Docker
docker-compose logs -f
```

### Test de Connectivité
```bash
# Tester l'API
curl http://localhost:3001/api/health

# Tester le frontend
curl http://localhost:3000

# Tester la base de données
psql -h localhost -U postgres -d lumina_africa -c "SELECT 1;"
```

## 🔍 Diagnostic Avancé

### 1. Vérifier la Configuration
```bash
# Vérifier Node.js
node --version
npm --version

# Vérifier Docker
docker --version
docker-compose --version

# Vérifier PostgreSQL
psql --version
```

### 2. Vérifier les Variables d'Environnement
```bash
# Backend
cd backend
cat .env

# Frontend
cd frontend
cat .env.local
```

### 3. Vérifier les Fichiers de Configuration
```bash
# Vérifier la configuration Next.js
cat frontend/next.config.js

# Vérifier la configuration Tailwind
cat frontend/tailwind.config.js

# Vérifier la configuration TypeScript
cat backend/tsconfig.json
cat frontend/tsconfig.json
```

## 🚀 Solutions Rapides

### Redémarrage Complet
```bash
# Arrêter tous les services
pkill -f node
docker-compose down

# Nettoyer
rm -rf backend/node_modules frontend/node_modules
rm -rf backend/dist

# Réinstaller et relancer
./scripts/start-dev.sh
```

### Mode Minimal
```bash
# Lancer seulement le frontend (sans backend)
cd frontend
npm run dev

# Lancer seulement le backend (sans frontend)
cd backend
npm run start:dev
```

## 📞 Support

Si les problèmes persistent :

1. **Vérifiez les logs** pour des erreurs spécifiques
2. **Consultez la documentation** des technologies utilisées
3. **Créez une issue** sur GitHub avec :
   - Description du problème
   - Logs d'erreur
   - Configuration système
   - Étapes pour reproduire

## 🔗 Liens Utiles

- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation TypeORM](https://typeorm.io/)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
