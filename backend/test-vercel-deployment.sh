#!/bin/bash

# Script de test pour le déploiement Vercel
echo "🧪 Test du Déploiement Vercel"
echo "============================="

if [ -z "$1" ]; then
    echo "❌ Usage: ./test-vercel-deployment.sh <URL-VERCEL>"
    echo "   Exemple: ./test-vercel-deployment.sh https://lumina-backend-abc123.vercel.app"
    exit 1
fi

API_URL="$1"
echo "🔍 Test de l'API: $API_URL"
echo ""

# Test de l'endpoint de santé
echo "1. Test de l'endpoint de santé..."
HEALTH_RESPONSE=$(curl -s --max-time 10 "$API_URL/api/health")
if echo "$HEALTH_RESPONSE" | grep -q "status"; then
    echo "✅ /api/health - OK"
    echo "   Réponse: $HEALTH_RESPONSE"
else
    echo "❌ /api/health - ÉCHEC"
    echo "   Réponse: $HEALTH_RESPONSE"
fi
echo ""

# Test de l'endpoint des utilisateurs
echo "2. Test de l'endpoint des utilisateurs..."
USERS_RESPONSE=$(curl -s --max-time 10 "$API_URL/api/users")
if echo "$USERS_RESPONSE" | grep -q "\[\]" || echo "$USERS_RESPONSE" | grep -q "users"; then
    echo "✅ /api/users - OK"
    echo "   Réponse: $USERS_RESPONSE"
else
    echo "❌ /api/users - ÉCHEC"
    echo "   Réponse: $USERS_RESPONSE"
fi
echo ""

# Test de l'endpoint des lieux
echo "3. Test de l'endpoint des lieux..."
VENUES_RESPONSE=$(curl -s --max-time 10 "$API_URL/api/venues")
if echo "$VENUES_RESPONSE" | grep -q "\[\]" || echo "$VENUES_RESPONSE" | grep -q "venues"; then
    echo "✅ /api/venues - OK"
    echo "   Réponse: $VENUES_RESPONSE"
else
    echo "❌ /api/venues - ÉCHEC"
    echo "   Réponse: $VENUES_RESPONSE"
fi
echo ""

# Test de l'endpoint des événements
echo "4. Test de l'endpoint des événements..."
EVENTS_RESPONSE=$(curl -s --max-time 10 "$API_URL/api/events")
if echo "$EVENTS_RESPONSE" | grep -q "\[\]" || echo "$EVENTS_RESPONSE" | grep -q "events"; then
    echo "✅ /api/events - OK"
    echo "   Réponse: $EVENTS_RESPONSE"
else
    echo "❌ /api/events - ÉCHEC"
    echo "   Réponse: $EVENTS_RESPONSE"
fi
echo ""

# Test de l'endpoint des statistiques
echo "5. Test de l'endpoint des statistiques..."
STATS_RESPONSE=$(curl -s --max-time 10 "$API_URL/api/stats")
if echo "$STATS_RESPONSE" | grep -q "{" || echo "$STATS_RESPONSE" | grep -q "stats"; then
    echo "✅ /api/stats - OK"
    echo "   Réponse: $STATS_RESPONSE"
else
    echo "❌ /api/stats - ÉCHEC"
    echo "   Réponse: $STATS_RESPONSE"
fi
echo ""

echo "🎉 Test terminé !"
echo ""
echo "📊 Résumé :"
echo "- Si tous les tests sont ✅, votre API fonctionne parfaitement"
echo "- Si certains tests sont ❌, vérifiez les logs Vercel"
echo "- URL de votre API: $API_URL"
echo ""
echo "🔗 Liens utiles :"
echo "- Dashboard Vercel: https://vercel.com/dashboard"
echo "- Logs Vercel: Vérifiez dans le dashboard"
echo "- Documentation API: $API_URL/api/docs (si Swagger est configuré)"
