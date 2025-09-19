# Guide de Configuration Supabase avec Prisma

Ce guide vous explique comment configurer Supabase comme base de données pour le projet Lumina Africa en utilisant Prisma.

## 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Choisissez votre organisation
5. Remplissez les informations du projet :
   - **Name**: `lumina-africa`
   - **Database Password**: Choisissez un mot de passe fort
   - **Region**: Choisissez la région la plus proche (Europe pour l'Afrique)
6. Cliquez sur "Create new project"

## 2. Récupérer les informations de connexion

Une fois le projet créé :

1. Allez dans **Settings** > **Database**
2. Copiez les informations suivantes :
   - **Host**: `db.xxxxx.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: Le mot de passe que vous avez choisi

## 3. Configurer l'environnement

Créez un fichier `.env` dans le dossier `backend/` avec les informations suivantes :

```env
# Database - Supabase
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres?schema=public"
POSTGRES_HOST=db.xxxxx.supabase.co
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=VOTRE_MOT_DE_PASSE

# Autres variables...
JWT_SECRET=lumina-africa-super-secret-jwt-key-2024-production-ready
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
```

## 4. Générer le client Prisma

```bash
cd backend
npm run prisma:generate
```

## 5. Appliquer le schéma à Supabase

```bash
# Option 1: Push du schéma (pour le développement)
npm run prisma:push

# Option 2: Migration (pour la production)
npm run prisma:migrate
```

## 6. Vérifier la connexion

```bash
# Démarrer l'application avec Prisma
npm run start:prisma
```

## 7. Utiliser Prisma Studio (optionnel)

Pour visualiser et gérer vos données :

```bash
npm run prisma:studio
```

Cela ouvrira Prisma Studio dans votre navigateur.

## 8. Configuration PostGIS (pour les coordonnées géographiques)

Supabase inclut PostGIS par défaut. Pour utiliser les fonctionnalités géospatiales :

1. Allez dans **SQL Editor** dans votre dashboard Supabase
2. Exécutez cette requête pour activer PostGIS :

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

## 9. Configuration des RLS (Row Level Security)

Pour la sécurité des données, configurez RLS dans Supabase :

1. Allez dans **Authentication** > **Policies**
2. Créez des politiques pour chaque table selon vos besoins

Exemple de politique pour la table `users` :

```sql
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);
```

## 10. Variables d'environnement pour la production

Pour le déploiement en production, configurez ces variables dans votre plateforme de déploiement :

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `NODE_ENV=production`

## 11. Monitoring et logs

- Utilisez le dashboard Supabase pour surveiller les performances
- Consultez les logs dans **Logs** > **Database**
- Surveillez l'utilisation des ressources dans **Settings** > **Usage**

## 12. Sauvegarde et récupération

- Les sauvegardes automatiques sont incluses avec Supabase
- Pour des sauvegardes manuelles, utilisez l'outil `pg_dump`
- Pour la récupération, utilisez l'outil `psql`

## Commandes utiles

```bash
# Générer le client Prisma
npm run prisma:generate

# Appliquer les changements de schéma
npm run prisma:push

# Créer une migration
npm run prisma:migrate

# Ouvrir Prisma Studio
npm run prisma:studio

# Démarrer l'application avec Prisma
npm run start:prisma

# Reset de la base de données (ATTENTION: supprime toutes les données)
npx prisma migrate reset
```

## Dépannage

### Erreur de connexion
- Vérifiez que l'URL de connexion est correcte
- Vérifiez que le mot de passe est correct
- Vérifiez que l'IP est autorisée (si applicable)

### Erreur de schéma
- Vérifiez que PostGIS est activé
- Vérifiez que les types de données correspondent
- Regardez les logs Supabase pour plus de détails

### Performance
- Utilisez les index appropriés
- Surveillez les requêtes lentes dans les logs
- Considérez l'utilisation de la mise en cache Redis

## Support

- Documentation Prisma: https://www.prisma.io/docs
- Documentation Supabase: https://supabase.com/docs
- Support communautaire: https://github.com/supabase/supabase/discussions
