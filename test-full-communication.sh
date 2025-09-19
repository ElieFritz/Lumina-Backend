#!/bin/bash

# Script de test complet pour vérifier la communication Frontend-Backend
echo "🧪 Test complet de communication Frontend-Backend"
echo "=================================================="

# Couleurs pour les résultats
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour tester un endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_field=$3
    
    echo -n "🔍 Test $description... "
    
    response=$(curl -s "http://localhost:3000$endpoint" 2>/dev/null)
    if [ $? -eq 0 ] && echo "$response" | jq -e "$expected_field" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "   Response: $response"
        return 1
    fi
}

# Fonction pour tester un endpoint backend direct
test_backend_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_field=$3
    
    echo -n "🔍 Test Backend $description... "
    
    response=$(curl -s "http://localhost:3001$endpoint" 2>/dev/null)
    if [ $? -eq 0 ] && echo "$response" | jq -e "$expected_field" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "   Response: $response"
        return 1
    fi
}

echo ""
echo "📊 Tests Backend Direct (Port 3001)"
echo "-----------------------------------"

# Tests backend direct
test_backend_endpoint "/api/health" "Health Check" ".status"
test_backend_endpoint "/api/health/supabase" "Supabase Connection" ".status"
test_backend_endpoint "/api/users" "Users List" ".users"
test_backend_endpoint "/api/venues" "Venues List" ".venues"

echo ""
echo "🌐 Tests Frontend Proxy (Port 3000)"
echo "-----------------------------------"

# Tests frontend proxy
test_endpoint "/api/health" "Health Check via Frontend" ".status"
test_endpoint "/api/health/supabase" "Supabase Connection via Frontend" ".status"
test_endpoint "/api/users" "Users List via Frontend" ".users"
test_endpoint "/api/venues" "Venues List via Frontend" ".venues"

echo ""
echo "🔐 Tests d'Authentification"
echo "---------------------------"

# Test de récupération d'un utilisateur spécifique
user_id=$(curl -s "http://localhost:3000/api/users" | jq -r '.users[0].id' 2>/dev/null)
if [ "$user_id" != "null" ] && [ -n "$user_id" ]; then
    test_endpoint "/api/users/$user_id" "User by ID" ".id"
else
    echo -e "${RED}❌ Cannot test user by ID - no users found${NC}"
fi

echo ""
echo "📈 Tests de Performance"
echo "----------------------"

# Test de performance
echo -n "⏱️  Test de latence backend... "
backend_time=$(curl -o /dev/null -s -w "%{time_total}" "http://localhost:3001/api/health")
echo -e "${GREEN}${backend_time}s${NC}"

echo -n "⏱️  Test de latence frontend... "
frontend_time=$(curl -o /dev/null -s -w "%{time_total}" "http://localhost:3000/api/health")
echo -e "${GREEN}${frontend_time}s${NC}"

echo ""
echo "🎯 Résumé des Tests"
echo "==================="

# Compter les tests réussis
backend_tests=0
frontend_tests=0

# Tests backend
if curl -s "http://localhost:3001/api/health" | jq -e ".status" > /dev/null 2>&1; then ((backend_tests++)); fi
if curl -s "http://localhost:3001/api/health/supabase" | jq -e ".status" > /dev/null 2>&1; then ((backend_tests++)); fi
if curl -s "http://localhost:3001/api/users" | jq -e ".users" > /dev/null 2>&1; then ((backend_tests++)); fi
if curl -s "http://localhost:3001/api/venues" | jq -e ".venues" > /dev/null 2>&1; then ((backend_tests++)); fi

# Tests frontend
if curl -s "http://localhost:3000/api/health" | jq -e ".status" > /dev/null 2>&1; then ((frontend_tests++)); fi
if curl -s "http://localhost:3000/api/health/supabase" | jq -e ".status" > /dev/null 2>&1; then ((frontend_tests++)); fi
if curl -s "http://localhost:3000/api/users" | jq -e ".users" > /dev/null 2>&1; then ((frontend_tests++)); fi
if curl -s "http://localhost:3000/api/venues" | jq -e ".venues" > /dev/null 2>&1; then ((frontend_tests++)); fi

echo "Backend Tests: $backend_tests/4"
echo "Frontend Tests: $frontend_tests/4"

if [ $backend_tests -eq 4 ] && [ $frontend_tests -eq 4 ]; then
    echo -e "${GREEN}🎉 Tous les tests sont passés ! Communication parfaite !${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Certains tests ont échoué. Vérifiez la configuration.${NC}"
    exit 1
fi
