#!/bin/bash

# Script pour créer un service Render via l'API REST
RENDER_API_KEY="rnd_E1fSQpQw3N083uOrtJ3BW9fFkLhL"
RENDER_API_URL="https://api.render.com/v1"

echo "🔧 Création du service Lumina Africa Backend sur Render..."

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

# 1. Obtenir la liste des repos
echo "📋 Recherche des repositories GitHub..."
REPOS=$(api_request "GET" "/repos")
echo "Repositories disponibles:"
echo "$REPOS" | jq '.[] | {id: .id, name: .name, fullName: .fullName}'

# 2. Chercher le repo Lumina
REPO_ID=$(echo "$REPOS" | jq -r '.[] | select(.fullName | contains("Lumina")) | .id' | head -1)

if [ -n "$REPO_ID" ] && [ "$REPO_ID" != "null" ]; then
    echo "✅ Repository trouvé: $REPO_ID"
    
    # 3. Créer le service
    echo "🚀 Création du service..."
    SERVICE_DATA='{
        "type": "web_service",
        "name": "lumina-africa-backend",
        "repo": "'$REPO_ID'",
        "branch": "main",
        "rootDir": "backend",
        "buildCommand": "npm install && npm run build",
        "startCommand": "npm run start:prod",
        "plan": "free",
        "region": "oregon",
        "healthCheckPath": "/api/health",
        "autoDeploy": true,
        "envVars": [
            {"key": "NODE_ENV", "value": "production"},
            {"key": "PORT", "value": "10000"},
            {"key": "NEXT_PUBLIC_SUPABASE_URL", "value": "https://baoywgzpmndrbiagiczs.supabase.co"},
            {"key": "NEXT_PUBLIC_SUPABASE_ANON_KEY", "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb3l3Z3pwbW5kcmJpYWdpY3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTA2NjUsImV4cCI6MjA3MzUyNjY2NX0.KP9VMywToT5YvHikWqmTi5pO6HEWitL14-cnJ9jETYs"},
            {"key": "DATABASE_URL", "value": "postgresql://postgres.baoywgzpmndrbiagiczs:Eliefritz97@aws-1-ca-central-1.pooler.supabase.com:6543/postgres"},
            {"key": "POSTGRES_HOST", "value": "aws-1-ca-central-1.pooler.supabase.com"},
            {"key": "POSTGRES_PORT", "value": "6543"},
            {"key": "POSTGRES_USER", "value": "postgres.baoywgzpmndrbiagiczs"},
            {"key": "POSTGRES_PASSWORD", "value": "Eliefritz97"},
            {"key": "POSTGRES_DB", "value": "postgres"},
            {"key": "FRONTEND_URL", "value": "https://lumina-africa-frontend.vercel.app"}
        ]
    }'
    
    SERVICE_RESPONSE=$(api_request "POST" "/services" "$SERVICE_DATA")
    
    if [ $? -eq 0 ]; then
        SERVICE_ID=$(echo "$SERVICE_RESPONSE" | jq -r '.id')
        echo "✅ Service créé avec succès!"
        echo "📋 ID du service: $SERVICE_ID"
        echo "🌐 URL du service: $(echo "$SERVICE_RESPONSE" | jq -r '.service.serviceDetails.url')"
    else
        echo "❌ Échec de la création du service"
        echo "Réponse: $SERVICE_RESPONSE"
    fi
    
else
    echo "❌ Repository Lumina non trouvé"
    echo "Veuillez vous assurer que le repository est connecté à Render"
fi

echo "🏁 Script terminé"
