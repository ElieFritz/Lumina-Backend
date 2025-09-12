#!/bin/bash

echo "🧪 Test d'intégration EventLink Africa"
echo "======================================"

# Test 1: Backend Health
echo "1. Test du backend..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: ERREUR"
    exit 1
fi

# Test 2: API Venues
echo "2. Test API Venues..."
if curl -s http://localhost:3001/api/venues | grep -q "Restaurant Le Baobab"; then
    echo "✅ API Venues: OK"
else
    echo "❌ API Venues: ERREUR"
fi

# Test 3: API Events
echo "3. Test API Events..."
if curl -s http://localhost:3001/api/events | grep -q "Concert Youssou"; then
    echo "✅ API Events: OK"
else
    echo "❌ API Events: ERREUR"
fi

# Test 4: API Auth
echo "4. Test API Auth..."
if curl -s -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"firstName":"Test","lastName":"User","email":"test@test.com","password":"password123"}' | grep -q "User registered successfully"; then
    echo "✅ API Auth Register: OK"
else
    echo "❌ API Auth Register: ERREUR"
fi

# Test 5: Frontend
echo "5. Test du frontend..."
if curl -s http://localhost:3000 | grep -q "EventLink Africa"; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: ERREUR"
fi

echo ""
echo "🎉 Tests terminés !"
echo ""
echo "📊 URLs disponibles:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001/api"
echo "   Health:   http://localhost:3001/api/health"
echo "   Venues:   http://localhost:3001/api/venues"
echo "   Events:   http://localhost:3001/api/events"
echo "   Auth:     http://localhost:3001/api/auth"
echo "   Register: POST http://localhost:3001/api/auth/register"
echo "   Login:    POST http://localhost:3001/api/auth/login"
