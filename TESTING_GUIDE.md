# 🧪 Guide de Test - EventLink Africa

## ✅ Tests de Base

### 1. Test de Compilation Frontend

```bash
cd frontend
npm run build
```

**Résultat attendu :** Compilation réussie sans erreurs

### 2. Test de Lancement Frontend

```bash
cd frontend
npm run dev
```

**Résultat attendu :** 
- Serveur démarre sur http://localhost:3000
- Pas d'erreurs dans la console
- Page d'accueil s'affiche correctement

### 3. Test de Compilation Backend

```bash
cd backend
npm run build
```

**Résultat attendu :** Compilation réussie sans erreurs TypeScript

### 4. Test de Lancement Backend

```bash
cd backend
npm run start:dev
```

**Résultat attendu :**
- Serveur démarre sur http://localhost:3001
- Pas d'erreurs de connexion à la base de données
- API accessible sur http://localhost:3001/api

## 🔍 Tests de Fonctionnalités

### Frontend - Page d'Accueil

1. **Navigation**
   - [ ] Header s'affiche correctement
   - [ ] Menu de navigation fonctionne
   - [ ] Logo et liens sont visibles

2. **Section Hero**
   - [ ] Titre principal s'affiche
   - [ ] Formulaire de recherche est présent
   - [ ] Bouton de recherche fonctionne
   - [ ] Statistiques s'affichent

3. **Section Établissements**
   - [ ] Cartes d'établissements s'affichent
   - [ ] Images se chargent correctement
   - [ ] Liens vers les détails fonctionnent

4. **Section Catégories**
   - [ ] Toutes les catégories s'affichent
   - [ ] Icônes et emojis sont visibles
   - [ ] Liens vers les catégories fonctionnent

5. **Section Comment ça marche**
   - [ ] 4 étapes s'affichent
   - [ ] Icônes et numéros sont visibles
   - [ ] Descriptions sont lisibles

6. **Section Témoignages**
   - [ ] 3 témoignages s'affichent
   - [ ] Étoiles de notation sont visibles
   - [ ] Photos de profil s'affichent

7. **Section Newsletter**
   - [ ] Formulaire d'inscription s'affiche
   - [ ] Validation email fonctionne
   - [ ] Message de confirmation s'affiche

8. **Footer**
   - [ ] Liens et informations s'affichent
   - [ ] Réseaux sociaux sont présents

### Backend - API

1. **Endpoints de Base**
   - [ ] GET /api/health - Retourne 200 OK
   - [ ] GET /api/docs - Documentation Swagger accessible

2. **Authentification**
   - [ ] POST /api/auth/register - Inscription
   - [ ] POST /api/auth/login - Connexion
   - [ ] POST /api/auth/forgot-password - Mot de passe oublié

3. **Utilisateurs**
   - [ ] GET /api/users/profile - Profil utilisateur
   - [ ] PATCH /api/users/profile - Mise à jour profil

4. **Établissements**
   - [ ] GET /api/venues - Liste établissements
   - [ ] POST /api/venues - Créer établissement
   - [ ] GET /api/venues/:id - Détails établissement

## 🐛 Tests de Dépannage

### Erreurs Courantes

1. **Erreur Tailwind CSS**
   ```
   Error: Cannot find module '@tailwindcss/forms'
   ```
   **Solution :** Les plugins sont commentés dans `tailwind.config.js`

2. **Erreur Next.js Configuration**
   ```
   destination does not start with /, http://, or https://
   ```
   **Solution :** Vérifier `NEXT_PUBLIC_API_URL` dans les variables d'environnement

3. **Erreur de Port**
   ```
   Port 3000 is already in use
   ```
   **Solution :** Tuer les processus ou utiliser un autre port

4. **Erreur de Base de Données**
   ```
   Connection refused
   ```
   **Solution :** Démarrer PostgreSQL ou utiliser Docker

## 📊 Tests de Performance

### Frontend

1. **Temps de Chargement**
   - [ ] Page d'accueil < 3 secondes
   - [ ] Images optimisées
   - [ ] CSS/JS minifiés en production

2. **Responsive Design**
   - [ ] Mobile (320px+)
   - [ ] Tablet (768px+)
   - [ ] Desktop (1024px+)

### Backend

1. **Temps de Réponse API**
   - [ ] GET /api/venues < 500ms
   - [ ] POST /api/auth/login < 1s
   - [ ] Recherche géospatiale < 2s

## 🔒 Tests de Sécurité

1. **Authentification**
   - [ ] JWT tokens valides
   - [ ] Mots de passe chiffrés
   - [ ] Sessions sécurisées

2. **Validation**
   - [ ] Données d'entrée validées
   - [ ] Protection CSRF
   - [ ] Rate limiting

## 📱 Tests Multi-Plateformes

### Navigateurs
- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)

### Appareils
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (tous navigateurs)

## 🚀 Tests de Déploiement

### Staging
- [ ] Build réussit
- [ ] Tests passent
- [ ] Déploiement automatique

### Production
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] SSL/HTTPS activé
- [ ] Monitoring configuré

## 📝 Rapport de Test

### Template de Rapport

```markdown
# Rapport de Test - EventLink Africa

**Date :** [DATE]
**Version :** [VERSION]
**Testeur :** [NOM]

## Résumé
- Tests passés : X/Y
- Erreurs critiques : X
- Erreurs mineures : X

## Détails des Tests

### Frontend
- [ ] Compilation
- [ ] Lancement
- [ ] Navigation
- [ ] Responsive

### Backend
- [ ] Compilation
- [ ] Lancement
- [ ] API
- [ ] Base de données

## Problèmes Identifiés

1. **Critique :** [Description]
2. **Mineur :** [Description]

## Recommandations

1. [Recommandation 1]
2. [Recommandation 2]
```

## 🎯 Critères d'Acceptation

### MVP Sprint 1
- [ ] Authentification fonctionnelle
- [ ] CRUD établissements
- [ ] Interface utilisateur responsive
- [ ] API documentée
- [ ] Base de données configurée

### Prêt pour Sprint 2
- [ ] Tous les tests passent
- [ ] Aucune erreur critique
- [ ] Performance acceptable
- [ ] Documentation à jour
