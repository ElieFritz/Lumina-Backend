#!/bin/bash

# Script de diagnostic final pour le problème 502 Bad Gateway
echo "🔍 Diagnostic Final - Problème 502 Bad Gateway"
echo "============================================="

SERVICE_ID="srv-d36rf915pdvs73dc9b2g"
PROJECT_ID="prj-d36reom3jp1c73bfr25g"
API_URL="https://lumina-csjl.onrender.com"

echo "📋 Informations du service:"
echo "- Service ID: $SERVICE_ID"
echo "- Project ID: $PROJECT_ID"
echo "- API URL: $API_URL"
echo ""

echo "🔍 Vérification des fichiers de déploiement..."
echo "1. Fichier index.js:"
if [ -f "index.js" ]; then
    echo "✅ Présent"
    echo "Contenu:"
    cat index.js
else
    echo "❌ Manquant"
fi

echo ""
echo "2. Fichier dist/main.js:"
if [ -f "dist/main.js" ]; then
    echo "✅ Présent"
    echo "Taille: $(ls -lh dist/main.js | awk '{print $5}')"
else
    echo "❌ Manquant - compilation nécessaire"
    echo "Exécution de npm run build..."
    npm run build
fi

echo ""
echo "3. Fichier package.json:"
if [ -f "package.json" ]; then
    echo "✅ Présent"
    echo "Champ 'main': $(grep '"main"' package.json)"
    echo "Scripts disponibles:"
    grep '"scripts"' -A 10 package.json
else
    echo "❌ Manquant"
fi

echo ""
echo "4. Fichier render.yaml:"
if [ -f "render.yaml" ]; then
    echo "✅ Présent"
    echo "Configuration:"
    cat render.yaml
else
    echo "❌ Manquant"
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
echo "🌐 Test de l'API déployée..."
API_RESPONSE=$(curl -s --max-time 10 "$API_URL/api/health" 2>/dev/null)

if [ $? -eq 0 ]; then
    if echo "$API_RESPONSE" | grep -q "ok"; then
        echo "✅ API déployée fonctionnelle"
        echo "📊 Réponse: $API_RESPONSE"
    else
        echo "❌ API déployée retourne une erreur"
        echo "📊 Réponse: $API_RESPONSE"
    fi
else
    echo "❌ API déployée non accessible"
    echo "📊 Code d'erreur: $?"
fi

echo ""
echo "🔍 Analyse du problème 502 Bad Gateway:"
echo "Une erreur 502 Bad Gateway indique que:"
echo "1. Le service Render est déployé et accessible"
echo "2. Mais l'application Node.js ne démarre pas correctement"
echo "3. Ou l'application démarre mais crash immédiatement"
echo "4. Ou l'application ne répond pas sur le port attendu"

echo ""
echo "💡 Solutions possibles:"
echo "1. Vérifiez les logs du service sur Render:"
echo "   - Allez sur https://dashboard.render.com/project/$PROJECT_ID"
echo "   - Cliquez sur le service $SERVICE_ID"
echo "   - Consultez l'onglet 'Logs'"
echo ""
echo "2. Vérifiez la configuration du service:"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: node index.js"
echo "   - Root Directory: backend"
echo "   - Health Check Path: /api/health"
echo ""
echo "3. Problèmes courants:"
echo "   - Variables d'environnement manquantes"
echo "   - Port incorrect (doit être 10000 pour Render)"
echo "   - Erreurs de compilation TypeScript"
echo "   - Dépendances manquantes"
echo "   - Erreurs de base de données"

echo ""
echo "🔧 Actions recommandées:"
echo "1. Vérifiez les logs Render pour voir l'erreur exacte"
echo "2. Assurez-vous que toutes les variables d'environnement sont configurées"
echo "3. Vérifiez que l'application démarre sur le port 10000"
echo "4. Testez localement avec les mêmes variables d'environnement"

echo ""
echo "📊 Résumé:"
echo "- Service Render: Déployé mais non fonctionnel"
echo "- Application locale: $(if [ -f "dist/main.js" ]; then echo "Compilée"; else echo "Non compilée"; fi)"
echo "- Configuration: $(if [ -f "render.yaml" ]; then echo "Présente"; else echo "Manquante"; fi)"
echo "- Problème: 502 Bad Gateway - Application ne démarre pas sur Render"

echo ""
echo "✅ Diagnostic terminé!"
