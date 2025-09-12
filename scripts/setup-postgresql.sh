#!/bin/bash

echo "🐘 CONFIGURATION POSTGRESQL - EventLink Africa"
echo "=============================================="
echo ""

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé"
    echo "   Installation avec Homebrew..."
    brew install postgresql@17
    echo "✅ PostgreSQL installé"
else
    echo "✅ PostgreSQL déjà installé"
fi

# Ajouter PostgreSQL au PATH
export PATH="/Library/PostgreSQL/17/bin:$PATH"
export PATH="/opt/homebrew/bin:$PATH"

echo ""
echo "🔧 Configuration de la base de données..."

# Démarrer PostgreSQL
echo "• Démarrage du service PostgreSQL..."
brew services start postgresql@17 2>/dev/null || echo "Service déjà démarré"

# Attendre que le service soit prêt
sleep 3

# Créer la base de données
echo "• Création de la base de données 'lumina_africa'..."
createdb lumina_africa 2>/dev/null || echo "Base de données existe déjà"

# Se connecter et activer PostGIS
echo "• Activation de l'extension PostGIS..."
psql -d lumina_africa -c "CREATE EXTENSION IF NOT EXISTS postgis;" 2>/dev/null || echo "PostGIS déjà activé ou erreur"

echo ""
echo "📊 Test de connexion..."
if psql -d lumina_africa -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Connexion à PostgreSQL réussie"
    echo ""
    echo "🔍 Informations de connexion:"
    echo "• Host: localhost"
    echo "• Port: 5432"
    echo "• Database: lumina_africa"
    echo "• User: $(whoami)"
    echo ""
    echo "📋 Commandes utiles:"
    echo "• Se connecter: psql -d lumina_africa"
    echo "• Lister les tables: \dt"
    echo "• Quitter: \q"
    echo ""
    echo "🌐 Interfaces graphiques recommandées:"
    echo "• DBeaver (gratuit): brew install --cask dbeaver-community"
    echo "• TablePlus (macOS): brew install --cask tableplus"
    echo "• pgAdmin: brew install --cask pgadmin4"
else
    echo "❌ Erreur de connexion à PostgreSQL"
    echo "   Vérifiez que le service est démarré: brew services list | grep postgresql"
fi

echo ""
echo "✅ Configuration PostgreSQL terminée!"
