#!/bin/bash

# Script pour vérifier le statut du service Render spécifique
echo "🔍 Vérification du service Render spécifique"
echo "==========================================="

SERVICE_ID="srv-d36rf915pdvs73dc9b2g"
PROJECT_ID="prj-d36reom3jp1c73bfr25g"

echo "📋 Informations du service:"
echo "- Service ID: $SERVICE_ID"
echo "- Project ID: $PROJECT_ID"
echo "- Dashboard: https://dashboard.render.com/project/$PROJECT_ID"
echo ""

echo "🌐 Vérification de la connectivité Render..."
if curl -s --max-time 10 https://render.com > /dev/null; then
    echo "✅ Render.com accessible"
else
    echo "❌ Problème de connectivité avec Render.com"
fi

echo ""
echo "📊 Vérification des fichiers de déploiement..."
if [ -f "index.js" ]; then
    echo "✅ index.js présent"
else
    echo "❌ index.js manquant"
fi

if [ -f "dist/main.js" ]; then
    echo "✅ dist/main.js présent"
else
    echo "❌ dist/main.js manquant - compilation nécessaire"
    echo "Exécution de npm run build..."
    npm run build
fi

if [ -f "package.json" ]; then
    echo "✅ package.json présent"
    if grep -q '"main": "dist/main.js"' package.json; then
        echo "✅ Champ 'main' configuré"
    else
        echo "❌ Champ 'main' manquant"
    fi
else
    echo "❌ package.json manquant"
fi

if [ -f "render.yaml" ]; then
    echo "✅ render.yaml présent"
    if grep -q "startCommand: node index.js" render.yaml; then
        echo "✅ startCommand configuré"
    else
        echo "❌ startCommand incorrect"
    fi
else
    echo "❌ render.yaml manquant"
fi

echo ""
echo "🧪 Test local de l'application..."
echo "Arrêt des processus existants..."
pkill -f "node index.js" 2>/dev/null || true
sleep 2

echo "Démarrage de l'application..."
node index.js &
APP_PID=$!

sleep 5

echo "Test de l'endpoint de santé..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health 2>/dev/null)

if [ $? -eq 0 ] && echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo "✅ Application locale fonctionnelle"
    echo "📊 Réponse: $HEALTH_RESPONSE"
else
    echo "❌ Problème avec l'application locale"
    echo "📊 Réponse: $HEALTH_RESPONSE"
fi

kill $APP_PID 2>/dev/null
echo "🛑 Application arrêtée"

echo ""
echo "📋 Instructions pour vérifier le service Render:"
echo "1. Allez sur https://dashboard.render.com/project/$PROJECT_ID"
echo "2. Cliquez sur le service avec l'ID: $SERVICE_ID"
echo "3. Vérifiez l'onglet 'Logs' pour voir:"
echo "   - Les logs de build"
echo "   - Les logs de déploiement"
echo "   - Les logs d'application"
echo "4. Vérifiez l'onglet 'Settings' pour confirmer:"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: node index.js"
echo "   - Root Directory: backend"
echo "   - Health Check Path: /api/health"

echo ""
echo "🔍 Vérification des logs Render:"
echo "Dans les logs, recherchez:"
echo "✅ Messages de succès:"
echo "   - 'Build successful'"
echo "   - 'Deploy successful'"
echo "   - 'Application started'"
echo "   - '🚀 Lumina Africa API is running'"
echo ""
echo "❌ Messages d'erreur à surveiller:"
echo "   - 'Cannot find module'"
echo "   - 'Build failed'"
echo "   - 'Start failed'"
echo "   - 'Health check failed'"

echo ""
echo "🚀 Actions pour forcer le redéploiement:"
echo "1. Dans le dashboard Render:"
echo "   - Allez sur votre service"
echo "   - Cliquez sur 'Manual Deploy'"
echo "   - Sélectionnez 'Deploy latest commit'"
echo "2. Ou modifiez un fichier et poussez vers GitHub:"
echo "   - Touchez un fichier: touch backend/trigger-deploy.txt"
echo "   - Commit: git add . && git commit -m 'Trigger deployment'"
echo "   - Push: git push origin main"

echo ""
echo "🧪 Test de l'API déployée:"
echo "Une fois le service déployé, testez:"
echo "curl https://$SERVICE_ID.onrender.com/api/health"
echo "curl https://$SERVICE_ID.onrender.com/api/docs"

echo ""
echo "✅ Vérification terminée!"
