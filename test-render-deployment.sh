#!/bin/bash

# Script de test pour le déploiement Render
echo "🧪 Test du déploiement Render..."

# URL du service (à remplacer par l'URL réelle une fois déployé)
RENDER_URL="https://lumina-africa-backend.onrender.com"

echo "🔍 Test de l'endpoint de santé..."
curl -s "$RENDER_URL/api/health" | jq '.' || echo "❌ Échec du test de santé"

echo ""
echo "🔍 Test de l'endpoint Supabase..."
curl -s "$RENDER_URL/api/health/supabase" | jq '.' || echo "❌ Échec du test Supabase"

echo ""
echo "🔍 Test de l'endpoint des utilisateurs..."
curl -s "$RENDER_URL/api/users" | jq '.' || echo "❌ Échec du test utilisateurs"

echo ""
echo "🔍 Test de l'endpoint des lieux..."
curl -s "$RENDER_URL/api/venues" | jq '.' || echo "❌ Échec du test lieux"

echo ""
echo "✅ Tests terminés !"
echo "🌐 URL du service: $RENDER_URL"
echo "📚 Documentation Swagger: $RENDER_URL/api/docs"
