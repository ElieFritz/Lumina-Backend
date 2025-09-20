#!/bin/bash

# Script pour surveiller le déploiement Render
echo "📊 Surveillance du déploiement Render"
echo "===================================="

SERVICE_ID="srv-d36rf915pdvs73dc9b2g"
PROJECT_ID="prj-d36reom3jp1c73bfr25g"
API_URL="https://$SERVICE_ID.onrender.com"

echo "📋 Informations du service:"
echo "- Service ID: $SERVICE_ID"
echo "- Project ID: $PROJECT_ID"
echo "- API URL: $API_URL"
echo ""

echo "🔍 Vérification du statut du déploiement..."
echo "Test de l'API toutes les 30 secondes..."
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

# Compteur pour les tentatives
attempt=1
max_attempts=20

while [ $attempt -le $max_attempts ]; do
    echo "🔄 Tentative $attempt/$max_attempts - $(date)"
    
    # Test de l'API
    API_RESPONSE=$(curl -s --max-time 10 "$API_URL/api/health" 2>/dev/null)
    curl_exit_code=$?
    
    if [ $curl_exit_code -eq 0 ]; then
        if echo "$API_RESPONSE" | grep -q "ok"; then
            echo "✅ API accessible et fonctionnelle!"
            echo "📊 Réponse: $API_RESPONSE"
            echo ""
            echo "🎉 Déploiement réussi!"
            echo "🔗 URLs disponibles:"
            echo "- Health Check: $API_URL/api/health"
            echo "- Swagger Docs: $API_URL/api/docs"
            echo "- API Base: $API_URL/api"
            echo ""
            echo "🧪 Tests supplémentaires:"
            
            # Test Swagger
            echo "Test de Swagger..."
            SWAGGER_RESPONSE=$(curl -s --max-time 10 "$API_URL/api/docs" 2>/dev/null)
            if [ $? -eq 0 ]; then
                echo "✅ Swagger accessible"
            else
                echo "❌ Swagger non accessible"
            fi
            
            # Test des utilisateurs
            echo "Test de l'API Users..."
            USERS_RESPONSE=$(curl -s --max-time 10 "$API_URL/api/users" 2>/dev/null)
            if [ $? -eq 0 ]; then
                echo "✅ API Users accessible"
            else
                echo "❌ API Users non accessible"
            fi
            
            echo ""
            echo "✅ Surveillance terminée - Déploiement réussi!"
            exit 0
        else
            echo "⏳ API accessible mais pas encore prête"
            echo "📊 Réponse: $API_RESPONSE"
        fi
    else
        echo "⏳ API pas encore accessible (code: $curl_exit_code)"
    fi
    
    echo ""
    
    # Attendre 30 secondes avant la prochaine tentative
    if [ $attempt -lt $max_attempts ]; then
        echo "⏰ Attente de 30 secondes avant la prochaine vérification..."
        sleep 30
    fi
    
    attempt=$((attempt + 1))
done

echo "⏰ Timeout atteint après $max_attempts tentatives"
echo ""
echo "💡 Vérifiez manuellement:"
echo "1. Dashboard Render: https://dashboard.render.com/project/$PROJECT_ID"
echo "2. Cliquez sur le service $SERVICE_ID"
echo "3. Vérifiez l'onglet 'Logs' pour voir les erreurs"
echo "4. Vérifiez l'onglet 'Settings' pour confirmer la configuration"
echo ""
echo "🔧 Configuration attendue:"
echo "- Build Command: npm install && npm run build"
echo "- Start Command: node index.js"
echo "- Root Directory: backend"
echo "- Health Check Path: /api/health"
echo ""
echo "❌ Surveillance terminée - Déploiement en cours ou échec"
