#!/bin/bash

# Script pour mettre à jour l'URL du frontend
echo "🔗 Mise à jour de l'URL du backend dans le frontend..."

# Demander l'URL du backend Render
echo "Entrez l'URL de votre backend Render (ex: https://lumina-africa-backend.onrender.com):"
read RENDER_URL

if [ -z "$RENDER_URL" ]; then
    echo "❌ URL vide, utilisation de l'URL par défaut"
    RENDER_URL="https://lumina-africa-backend.onrender.com"
fi

echo "🔄 Mise à jour de next.config.js..."
sed -i.bak "s|https://lumina-africa-backend.onrender.com|$RENDER_URL|g" frontend/next.config.js

echo "🔄 Mise à jour de vercel.json..."
sed -i.bak "s|https://lumina-africa-backend.onrender.com|$RENDER_URL|g" frontend/vercel.json

echo "📤 Poussage des modifications..."
git add .
git commit -m "🔗 Update frontend to use Render backend: $RENDER_URL"
git push origin main

echo "✅ Frontend mis à jour avec l'URL: $RENDER_URL"
echo "🚀 Vercel va automatiquement redéployer le frontend"
