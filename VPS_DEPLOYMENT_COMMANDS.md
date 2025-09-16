# 🚀 Commandes de Déploiement VPS Contabo

## Connexion au VPS
```bash
ssh root@YOUR_VPS_IP
```

## Une fois connecté au VPS, exécutez ces commandes :

### 1. Préparation du serveur
```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer les dépendances
apt install -y git curl wget unzip

# Créer les répertoires
mkdir -p /opt/lumina
mkdir -p /opt/lumina-backup

# Configurer le firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

### 2. Cloner le repository
```bash
cd /opt
git clone https://github.com/ElieFritz/Lumina.git
cd Lumina
```

### 3. Configuration de l'environnement
```bash
# Copier le fichier d'environnement
cp env.production .env

# Créer les répertoires nécessaires
mkdir -p logs/nginx
mkdir -p nginx/ssl

# Éditer le fichier .env (IMPORTANT !)
nano .env
```

### 4. Configuration du fichier .env
**Configurez au minimum ces variables :**
```bash
# Base de données MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumina_africa?retryWrites=true&w=majority

# JWT Secret (générez une clé forte)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Redis
REDIS_PASSWORD=your-redis-password

# Frontend URL (pour CORS)
FRONTEND_URL=https://your-frontend-domain.vercel.app
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 5. Déploiement avec Docker
```bash
# Arrêter les conteneurs existants (si any)
docker-compose -f docker-compose.prod.yml down || true

# Nettoyer les anciennes images
docker image prune -f

# Construire et démarrer les conteneurs
docker-compose -f docker-compose.prod.yml up -d --build

# Attendre que les services démarrent
sleep 30
```

### 6. Vérification du déploiement
```bash
# Vérifier les conteneurs
docker-compose -f docker-compose.prod.yml ps

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs backend

# Test de santé
curl http://localhost:3001/health
```

### 7. Commandes utiles pour la maintenance
```bash
# Voir les logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f

# Redémarrer les services
docker-compose -f docker-compose.prod.yml restart

# Arrêter les services
docker-compose -f docker-compose.prod.yml down

# Mettre à jour l'application
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🌐 Accès à l'application
- **Backend API** : http://YOUR_VPS_IP:3001
- **Health Check** : http://YOUR_VPS_IP:3001/health
- **Documentation API** : http://YOUR_VPS_IP:3001/api

## 🔒 Prochaines étapes
1. **Configurer un certificat SSL** (Let's Encrypt)
2. **Configurer un nom de domaine**
3. **Configurer MongoDB Atlas**
4. **Tester l'API complète**

