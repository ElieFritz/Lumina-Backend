# Lumina Africa - Web App MVP

Lumina Africa est une plateforme web réactive qui permet de découvrir des sorties (restaurants, cinémas, lounges, concerts...), filtrer, réserver, payer (Mobile Money, carte), intégrer une vue AR basique et ajouter une couche sociale simple.

## 🚀 Fonctionnalités

### Sprint 1 - Authentification & Établissements ✅
- [x] Système d'authentification complet (inscription, connexion, réinitialisation)
- [x] Gestion des utilisateurs et rôles
- [x] CRUD complet pour les établissements
- [x] Recherche géospatiale avec PostGIS
- [x] Interface utilisateur moderne et responsive

### Sprint 2 - Événements & Recherche (À venir)
- [ ] Gestion des événements
- [ ] Système de recherche avancé avec Elasticsearch
- [ ] Filtres et catégorisation
- [ ] Recommandations personnalisées

### Sprint 3 - Réservations & Paiements (À venir)
- [ ] Système de réservations
- [ ] Intégration paiements (Stripe, Paystack, Mobile Money)
- [ ] Gestion des tickets et QR codes

### Sprint 4 - Notifications & Production (À venir)
- [ ] Système de notifications
- [ ] Paiements en production
- [ ] Monitoring et analytics

### Sprint 5 - AR & Social (À venir)
- [ ] Vue AR basique
- [ ] Fonctionnalités sociales
- [ ] Système d'amis et partage

### Sprint 6 - QA & Déploiement (À venir)
- [ ] Tests de charge
- [ ] Déploiement production
- [ ] Optimisations finales

## 🛠️ Stack Technique

### Backend
- **Framework**: NestJS (Node.js)
- **Base de données**: PostgreSQL + PostGIS
- **Cache**: Redis
- **Recherche**: Elasticsearch
- **Authentification**: JWT
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class Validator
- **ORM**: TypeORM

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **État**: React Query
- **Formulaires**: React Hook Form + Zod
- **UI**: Headless UI + Heroicons
- **Animations**: Framer Motion

### Infrastructure
- **Conteneurisation**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logs**: ELK Stack

## 📁 Structure du Projet

```
Lumina/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── common/         # Entités, DTOs, enums
│   │   ├── modules/        # Modules métier
│   │   │   ├── auth/       # Authentification
│   │   │   ├── users/      # Gestion utilisateurs
│   │   │   ├── venues/     # Gestion établissements
│   │   │   └── ...         # Autres modules
│   │   ├── database/       # Configuration DB
│   │   └── main.ts         # Point d'entrée
│   ├── package.json
│   └── Dockerfile
├── frontend/               # Application Next.js
│   ├── src/
│   │   ├── app/           # Pages et layouts
│   │   ├── components/    # Composants réutilisables
│   │   ├── contexts/      # Contextes React
│   │   ├── services/      # Services API
│   │   ├── types/         # Types TypeScript
│   │   └── utils/         # Utilitaires
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Configuration Docker
├── package.json           # Scripts monorepo
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- Docker & Docker Compose (optionnel)
- Git

### Installation Rapide

1. **Cloner le repository**
```bash
git clone <repository-url>
cd Lumina
```

2. **Lancer l'environnement de développement complet**
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

### Installation Manuelle

1. **Installer les dépendances**
```bash
npm install
```

2. **Configuration de l'environnement**
```bash
cp env.example .env
# Éditer le fichier .env avec vos configurations
```

3. **Démarrer le backend**
```bash
chmod +x scripts/start-backend.sh
./scripts/start-backend.sh
```

4. **Démarrer le frontend (dans un autre terminal)**
```bash
chmod +x scripts/start-frontend.sh
./scripts/start-frontend.sh
```

### Démarrer avec Docker (Optionnel)

```bash
docker-compose up -d
```

### Dépannage

Si vous rencontrez des erreurs :

1. **Erreur Tailwind CSS** : Les plugins Tailwind sont commentés dans `tailwind.config.js`
2. **Erreur de port** : Vérifiez que les ports 3000 et 3001 sont libres
3. **Erreur de base de données** : Installez PostgreSQL ou utilisez Docker
4. **Erreur de dépendances** : Supprimez `node_modules` et relancez `npm install`

### Accès aux services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Documentation API**: http://localhost:3001/api/docs
- **Base de données**: localhost:5432
- **Redis**: localhost:6379
- **Elasticsearch**: localhost:9200

## 🗄️ Visualisation des Données

### Consulter les Données Mock (Actuel)
```bash
# Afficher toutes les données mock en cours
./scripts/view-mock-data.sh
```

### Configuration PostgreSQL
```bash
# Configurer PostgreSQL avec PostGIS
./scripts/setup-postgresql.sh

# Installer une interface graphique pour la DB
./scripts/install-db-gui.sh
```

### Interfaces Graphiques Recommandées
- **DBeaver** (gratuit, multiplateforme) : `brew install --cask dbeaver-community`
- **TablePlus** (macOS, moderne) : `brew install --cask tableplus`
- **pgAdmin** (web-based) : `brew install --cask pgadmin4`

### Connexion en Ligne de Commande
```bash
# Se connecter à PostgreSQL
psql -d eventlink_africa

# Lister les tables
\dt

# Voir le contenu d'une table
SELECT * FROM venues;
SELECT * FROM events;
SELECT * FROM users;
```

## 📚 API Documentation

L'API est documentée avec Swagger et accessible à l'adresse `/api/docs` une fois le backend démarré.

### Endpoints principaux

#### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/forgot-password` - Mot de passe oublié
- `POST /auth/reset-password` - Réinitialisation mot de passe

#### Utilisateurs
- `GET /users/profile` - Profil utilisateur
- `PATCH /users/profile` - Mise à jour profil
- `GET /users` - Liste utilisateurs (admin)

#### Établissements
- `GET /venues` - Liste établissements
- `POST /venues` - Créer établissement
- `GET /venues/:id` - Détails établissement
- `PATCH /venues/:id` - Modifier établissement
- `GET /venues/nearby` - Établissements à proximité
- `GET /venues/search` - Recherche établissements

## 🎨 Design System

### Couleurs
- **Primary**: Orange (#ed7219)
- **Secondary**: Bleu (#0ea5e9)
- **Accent**: Violet (#d946ef)
- **Success**: Vert (#10b981)
- **Warning**: Jaune (#f59e0b)
- **Error**: Rouge (#ef4444)

### Typographie
- **Display**: Poppins (titres)
- **Body**: Inter (texte)

### Composants
- Boutons avec variants (primary, secondary, outline, ghost)
- Formulaires avec validation
- Cards avec hover effects
- Modales et overlays
- Navigation responsive

## 🔒 Sécurité

- Authentification JWT
- Validation des données côté serveur
- Protection CSRF
- Rate limiting
- Chiffrement des mots de passe (bcrypt)
- HTTPS en production
- Headers de sécurité (Helmet)

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🧪 Tests

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Frontend
cd frontend
npm run test
```

## 🚀 Déploiement

### Staging
```bash
npm run build
npm run docker:build
```

### Production
- Configuration Kubernetes
- CI/CD avec GitHub Actions
- Monitoring avec Prometheus/Grafana
- Logs centralisés avec ELK

## 📊 Monitoring

- **Métriques**: Prometheus
- **Visualisation**: Grafana
- **Logs**: ELK Stack
- **Alertes**: AlertManager
- **Santé**: Health checks

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Product Manager**: 1
- **Tech Lead**: 1
- **Backend Developers**: 2
- **Frontend Developers**: 2
- **DevOps Engineer**: 1
- **QA Engineer**: 1
- **UX/UI Designer**: 1
- **Business/Partnerships**: 1

## 📞 Support

Pour toute question ou support :
- Email: support@eventlink-africa.com
- Documentation: [docs.eventlink-africa.com](https://docs.eventlink-africa.com)
- Issues: [GitHub Issues](https://github.com/eventlink-africa/issues)

---

**Lumina Africa** - Découvrez et réservez vos sorties en Afrique 🌍

## 🔍 **Problèmes Identifiés :**

### 1. **Frontend - Erreurs de Syntaxe Persistantes**
Le frontend a encore des erreurs de syntaxe JSX dans `Hero.tsx` qui causent des recompilations constantes :
```
Error: × Unexpected token `section`. Expected jsx identifier
```

### 2. **Backend - Pas de Base de Données**
Le backend ne peut pas démarrer car il n'y a pas de base de données PostgreSQL configurée.

### 3. **Frontend - Pages 404**
Le frontend génère des erreurs 404 pour les routes qui n'existent pas encore :
```
GET /venues 404
GET /events 404
GET /promotions 404
```

## 🛠️ **Solutions Immédiates :**

### **Étape 1 : Corriger définitivement le problème Hero.tsx**
```
   <div className="absolute inset-0 bg-white/5" />
```

### **2. Problème Backend : Base de Données Manquante**
- **Cause** : PostgreSQL non installé/démarré
- **Impact** : Backend ne peut pas démarrer
- **Solution** : Installer PostgreSQL ou utiliser Docker

### **3. Problème Frontend : Routes 404**
- **Cause** : Pages dynamiques non créées
- **Impact** : Erreurs 404, navigation cassée
- **Solution** : Créer les pages manquantes

## 🚀 **Solutions Recommandées :**

### **Solution Rapide - Mode Développement Simplifié :**

1. **Corriger Hero.tsx manuellement :**
   - Remplacer la ligne 34 par :
   ```tsx
   <div className="absolute inset-0 bg-white/5" />
   ```

2. **Démarrer le backend sans base de données :**
   ```bash
   cd backend
   # Modifier app.module.ts pour désactiver TypeORM temporairement
   npm run start:dev
   ```

3. **Créer les pages manquantes :**
   ```bash
   # Créer les dossiers et pages de base
   mkdir -p frontend/src/app/venues
   mkdir -p frontend/src/app/events
   mkdir -p frontend/src/app/promotions
   mkdir -p frontend/src/app/about
   ```

### **Solution Complète - Installation PostgreSQL :**

```bash
# Installer PostgreSQL
brew install postgresql
brew services start postgresql

# Créer la base de données
createdb eventlink_africa

# Démarrer le backend
cd backend
npm run start:dev
```

## ⚡ **Optimisations de Performance :**

1. **Désactiver le hot reload en développement :**
   ```bash
   # Dans next.config.js
   module.exports = {
     ...nextConfig,
     onDemandEntries: {
       maxInactiveAge: 25 * 1000,
       pagesBufferLength: 2,
     },
   }
   ```

2. **Utiliser des images optimisées :**
   - Remplacer les URLs Unsplash par des images locales
   - Utiliser `next/image` pour l'optimisation

3. **Réduire les recompilations :**
   - Corriger les erreurs de syntaxe
   - Utiliser des imports statiques

## 🎯 **Priorités d'Action :**

1. **URGENT** : Corriger l'erreur JSX dans Hero.tsx
2. **IMPORTANT** : Installer PostgreSQL pour le backend
3. **MOYEN** : Créer les pages manquantes
4. **OPTIONNEL** : Optimiser les performances

Le problème principal est l'erreur de syntaxe qui cause des recompilations constantes. Une fois corrigée, les performances s'amélioreront considérablement.

## 🚀 Déploiement en Production

Lumina Africa est configuré pour un déploiement complet avec :

- **Backend** : VPS Contabo avec Docker
- **Frontend** : Vercel
- **Base de données** : MongoDB Atlas
- **CI/CD** : GitHub Actions

### Guide de déploiement complet
Consultez le [Guide de Déploiement](DEPLOYMENT_GUIDE.md) pour les instructions détaillées.

### Déploiement rapide
```bash
# 1. Configurer les secrets GitHub (voir DEPLOYMENT_GUIDE.md)

# 2. Déployer le backend sur VPS
export VPS_HOST="your-vps-ip"
./scripts/deploy-vps.sh

# 3. Le frontend se déploie automatiquement sur Vercel via GitHub Actions
```

### Infrastructure de production
- **VPS Contabo** : Serveur Ubuntu avec Docker
- **Vercel** : Déploiement automatique du frontend
- **MongoDB Atlas** : Base de données cloud
- **GitHub Actions** : CI/CD automatisé
- **Nginx** : Reverse proxy avec SSL