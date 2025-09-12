#!/bin/bash

echo "🗺️  Test d'importation Google Places API"
echo "========================================"

# Vérifier que le backend est en cours d'exécution
echo "📡 Vérification du backend..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend: http://localhost:3001 - OK"
else
    echo "❌ Backend: http://localhost:3001 - ERREUR"
    echo "Démarrez le backend avec: cd backend && npm run start:with-db"
    exit 1
fi

echo ""
echo "🔧 Configuration requise:"
echo "1. Créez un compte Google Cloud Platform"
echo "2. Activez l'API Google Places"
echo "3. Créez une clé API"
echo "4. Ajoutez la clé dans backend/.env:"
echo "   GOOGLE_PLACES_API_KEY=votre_cle_api"
echo ""

# Test de l'endpoint d'importation (dry run)
echo "🧪 Test d'importation (dry run) pour Abidjan..."
echo ""

# Test avec des données mockées si l'API key n'est pas configurée
echo "📝 Test d'importation simulé..."
echo ""

# Créer un fichier de test avec des données mockées
cat > /tmp/test-import.json << 'EOF'
{
  "location": "Abidjan, Côte d'Ivoire",
  "radius": 5000,
  "type": "restaurant",
  "maxResults": 5,
  "dryRun": true
}
EOF

echo "📤 Envoi de la requête d'importation..."
response=$(curl -s -X POST http://localhost:3001/api/places-import/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d @/tmp/test-import.json)

if [ $? -eq 0 ]; then
    echo "✅ Requête envoyée avec succès"
    echo "📋 Réponse:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
else
    echo "❌ Erreur lors de l'envoi de la requête"
fi

echo ""
echo "📊 Test des statistiques d'importation..."
stats_response=$(curl -s -X GET http://localhost:3001/api/places-import/stats \
  -H "Authorization: Bearer test-token")

if [ $? -eq 0 ]; then
    echo "✅ Statistiques récupérées avec succès"
    echo "📋 Statistiques:"
    echo "$stats_response" | jq '.' 2>/dev/null || echo "$stats_response"
else
    echo "❌ Erreur lors de la récupération des statistiques"
fi

echo ""
echo "🔍 Test de recherche d'établissements..."
places_response=$(curl -s -X GET "http://localhost:3001/api/places-import/places?limit=5" \
  -H "Authorization: Bearer test-token")

if [ $? -eq 0 ]; then
    echo "✅ Recherche d'établissements réussie"
    echo "📋 Résultats:"
    echo "$places_response" | jq '.' 2>/dev/null || echo "$places_response"
else
    echo "❌ Erreur lors de la recherche d'établissements"
fi

echo ""
echo "📋 Instructions pour la configuration complète:"
echo "=============================================="
echo ""
echo "1. 🔑 Configuration de l'API Google Places:"
echo "   - Allez sur https://console.cloud.google.com/"
echo "   - Créez un nouveau projet ou sélectionnez un projet existant"
echo "   - Activez l'API Google Places"
echo "   - Créez une clé API"
echo "   - Ajoutez la clé dans backend/.env:"
echo "     GOOGLE_PLACES_API_KEY=votre_cle_api"
echo ""
echo "2. 🗄️  Configuration de la base de données:"
echo "   - Assurez-vous que PostgreSQL est en cours d'exécution"
echo "   - Exécutez les migrations: ./scripts/run-migrations.sh"
echo ""
echo "3. 🚀 Démarrage des services:"
echo "   - Backend: cd backend && npm run start:with-db"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "4. 🧪 Tests d'importation:"
echo "   - Test dry run: ./scripts/test-google-places-import.sh"
echo "   - Import réel: Utilisez l'interface admin"
echo ""
echo "5. 📱 Interface utilisateur:"
echo "   - Page d'accueil: http://localhost:3000"
echo "   - Dashboard admin: http://localhost:3000/admin"
echo "   - Dashboard propriétaire: http://localhost:3000/owner"
echo ""

# Nettoyage
rm -f /tmp/test-import.json

echo "✅ Test d'importation Google Places terminé"
echo "📝 Consultez les logs du backend pour plus de détails"
