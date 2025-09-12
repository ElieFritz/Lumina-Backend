#!/bin/bash

# Script de test pour l'import Google Places (version publique)
# Ce script teste les endpoints publics sans authentification

echo "=== Test de l'import Google Places (Version Publique) ==="
echo

# Configuration
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"

# Fonction pour tester un endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo "Test: $description"
    echo "URL: $method $BACKEND_URL$endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$BACKEND_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        echo "✅ Succès (HTTP $http_code)"
        echo "Réponse: $(echo "$body" | jq -r '.message // .success // .total // "OK"' 2>/dev/null || echo "OK")"
    else
        echo "❌ Erreur (HTTP $http_code)"
        echo "Réponse: $body"
    fi
    echo
}

# Vérifier que le backend est en cours d'exécution
echo "Vérification du backend..."
if ! curl -s "$BACKEND_URL/api/health" > /dev/null; then
    echo "❌ Le backend n'est pas accessible sur $BACKEND_URL"
    echo "Veuillez démarrer le backend avec: cd backend && npm run start:dev"
    exit 1
fi
echo "✅ Backend accessible"
echo

# Test 1: Statistiques d'import
test_endpoint "GET" "/api/places-import-public/stats" "" "Récupération des statistiques d'import"

# Test 2: Liste des établissements importés
test_endpoint "GET" "/api/places-import-public/places" "" "Récupération de la liste des établissements"

# Test 3: Import d'établissements (dry run)
import_data='{
  "location": "Abidjan, Côte d'\''Ivoire",
  "radius": 5000,
  "type": "restaurant",
  "maxResults": 5,
  "dryRun": true
}'
test_endpoint "POST" "/api/places-import-public/import" "$import_data" "Import d'établissements (mode test)"

# Test 4: Claim d'un établissement
claim_data='{
  "ownerId": 1,
  "businessName": "Mon Restaurant",
  "contactEmail": "owner@example.com",
  "contactPhone": "+225 20 30 40 50",
  "businessLicense": "LIC123456",
  "additionalInfo": "Restaurant familial depuis 10 ans"
}'
test_endpoint "POST" "/api/places-import-public/places/1/claim" "$claim_data" "Claim d'un établissement"

echo "=== Tests terminés ==="
echo
echo "Pour tester le frontend:"
echo "1. Ouvrez $FRONTEND_URL/admin/places-import"
echo "2. Vérifiez que les pages s'affichent correctement"
echo "3. Testez les fonctionnalités d'import et de gestion"
