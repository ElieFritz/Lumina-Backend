#!/bin/bash

echo "🗄️  EXÉCUTION DES MIGRATIONS - EventLink Africa"
echo "=============================================="
echo ""

# Configuration
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="lumina2024"
DB_NAME="lumina_africa"

# Ajouter PostgreSQL au PATH
export PATH="/Library/PostgreSQL/17/bin:$PATH"

echo "🔧 Configuration:"
echo "• Host: $DB_HOST"
echo "• Port: $DB_PORT"
echo "• User: $DB_USER"
echo "• Database: $DB_NAME"
echo ""

# Vérifier la connexion
echo "1. Test de connexion..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Connexion PostgreSQL: OK"
else
    echo "❌ Connexion PostgreSQL: ERREUR"
    exit 1
fi

# Aller dans le dossier backend
cd backend

echo ""
echo "2. Installation des dépendances TypeORM..."
npm install typeorm

echo ""
echo "3. Génération des migrations..."
npx typeorm migration:generate src/migrations/InitialTables -d src/database/data-source.ts

echo ""
echo "4. Exécution des migrations..."
npx typeorm migration:run -d src/database/data-source.ts

echo ""
echo "5. Vérification des tables créées..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"

echo ""
echo "✅ Migrations terminées avec succès!"
echo ""
echo "📋 Tables créées:"
echo "• users - Utilisateurs"
echo "• venues - Lieux/Établissements"
echo "• venue_images - Images des lieux"
echo "• events - Événements"
echo "• event_images - Images des événements"
echo "• bookings - Réservations"
echo "• reviews - Avis et commentaires"
echo "• migrations - Historique des migrations"
echo ""
echo "🔗 Vous pouvez maintenant utiliser pgAdmin pour explorer la base de données!"
