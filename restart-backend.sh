#!/bin/bash

echo "🔄 Redémarrage du backend EventLink Africa..."

# Arrêter tous les processus Node.js sur le port 3001
echo "🛑 Arrêt des processus existants..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Attendre un moment
sleep 2

# Aller dans le dossier backend
cd /Users/macmiui/lumina/Lumina/backend

# Nettoyer le cache de compilation
echo "🧹 Nettoyage du cache..."
rm -rf dist

# Redémarrer le backend
echo "🚀 Redémarrage du backend..."
npm run start:dev
