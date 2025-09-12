# 🗺️ Importation Google Places API - EventLink Africa

## 📋 Vue d'ensemble

Ce système permet d'importer automatiquement des établissements depuis Google Places API pour enrichir le catalogue d'EventLink Africa. Il respecte les conditions d'utilisation de Google et fournit un workflow complet pour la réclamation et la vérification des établissements par leurs propriétaires.

## 🏗️ Architecture

### Composants principaux

1. **ImportedPlace Entity** - Modèle de données pour les établissements importés
2. **GooglePlacesService** - Service d'intégration avec l'API Google Places
3. **PlacesImportService** - Service d'importation et de normalisation
4. **PlaceClaimService** - Service de gestion des réclamations
5. **PlacesImportController** - API REST pour l'importation et la gestion

### Flux de données

```
Google Places API → GooglePlacesService → PlacesImportService → Database
                                                              ↓
Frontend ← API Endpoints ← PlacesImportController ← PlaceClaimService
```

## 🚀 Configuration

### 1. Configuration Google Cloud Platform

1. Créez un compte sur [Google Cloud Platform](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Places
4. Créez une clé API
5. Configurez les quotas et la facturation

### 2. Configuration de l'environnement

Ajoutez dans `backend/.env` :

```env
GOOGLE_PLACES_API_KEY=votre_cle_api_google_places
```

### 3. Installation des dépendances

```bash
cd backend
npm install
```

### 4. Migration de la base de données

```bash
./scripts/run-migrations.sh
```

## 📊 Modèle de données

### ImportedPlace Entity

```typescript
{
  id: string;                    // UUID unique
  placeId: string;              // Google Places ID
  name: string;                 // Nom de l'établissement
  address: string;              // Adresse complète
  lat: number;                  // Latitude
  lng: number;                  // Longitude
  phone: string;                // Téléphone
  website: string;              // Site web
  googleTypes: string[];        // Types Google Places
  categories: string[];         // Catégories internes
  rating: number;               // Note moyenne
  userRatingsTotal: number;     // Nombre d'avis
  openingHours: object;         // Horaires d'ouverture
  photoReferences: string[];    // Références photos Google
  photoUrls: string[];          // URLs des photos
  businessStatus: string;       // Statut commercial
  priceLevel: number;           // Niveau de prix
  source: PlaceSource;          // Source d'importation
  status: PlaceStatus;          // Statut de l'établissement
  importDate: Date;             // Date d'importation
  lastChecked: Date;            // Dernière vérification
  ownerId: string;              // ID du propriétaire
  claimDate: Date;              // Date de réclamation
  claimContactEmail: string;    // Email de contact
  claimContactPhone: string;    // Téléphone de contact
  claimJustification: string;   // Justification de la réclamation
  verifiedDate: Date;           // Date de vérification
  verifiedBy: string;           // Vérifié par
  verificationNotes: string;    // Notes de vérification
  googleMapsUrl: string;        // URL Google Maps
  metadata: object;             // Métadonnées supplémentaires
}
```

### Statuts des établissements

- `imported` - Importé depuis Google Places
- `claimed` - Réclamé par un propriétaire
- `verified` - Vérifié par l'équipe
- `rejected` - Rejeté
- `pending_verification` - En attente de vérification

## 🔧 API Endpoints

### Importation

```bash
# Importation générale
POST /api/places-import/import
{
  "location": "Abidjan, Côte d'Ivoire",
  "radius": 5000,
  "type": "restaurant",
  "maxResults": 20,
  "updateExisting": true,
  "dryRun": false
}

# Importation par ville
POST /api/places-import/import/city
{
  "cityName": "Abidjan",
  "options": { "maxResults": 60 }
}

# Importation par coordonnées
POST /api/places-import/import/coordinates
{
  "lat": 5.3600,
  "lng": -4.0083,
  "radius": 5000
}

# Importation par catégorie
POST /api/places-import/import/category
{
  "category": "restaurant",
  "location": "Abidjan, Côte d'Ivoire"
}

# Importation en lot
POST /api/places-import/import/bulk
{
  "locations": [
    { "location": "Abidjan, Côte d'Ivoire", "radius": 10000 },
    { "location": "Dakar, Sénégal", "radius": 10000 }
  ]
}
```

### Gestion des établissements

```bash
# Récupérer les statistiques
GET /api/places-import/stats

# Lister les établissements
GET /api/places-import/places?status=imported&page=1&limit=20

# Récupérer un établissement
GET /api/places-import/places/:id

# Réimporter un établissement
POST /api/places-import/places/:id/reimport

# Réclamer un établissement
POST /api/places-import/places/:id/claim
{
  "contactEmail": "owner@example.com",
  "contactPhone": "+225123456789",
  "justification": "Je suis le propriétaire de cet établissement"
}

# Vérifier une réclamation
PUT /api/places-import/places/:id/verify
{
  "status": "verified",
  "notes": "Vérification réussie"
}
```

### Maintenance

```bash
# Trouver les doublons
GET /api/places-import/duplicates

# Nettoyer les anciens établissements
DELETE /api/places-import/cleanup?daysOld=30
```

## 🧪 Tests

### Test d'importation

```bash
./scripts/test-google-places-import.sh
```

### Test manuel

```bash
# Test dry run
curl -X POST http://localhost:3001/api/places-import/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "location": "Abidjan, Côte d'Ivoire",
    "radius": 5000,
    "type": "restaurant",
    "maxResults": 5,
    "dryRun": true
  }'
```

## 📈 Métriques et monitoring

### KPIs à suivre

- Nombre d'établissements importés par jour
- Taux d'import sans doublons
- Taux de réclamation par propriétaire
- Taux de conversion visiteur → contact propriétaire
- Coût API Google par mois
- Taux d'erreurs d'import

### Logs importants

- Requêtes API Google Places
- Erreurs d'importation
- Réclamations de propriétaires
- Vérifications d'établissements

## 🔒 Sécurité et conformité

### Respect des conditions d'utilisation

- Utilisation exclusive de l'API Google Places (pas de scraping)
- Respect des quotas et limites de taux
- Attribution appropriée des données
- Mécanisme de suppression/rectification

### Protection des données

- Données collectées sont publiques
- Mécanisme de suppression sur demande
- Mentions légales et provenance
- Chiffrement des données sensibles

## 🚨 Gestion des erreurs

### Erreurs courantes

1. **Quota dépassé** - Implémentation du rate limiting
2. **Clé API invalide** - Vérification de la configuration
3. **Erreurs de réseau** - Retry avec backoff exponentiel
4. **Données manquantes** - Validation et nettoyage

### Stratégies de récupération

- Retry automatique avec backoff
- Fallback sur données en cache
- Notification des erreurs critiques
- Logs détaillés pour debugging

## 📱 Interface utilisateur

### Frontend

- Affichage des établissements importés avec badge
- CTA "Réclamer cette fiche" visible
- Formulaire de réclamation simple
- Dashboard admin pour la gestion

### Dashboard opérationnel

- Liste des imports récents
- État des erreurs
- Outils de fusion et suppression
- Relancer l'importation par région

## 🔄 Workflow de réclamation

1. **Propriétaire clique "Réclamer"**
2. **Formulaire de réclamation** (nom, email, téléphone, justification)
3. **Backend envoie OTP** (SMS/email)
4. **OTP validé** → statut "claimed_pending_ops"
5. **Ops reçoit ticket** → vérification manuelle
6. **Bascule à "verified"** → email de bienvenue + accès éditeur

## 💰 Coûts et optimisation

### Estimation des coûts

- Google Places API : ~$0.017 par requête
- Stockage images : ~$0.023 par GB/mois
- SMS OTP : ~$0.01 par SMS

### Optimisations

- Cache des requêtes (TTL approprié)
- Réutilisation des place_id
- Import par lots
- Compression des images

## 🚀 Déploiement

### Environnement de développement

```bash
# Backend
cd backend
npm run start:with-db

# Frontend
cd frontend
npm run dev
```

### Environnement de production

```bash
# Build
npm run build

# Démarrage
npm run start:prod
```

## 📚 Ressources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Cloud Console](https://console.cloud.google.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [NestJS Documentation](https://docs.nestjs.com/)

## 🤝 Support

Pour toute question ou problème :

1. Consultez les logs du backend
2. Vérifiez la configuration de l'API key
3. Testez avec l'endpoint de santé
4. Contactez l'équipe de développement

---

**Note** : Ce système est conçu pour respecter les conditions d'utilisation de Google Places API et les réglementations sur la protection des données. Assurez-vous de respecter toutes les exigences légales dans votre juridiction.
