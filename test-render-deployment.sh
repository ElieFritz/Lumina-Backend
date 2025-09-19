#!/bin/bash

# Script de test pour vérifier le déploiement Render
echo "🧪 Test du déploiement Render"
echo "============================="

# Demander l'URL du backend Render
read -p "Entrez l'URL de votre backend Render (ex: https://lumina-africa-backend.onrender.com): " RENDER_URL

if [ -z "$RENDER_URL" ]; then
    echo "❌ URL du backend requise"
    exit 1
fi

echo ""
echo "🔍 Test de l'endpoint de santé..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$RENDER_URL/api/health")
if [ "$HEALTH_RESPONSE" -eq 200 ]; then
    echo "✅ Health Check: OK"
else
    echo "❌ Health Check: Échec (Code: $HEALTH_RESPONSE)"
fi

echo ""
echo "🔍 Test de l'endpoint Supabase..."
SUPABASE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$RENDER_URL/api/health/supabase")
if [ "$SUPABASE_RESPONSE" -eq 200 ]; then
    echo "✅ Supabase Connection: OK"
else
    echo "❌ Supabase Connection: Échec (Code: $SUPABASE_RESPONSE)"
fi

echo ""
echo "🔍 Test de l'endpoint des utilisateurs..."
USERS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$RENDER_URL/api/users")
if [ "$USERS_RESPONSE" -eq 200 ]; then
    echo "✅ Users API: OK"
else
    echo "❌ Users API: Échec (Code: $USERS_RESPONSE)"
fi

echo ""
echo "🔍 Test de l'endpoint des lieux..."
VENUES_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$RENDER_URL/api/venues")
if [ "$VENUES_RESPONSE" -eq 200 ]; then
    echo "✅ Venues API: OK"
else
    echo "❌ Venues API: Échec (Code: $VENUES_RESPONSE)"
fi

echo ""
echo "📊 Résumé des tests:"
echo "Health Check: $HEALTH_RESPONSE"
echo "Supabase: $SUPABASE_RESPONSE"
echo "Users: $USERS_RESPONSE"
echo "Venues: $VENUES_RESPONSE"

if [ "$HEALTH_RESPONSE" -eq 200 ] && [ "$SUPABASE_RESPONSE" -eq 200 ] && [ "$USERS_RESPONSE" -eq 200 ] && [ "$VENUES_RESPONSE" -eq 200 ]; then
    echo ""
    echo "🎉 Déploiement réussi ! Tous les endpoints fonctionnent."
    echo "🌐 URL du backend: $RENDER_URL"
    echo "📚 Documentation Swagger: $RENDER_URL/api/docs"
else
    echo ""
    echo "⚠️  Certains tests ont échoué. Vérifiez les logs sur Render."
fi