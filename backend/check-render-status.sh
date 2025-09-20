#!/bin/bash

# Script pour vérifier le statut du déploiement Render
echo "🔍 Vérification du statut du déploiement Render"
echo "=============================================="

# Configuration
REPO_URL="https://github.com/ElieFritz/Lumina"
SERVICE_NAME="lumina-africa-backend"

echo "📋 Informations du service:"
echo "- Repository: $REPO_URL"
echo "- Service: $SERVICE_NAME"
echo ""

# Vérifier si curl est installé
if ! command -v curl &> /dev/null; then
    echo "❌ curl n'est pas installé. Installez-le avec: brew install curl"
    exit 1
fi

echo "🌐 Vérification de la connectivité..."
if curl -s --head https://render.com > /dev/null; then
    echo "✅ Render.com accessible"
else
    echo "❌ Impossible d'accéder à Render.com"
fi

echo ""
echo "📊 Instructions pour vérifier le déploiement:"
echo "1. Allez sur https://dashboard.render.com"
echo "2. Connectez-vous à votre compte"
echo "3. Recherchez le service '$SERVICE_NAME'"
echo "4. Vérifiez les logs de déploiement"
echo "5. Notez l'URL de votre service déployé"
echo ""

echo "🧪 Test de l'API (remplacez YOUR_SERVICE_URL par l'URL réelle):"
echo "curl https://YOUR_SERVICE_URL.onrender.com/api/health"
echo ""

echo "📝 URLs de test une fois déployé:"
echo "- Health Check: https://YOUR_SERVICE_URL.onrender.com/api/health"
echo "- Swagger Docs: https://YOUR_SERVICE_URL.onrender.com/api/docs"
echo "- API Base: https://YOUR_SERVICE_URL.onrender.com/api"
echo ""

echo "🔧 Configuration actuelle:"
echo "- Build Command: npm install && npm run build"
echo "- Start Command: node index.js"
echo "- Root Directory: backend"
echo "- Health Check Path: /api/health"
echo ""

echo "✅ Script de vérification terminé!"
echo ""
echo "💡 Si le service n'existe pas encore sur Render:"
echo "1. Allez sur https://dashboard.render.com"
echo "2. Cliquez sur 'New +' puis 'Web Service'"
echo "3. Connectez votre repository GitHub"
echo "4. Sélectionnez le repository 'Lumina'"
echo "5. Configurez les paramètres:"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: node index.js"
echo "   - Root Directory: backend"
echo "   - Health Check Path: /api/health"
echo "6. Ajoutez les variables d'environnement du fichier render.yaml"
