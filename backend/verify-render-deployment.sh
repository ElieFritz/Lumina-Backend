#!/bin/bash

# Script pour vérifier le statut du déploiement Render
echo "🔍 Vérification du statut du déploiement Render"
echo "=============================================="

echo "📋 Informations du projet:"
echo "- Project ID: prj-d36reom3jp1c73bfr25g"
echo "- Repository: https://github.com/ElieFritz/Lumina"
echo "- Dernier commit: $(git log -1 --oneline)"
echo ""

echo "🌐 Vérification de la connectivité..."
if curl -s --max-time 10 https://render.com > /dev/null; then
    echo "✅ Render.com accessible"
else
    echo "❌ Problème de connectivité avec Render.com"
fi

echo ""
echo "📊 Vérification des fichiers de déploiement..."
if [ -f "index.js" ]; then
    echo "✅ index.js présent"
    echo "   Contenu: $(cat index.js)"
else
    echo "❌ index.js manquant"
fi

if [ -f "dist/main.js" ]; then
    echo "✅ dist/main.js présent"
else
    echo "❌ dist/main.js manquant"
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
echo "📋 Instructions pour vérifier le déploiement Render:"
echo "1. Allez sur https://dashboard.render.com/project/prj-d36reom3jp1c73bfr25g"
echo "2. Vérifiez que le service 'lumina-africa-backend' existe"
echo "3. Si le service n'existe pas:"
echo "   - Cliquez sur 'New +' → 'Web Service'"
echo "   - Connectez le repository GitHub 'Lumina'"
echo "   - Configurez selon render.yaml"
echo "4. Si le service existe:"
echo "   - Vérifiez les logs de déploiement"
echo "   - Recherchez des erreurs ou des messages de succès"
echo "   - Notez l'URL du service"

echo ""
echo "🔍 Vérification des logs Render:"
echo "1. Dans le dashboard Render, cliquez sur votre service"
echo "2. Allez dans l'onglet 'Logs'"
echo "3. Recherchez:"
echo "   - 'Build successful'"
echo "   - 'Deploy successful'"
echo "   - 'Application started'"
echo "   - Ou des erreurs spécifiques"

echo ""
echo "🧪 Test de l'API déployée:"
echo "Une fois l'URL du service connue, testez:"
echo "curl https://VOTRE_URL.onrender.com/api/health"
echo "curl https://VOTRE_URL.onrender.com/api/docs"

echo ""
echo "✅ Vérification terminée!"
