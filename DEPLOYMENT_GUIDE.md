# 🚀 Guide de Déploiement - Lumina Africa

Ce guide vous explique comment déployer Lumina Africa sur une infrastructure complète avec :
- **Backend** : VPS Contabo avec Docker
- **Frontend** : Vercel
- **Base de données** : MongoDB Atlas
- **CI/CD** : GitHub Actions

## 📋 Prérequis

### 1. VPS Contabo
- Serveur Ubuntu 20.04+ avec au moins 2GB RAM
- Accès SSH configuré
- Docker et Docker Compose installés

### 2. MongoDB Atlas
- Compte MongoDB Atlas
- Cluster créé et configuré
- Utilisateur de base de données créé

### 3. Vercel
- Compte Vercel
- Projet créé pour le frontend

### 4. GitHub
- Repository avec les secrets configurés

## 🔧 Configuration des Services

### 1. MongoDB Atlas

1. **Créer un cluster** sur [MongoDB Atlas](https://cloud.mongodb.com)
2. **Configurer l'accès réseau** :
   - Ajouter l'IP de votre VPS (0.0.0.0/0 pour le développement)
3. **Créer un utilisateur de base de données** :
   - Nom d'utilisateur et mot de passe
4. **Obtenir la chaîne de connexion** :
   ```
   mongodb+srv://username:password@cluster.mongodb.net/lumina_africa?retryWrites=true&w=majority
   ```

### 2. Configuration GitHub Secrets

Ajoutez ces secrets dans votre repository GitHub (Settings > Secrets and variables > Actions) :

#### Secrets pour le déploiement VPS :
- `VPS_HOST` : IP de votre serveur Contabo
- `VPS_USER` : Utilisateur SSH (généralement `root`)
- `VPS_SSH_PRIVATE_KEY` : Clé privée SSH pour accéder au VPS

#### Secrets pour Vercel :
- `VERCEL_TOKEN` : Token d'API Vercel
- `VERCEL_ORG_ID` : ID de votre organisation Vercel
- `VERCEL_PROJECT_ID` : ID de votre projet Vercel
- `NEXT_PUBLIC_API_URL` : URL de votre API backend

#### Secrets pour l'application :
- `MONGODB_URI` : Chaîne de connexion MongoDB Atlas
- `JWT_SECRET` : Clé secrète JWT
- `STRIPE_SECRET_KEY` : Clé secrète Stripe
- `PAYSTACK_SECRET_KEY` : Clé secrète Paystack
- `AWS_ACCESS_KEY_ID` : Clé d'accès AWS
- `AWS_SECRET_ACCESS_KEY` : Clé secrète AWS

## 🚀 Déploiement

### 1. Déploiement Backend (VPS Contabo)

#### Option A : Déploiement automatique via GitHub Actions
1. Poussez votre code sur la branche `main`
2. Le workflow GitHub Actions se déclenche automatiquement
3. Vérifiez les logs dans l'onglet "Actions" de GitHub

#### Option B : Déploiement manuel
```bash
# Configurer les variables d'environnement
export VPS_HOST="your-vps-ip"
export VPS_USER="root"

# Exécuter le script de déploiement
./scripts/deploy-vps.sh
```

### 2. Déploiement Frontend (Vercel)

#### Option A : Déploiement automatique via GitHub Actions
1. Le workflow se déclenche automatiquement lors des changements dans `frontend/`
2. Vérifiez le déploiement sur votre dashboard Vercel

#### Option B : Déploiement manuel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer depuis le dossier frontend
cd frontend
vercel --prod
```

## 🔍 Vérification du Déploiement

### Backend
- **Health Check** : `http://your-vps-ip:3001/health`
- **API** : `http://your-vps-ip:3001/api`
- **Logs** : `docker-compose logs -f backend`

### Frontend
- **Application** : URL fournie par Vercel
- **Build Status** : Dashboard Vercel

### Base de données
- **Connexion** : Vérifier dans MongoDB Atlas
- **Collections** : Vérifier la création des collections

## 🛠️ Maintenance

### Mise à jour du Backend
```bash
# Sur le VPS
cd /opt/lumina
docker-compose pull
docker-compose up -d --build
```

### Mise à jour du Frontend
- Push sur la branche `main` déclenche automatiquement le déploiement

### Sauvegarde
```bash
# Sauvegarde de la base de données
mongodump --uri="your-mongodb-uri" --out=backup-$(date +%Y%m%d)

# Sauvegarde des fichiers
tar -czf lumina-backup-$(date +%Y%m%d).tar.gz /opt/lumina
```

## 🔒 Sécurité

### SSL/TLS
1. **Obtenir un certificat SSL** (Let's Encrypt recommandé)
2. **Configurer Nginx** avec SSL
3. **Rediriger HTTP vers HTTPS**

### Firewall
```bash
# Configurer UFW
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### Variables d'environnement
- Utilisez des secrets forts pour JWT_SECRET
- Limitez l'accès aux clés API
- Activez l'authentification à deux facteurs sur tous les services

## 📊 Monitoring

### Logs
```bash
# Logs du backend
docker-compose logs -f backend

# Logs de Nginx
tail -f /opt/lumina/logs/nginx/access.log
tail -f /opt/lumina/logs/nginx/error.log
```

### Métriques
- **Vercel Analytics** : Dashboard Vercel
- **MongoDB Atlas** : Métriques dans le dashboard
- **VPS** : `htop`, `df -h`, `free -m`

## 🆘 Dépannage

### Problèmes courants

#### Backend ne démarre pas
```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier la configuration
docker-compose config

# Redémarrer les services
docker-compose restart
```

#### Frontend ne se connecte pas au backend
- Vérifier `NEXT_PUBLIC_API_URL` dans Vercel
- Vérifier les CORS dans le backend
- Vérifier le firewall du VPS

#### Base de données inaccessible
- Vérifier la chaîne de connexion MongoDB
- Vérifier les règles de réseau dans MongoDB Atlas
- Vérifier les logs de connexion

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs des services
2. Consultez la documentation des services utilisés
3. Créez une issue sur GitHub

---

**🎉 Félicitations ! Votre application Lumina Africa est maintenant déployée en production !**
