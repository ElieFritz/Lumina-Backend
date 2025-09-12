#!/bin/bash

echo "🔄 Redémarrage du frontend EventLink Africa..."

# Arrêter tous les processus Node.js sur le port 3000
echo "🛑 Arrêt des processus existants..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Attendre un moment
sleep 2

# Aller dans le dossier frontend
cd /Users/macmiui/lumina/Lumina/frontend

# Nettoyer le cache Next.js
echo "🧹 Nettoyage du cache..."
rm -rf .next

# Redémarrer le frontend
echo "🚀 Redémarrage du frontend..."
npm run dev
