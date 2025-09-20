#!/bin/bash

# Script pour tester l'API déployée sur Render
echo "🧪 Test de l'API Lumina déployée sur Render"
echo "=========================================="

# URLs possibles (remplacez par l'URL réelle de votre service)
POSSIBLE_URLS=(
    "https://lumina-africa-backend.onrender.com"
    "https://lumina-backend.onrender.com"
    "https://lumina-africa-api.onrender.com"
    "https://lumina-api.onrender.com"
)

echo "🔍 Recherche de l'URL du service..."
echo ""

# Fonction pour tester une URL
test_api_url() {
    local url=$1
    echo "Testing: $url"
    
    # Test de l'endpoint de santé
    local health_response=$(curl -s --max-time 10 "$url/api/health" 2>/dev/null)
    local health_status=$?
    
    if [ $health_status -eq 0 ] && echo "$health_response" | grep -q "ok"; then
        echo "✅ Service trouvé et fonctionnel: $url"
        echo "📊 Réponse de santé: $health_response"
        echo ""
        echo "🔗 URLs disponibles:"
        echo "- Health Check: $url/api/health"
        echo "- Swagger Docs: $url/api/docs"
        echo "- API Base: $url/api"
        echo ""
        return 0
    else
        echo "❌ Service non accessible: $url"
        return 1
    fi
}

# Tester toutes les URLs possibles
found_service=false
for url in "${POSSIBLE_URLS[@]}"; do
    if test_api_url "$url"; then
        found_service=true
        break
    fi
    echo ""
done

if [ "$found_service" = false ]; then
    echo "⚠️  Aucun service trouvé avec les URLs par défaut"
    echo ""
    echo "📋 Instructions pour trouver l'URL correcte:"
    echo "1. Allez sur https://dashboard.render.com/project/prj-d36reom3jp1c73bfr25g"
    echo "2. Cliquez sur votre service 'lumina-africa-backend'"
    echo "3. Copiez l'URL du service (format: https://xxx.onrender.com)"
    echo "4. Testez manuellement avec:"
    echo "   curl https://VOTRE_URL.onrender.com/api/health"
    echo ""
    echo "💡 Ou utilisez ce script avec l'URL correcte:"
    echo "   ./test-deployed-api.sh https://VOTRE_URL.onrender.com"
fi

# Si une URL est fournie en argument, la tester
if [ $# -eq 1 ]; then
    echo "🧪 Test de l'URL fournie: $1"
    test_api_url "$1"
fi

echo ""
echo "📊 Tests de fonctionnalités (si le service est trouvé):"
echo "1. Health Check: curl \$URL/api/health"
echo "2. Swagger Docs: curl \$URL/api/docs"
echo "3. Users API: curl \$URL/api/users"
echo "4. Venues API: curl \$URL/api/venues"
echo "5. Events API: curl \$URL/api/events"
