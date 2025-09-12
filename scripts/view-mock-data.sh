#!/bin/bash

echo "🗄️  CONSULTATION DES DONNÉES MOCK - EventLink Africa"
echo "=================================================="
echo ""

# Vérifier si le backend est en cours d'exécution
if ! curl -s http://localhost:3001/api/health > /dev/null; then
    echo "❌ Backend non disponible sur http://localhost:3001"
    echo "   Démarrez le backend avec: cd backend && npm run start:no-db"
    exit 1
fi

echo "✅ Backend connecté sur http://localhost:3001"
echo ""

# Fonction pour formater le JSON
format_json() {
    echo "$1" | python3 -m json.tool 2>/dev/null || echo "$1"
}

echo "📊 1. VENUES (Lieux)"
echo "==================="
VENUES=$(curl -s http://localhost:3001/api/venues)
format_json "$VENUES"
echo ""

echo "🎭 2. EVENTS (Événements)"
echo "========================"
EVENTS=$(curl -s http://localhost:3001/api/events)
format_json "$EVENTS"
echo ""

echo "👤 3. AUTHENTIFICATION (Test)"
echo "============================"
echo "Test d'inscription d'un utilisateur:"
REGISTER=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}')
format_json "$REGISTER"
echo ""

echo "Test de connexion:"
LOGIN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')
format_json "$LOGIN"
echo ""

echo "📈 4. STATISTIQUES"
echo "=================="
VENUE_COUNT=$(echo "$VENUES" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('data', [])))" 2>/dev/null || echo "N/A")
EVENT_COUNT=$(echo "$EVENTS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('data', [])))" 2>/dev/null || echo "N/A")

echo "• Nombre de venues: $VENUE_COUNT"
echo "• Nombre d'événements: $EVENT_COUNT"
echo "• Backend: http://localhost:3001"
echo "• Frontend: http://localhost:3000"
echo ""

echo "🔗 5. ENDPOINTS DISPONIBLES"
echo "=========================="
echo "• GET  /api/health          - Statut du backend"
echo "• GET  /api/venues          - Liste des venues"
echo "• GET  /api/events          - Liste des événements"
echo "• POST /api/auth/register   - Inscription utilisateur"
echo "• POST /api/auth/login      - Connexion utilisateur"
echo "• GET  /api/auth/me         - Profil utilisateur"
echo ""

echo "✅ Consultation terminée!"
