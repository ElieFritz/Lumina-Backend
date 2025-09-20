#!/bin/bash

echo "🧪 Test et Redéploiement Vercel"
echo "==============================="

echo "🔍 Test de l'API actuelle..."
API_URL="https://backend-3s49rkeyi-enollafritzs-projects.vercel.app"

echo "Test de: $API_URL"
echo ""

# Test de l'API
echo "1. Test de l'endpoint de santé..."
HEALTH_RESPONSE=$(curl -s --max-time 10 "$API_URL/api/health")
if echo "$HEALTH_RESPONSE" | grep -q "status"; then
    echo "✅ /api/health - SUCCÈS"
    echo "   Réponse: $HEALTH_RESPONSE"
    echo ""
    echo "🎉 Votre API fonctionne parfaitement !"
    echo "   URL: $API_URL"
    echo ""
    echo "📊 Endpoints disponibles :"
    echo "   - $API_URL/api/health"
    echo "   - $API_URL/api/users"
    echo "   - $API_URL/api/venues"
    echo "   - $API_URL/api/events"
    echo "   - $API_URL/api/bookings"
    echo "   - $API_URL/api/reviews"
    echo "   - $API_URL/api/stats"
    echo ""
    echo "🚀 Déploiement terminé avec succès !"
else
    echo "❌ /api/health - ÉCHEC"
    echo "   Réponse: $HEALTH_RESPONSE"
    echo ""
    echo "🔧 Solutions :"
    echo "1. Redéployez via le Dashboard Vercel :"
    echo "   - https://vercel.com/dashboard"
    echo "   - Sélectionnez le projet 'backend'"
    echo "   - Onglet 'Deployments'"
    echo "   - Cliquez sur 'Redeploy'"
    echo ""
    echo "2. Vérifiez les variables d'environnement :"
    echo "   - Settings → Environment Variables"
    echo "   - Assurez-vous que toutes les variables sont présentes"
    echo ""
    echo "3. Attendez 2-3 minutes après le redéploiement"
    echo ""
    echo "4. Testez à nouveau :"
    echo "   curl $API_URL/api/health"
fi

echo ""
echo "📋 Variables d'environnement requises :"
echo "NODE_ENV=production"
echo "DATABASE_URL=postgresql://postgres.baoywgzpmndrbiagiczs:Eliefritz97@aws-1-ca-central-1.pooler.supabase.com:6543/postgres"
echo "NEXT_PUBLIC_SUPABASE_URL=https://baoywgzpmndrbiagiczs.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo "FRONTEND_URL=https://lumina-africa-frontend.vercel.app"
