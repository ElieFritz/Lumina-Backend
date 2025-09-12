#!/bin/bash

echo "🗄️  TEST CONNEXION BASE DE DONNÉES - EventLink Africa"
echo "===================================================="
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

# Test 1: Connexion de base
echo "1. Test de connexion PostgreSQL..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Connexion PostgreSQL: OK"
else
    echo "❌ Connexion PostgreSQL: ERREUR"
    exit 1
fi

# Test 2: Vérifier la base de données
echo "2. Vérification de la base de données..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT current_database();" > /dev/null 2>&1; then
    echo "✅ Base de données '$DB_NAME': OK"
else
    echo "❌ Base de données '$DB_NAME': ERREUR"
    exit 1
fi

# Test 3: Lister les tables existantes
echo "3. Tables existantes:"
TABLES=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';" 2>/dev/null)
if [ -n "$TABLES" ]; then
    echo "$TABLES" | while read table; do
        if [ -n "$table" ]; then
            echo "   • $table"
        fi
    done
else
    echo "   (Aucune table trouvée - base de données vide)"
fi

# Test 4: Test PostGIS (optionnel)
echo "4. Test extension PostGIS..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT PostGIS_version();" > /dev/null 2>&1; then
    echo "✅ PostGIS: Disponible"
else
    echo "⚠️  PostGIS: Non installé (optionnel)"
fi

echo ""
echo "🔗 Informations de connexion pour pgAdmin:"
echo "• Host: $DB_HOST"
echo "• Port: $DB_PORT"
echo "• Database: $DB_NAME"
echo "• Username: $DB_USER"
echo "• Password: $DB_PASSWORD"
echo ""

echo "📋 Commandes utiles:"
echo "• Se connecter: PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
echo "• Lister les tables: \dt"
echo "• Quitter: \q"
echo ""

echo "✅ Test de connexion terminé avec succès!"
