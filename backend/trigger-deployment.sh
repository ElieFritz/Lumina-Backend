#!/bin/bash

# Script pour forcer le redéploiement sur Render
echo "🚀 Déclenchement du redéploiement Render"
echo "======================================"

SERVICE_ID="srv-d36rf915pdvs73dc9b2g"
PROJECT_ID="prj-d36reom3jp1c73bfr25g"

echo "📋 Informations du service:"
echo "- Service ID: $SERVICE_ID"
echo "- Project ID: $PROJECT_ID"
echo ""

echo "🔧 Vérification des fichiers de déploiement..."
if [ -f "index.js" ] && [ -f "dist/main.js" ] && [ -f "package.json" ] && [ -f "render.yaml" ]; then
    echo "✅ Tous les fichiers nécessaires présents"
else
    echo "❌ Fichiers manquants - arrêt du script"
    exit 1
fi

echo ""
echo "📝 Création d'un fichier de déclenchement..."
echo "Deployment trigger - $(date)" > backend/trigger-deploy.txt
echo "✅ Fichier trigger-deploy.txt créé"

echo ""
echo "📤 Commit et push des changements..."
git add .
git commit -m "Trigger deployment - $(date)"
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Changements poussés vers GitHub avec succès"
else
    echo "❌ Erreur lors du push vers GitHub"
    exit 1
fi

echo ""
echo "⏳ Attente du déclenchement du déploiement..."
echo "Le déploiement peut prendre 2-5 minutes"
echo ""

echo "🔍 Instructions pour vérifier le déploiement:"
echo "1. Allez sur https://dashboard.render.com/project/$PROJECT_ID"
echo "2. Cliquez sur le service $SERVICE_ID"
echo "3. Vérifiez l'onglet 'Logs' pour voir le déploiement en cours"
echo "4. Attendez que le statut passe à 'Live'"
echo ""

echo "🧪 Test de l'API une fois déployée:"
echo "curl https://$SERVICE_ID.onrender.com/api/health"
echo "curl https://$SERVICE_ID.onrender.com/api/docs"
echo ""

echo "⏰ Vérification automatique dans 30 secondes..."
sleep 30

echo "🔍 Test de l'API déployée..."
API_RESPONSE=$(curl -s --max-time 10 "https://$SERVICE_ID.onrender.com/api/health" 2>/dev/null)

if [ $? -eq 0 ] && echo "$API_RESPONSE" | grep -q "ok"; then
    echo "✅ API déployée et accessible!"
    echo "📊 Réponse: $API_RESPONSE"
    echo ""
    echo "🎉 Déploiement réussi!"
    echo "🔗 URLs disponibles:"
    echo "- Health Check: https://$SERVICE_ID.onrender.com/api/health"
    echo "- Swagger Docs: https://$SERVICE_ID.onrender.com/api/docs"
    echo "- API Base: https://$SERVICE_ID.onrender.com/api"
else
    echo "⏳ API pas encore accessible - le déploiement peut encore être en cours"
    echo "📊 Réponse: $API_RESPONSE"
    echo ""
    echo "💡 Vérifiez manuellement dans quelques minutes:"
    echo "1. Dashboard Render: https://dashboard.render.com/project/$PROJECT_ID"
    echo "2. Logs du service pour voir l'état du déploiement"
    echo "3. Testez: curl https://$SERVICE_ID.onrender.com/api/health"
fi

echo ""
echo "✅ Script de déclenchement terminé!"
