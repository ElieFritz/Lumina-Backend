#!/bin/bash

# Script de déploiement Render utilisant l'API REST
# Utilise la clé API fournie par l'utilisateur

RENDER_API_KEY="rnd_E1fSQpQw3N083uOrtJ3BW9fFkLhL"
RENDER_API_URL="https://api.render.com/v1"

echo "🚀 Déploiement de Lumina Africa Backend sur Render via API REST..."

# Fonction pour faire des requêtes à l'API Render
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Authorization: Bearer $RENDER_API_KEY" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$RENDER_API_URL$endpoint"
    else
        curl -s -X "$method" \
            -H "Authorization: Bearer $RENDER_API_KEY" \
            -H "Content-Type: application/json" \
            "$RENDER_API_URL$endpoint"
    fi
}

# 1. Lister les services existants
echo "📋 Recherche des services existants..."
SERVICES=$(api_request "GET" "/services")
echo "Services trouvés:"
echo "$SERVICES" | jq '.[] | {id: .id, name: .name, type: .type, status: .status}'

# 2. Chercher le service lumina-africa-backend
SERVICE_ID=$(echo "$SERVICES" | jq -r '.[] | select(.name == "lumina-africa-backend") | .id')

if [ -n "$SERVICE_ID" ] && [ "$SERVICE_ID" != "null" ]; then
    echo "✅ Service trouvé: $SERVICE_ID"
    
    # 3. Déclencher un déploiement
    echo "🚀 Déclenchement du déploiement..."
    DEPLOY_RESPONSE=$(api_request "POST" "/services/$SERVICE_ID/deploys")
    
    if [ $? -eq 0 ]; then
        DEPLOY_ID=$(echo "$DEPLOY_RESPONSE" | jq -r '.id')
        echo "✅ Déploiement déclenché avec succès!"
        echo "📋 ID du déploiement: $DEPLOY_ID"
        
        # 4. Attendre que le déploiement se termine
        echo "⏳ Attente de la fin du déploiement..."
        while true; do
            DEPLOY_STATUS=$(api_request "GET" "/services/$SERVICE_ID/deploys/$DEPLOY_ID" | jq -r '.status')
            echo "📊 Statut du déploiement: $DEPLOY_STATUS"
            
            if [ "$DEPLOY_STATUS" = "live" ]; then
                echo "🎉 Déploiement terminé avec succès!"
                break
            elif [ "$DEPLOY_STATUS" = "build_failed" ] || [ "$DEPLOY_STATUS" = "update_failed" ]; then
                echo "❌ Échec du déploiement!"
                break
            fi
            
            sleep 10
        done
        
        # 5. Obtenir l'URL du service
        SERVICE_URL=$(api_request "GET" "/services/$SERVICE_ID" | jq -r '.service.serviceDetails.url')
        echo "🌐 URL du service: $SERVICE_URL"
        
        # 6. Tester le service
        echo "🧪 Test du service déployé..."
        if curl -s -f "$SERVICE_URL/api/health" > /dev/null; then
            echo "✅ Service fonctionne correctement!"
        else
            echo "⚠️  Service déployé mais peut avoir des problèmes de santé"
        fi
        
    else
        echo "❌ Échec du déclenchement du déploiement"
        echo "Réponse: $DEPLOY_RESPONSE"
    fi
    
else
    echo "❌ Service 'lumina-africa-backend' non trouvé"
    echo "Veuillez créer le service manuellement sur Render Dashboard"
fi

echo "🏁 Script terminé"
