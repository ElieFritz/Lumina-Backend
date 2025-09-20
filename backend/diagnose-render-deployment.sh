#!/bin/bash

# Script de diagnostic complet pour le déploiement Render
echo "🔍 Diagnostic complet du déploiement Render"
echo "=========================================="

echo "📋 Informations du projet:"
echo "- Project ID: prj-d36reom3jp1c73bfr25g"
echo "- Dashboard: https://dashboard.render.com/project/prj-d36reom3jp1c73bfr25g"
echo ""

echo "🌐 Vérification de la connectivité Render..."
if curl -s --max-time 10 https://render.com > /dev/null; then
    echo "✅ Render.com accessible"
else
    echo "❌ Problème de connectivité avec Render.com"
fi

echo ""
echo "📊 Vérification des changements récents..."
echo "Derniers commits:"
git log --oneline -5

echo ""
echo "🔧 Configuration actuelle:"
echo "Build Command: npm install && npm run build"
echo "Start Command: node index.js"
echo "Root Directory: backend"
echo "Health Check Path: /api/health"
echo ""

echo "📁 Vérification des fichiers de déploiement..."
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

if [ -f "render.yaml" ]; then
    echo "✅ render.yaml présent"
    echo "Contenu de render.yaml:"
    cat render.yaml
else
    echo "❌ render.yaml manquant"
fi

echo ""
echo "🧪 Test local de l'application..."
echo "Démarrage de l'application en arrière-plan..."

# Arrêter tout processus existant sur le port 3001
pkill -f "node index.js" 2>/dev/null || true
sleep 2

# Démarrer l'application
node index.js &
APP_PID=$!

# Attendre que l'application démarre
sleep 5

# Tester l'endpoint de santé
echo "Test de l'endpoint de santé local..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health 2>/dev/null)

if [ $? -eq 0 ] && echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo "✅ Application locale fonctionnelle"
    echo "📊 Réponse: $HEALTH_RESPONSE"
else
    echo "❌ Problème avec l'application locale"
    echo "📊 Réponse: $HEALTH_RESPONSE"
fi

# Arrêter l'application
kill $APP_PID 2>/dev/null
echo "🛑 Application locale arrêtée"

echo ""
echo "📋 Instructions pour le déploiement Render:"
echo "1. Allez sur https://dashboard.render.com/project/prj-d36reom3jp1c73bfr25g"
echo "2. Vérifiez que le service 'lumina-africa-backend' existe"
echo "3. Si le service n'existe pas:"
echo "   - Cliquez sur 'New +' → 'Web Service'"
echo "   - Connectez le repository GitHub 'Lumina'"
echo "   - Configurez les paramètres selon render.yaml"
echo "4. Si le service existe, vérifiez les logs de déploiement"
echo "5. Notez l'URL du service déployé"

echo ""
echo "🔍 Vérification des logs Render:"
echo "1. Dans le dashboard Render, cliquez sur votre service"
echo "2. Allez dans l'onglet 'Logs'"
echo "3. Vérifiez s'il y a des erreurs de déploiement"
echo "4. Recherchez des messages comme:"
echo "   - 'Build successful'"
echo "   - 'Deploy successful'"
echo "   - 'Application started'"

echo ""
echo "🚨 Problèmes courants et solutions:"
echo "1. Si 'Build failed': Vérifiez les dépendances dans package.json"
echo "2. Si 'Start failed': Vérifiez que index.js et dist/main.js existent"
echo "3. Si 'Health check failed': Vérifiez que /api/health répond"
echo "4. Si 'Port already in use': Vérifiez la configuration du port"

echo ""
echo "✅ Diagnostic terminé!"
