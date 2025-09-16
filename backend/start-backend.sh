#!/bin/bash

echo "🚀 Démarrage du backend Lumina Africa..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le dossier backend."
    exit 1
fi

# Vérifier la connexion à la base de données
echo "🔍 Test de la connexion à la base de données..."
node test-db-connection.js

if [ $? -eq 0 ]; then
    echo "✅ Base de données accessible"
else
    echo "❌ Problème de connexion à la base de données"
    exit 1
fi

# Démarrer le backend
echo "🚀 Démarrage du backend..."
npm run start:simple
