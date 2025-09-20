#!/bin/bash

# Script de diagnostic pour le déploiement Lumina Backend
echo "🔍 Diagnostic du déploiement Lumina Backend"
echo "=========================================="

# Vérifier la structure des fichiers
echo "📁 Vérification de la structure des fichiers..."
if [ -f "index.js" ]; then
    echo "✅ index.js trouvé"
else
    echo "❌ index.js manquant"
fi

if [ -f "dist/main.js" ]; then
    echo "✅ dist/main.js trouvé"
else
    echo "❌ dist/main.js manquant - exécutez 'npm run build'"
fi

if [ -f "package.json" ]; then
    echo "✅ package.json trouvé"
    if grep -q '"main": "dist/main.js"' package.json; then
        echo "✅ Champ 'main' configuré correctement"
    else
        echo "❌ Champ 'main' manquant dans package.json"
    fi
else
    echo "❌ package.json manquant"
fi

if [ -f "render.yaml" ]; then
    echo "✅ render.yaml trouvé"
    if grep -q "startCommand: node index.js" render.yaml; then
        echo "✅ startCommand configuré correctement"
    else
        echo "❌ startCommand incorrect dans render.yaml"
    fi
else
    echo "❌ render.yaml manquant"
fi

echo ""
echo "🚀 Test local de l'application..."
echo "Démarrage de l'application en arrière-plan..."

# Démarrer l'application en arrière-plan
node index.js &
APP_PID=$!

# Attendre que l'application démarre
sleep 5

# Tester l'endpoint de santé
echo "Test de l'endpoint de santé..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health 2>/dev/null)

if [ $? -eq 0 ] && echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo "✅ Application démarrée avec succès"
    echo "📊 Réponse de santé: $HEALTH_RESPONSE"
else
    echo "❌ Échec du démarrage de l'application"
    echo "📊 Réponse: $HEALTH_RESPONSE"
fi

# Arrêter l'application
kill $APP_PID 2>/dev/null
echo "🛑 Application arrêtée"

echo ""
echo "📋 Instructions pour le déploiement:"
echo "1. Les changements ont été poussés vers GitHub"
echo "2. Render devrait automatiquement redéployer"
echo "3. Vérifiez les logs de déploiement sur Render"
echo "4. Testez l'URL de production une fois déployé"
echo ""
echo "🔗 URLs importantes:"
echo "- GitHub: https://github.com/ElieFritz/Lumina"
echo "- Render Dashboard: https://dashboard.render.com"
echo "- API Health: https://votre-app.onrender.com/api/health"
echo "- Swagger Docs: https://votre-app.onrender.com/api/docs"
