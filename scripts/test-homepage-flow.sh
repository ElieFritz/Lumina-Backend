#!/bin/bash

echo "🏠 Test du flow d'accueil - Lumina Africa"
echo "=========================================="

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier que les services sont démarrés
echo -e "\n${BLUE}1. Vérification des services...${NC}"

# Test backend
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo -e "✅ ${GREEN}Backend: OK${NC} (http://localhost:3001)"
else
    echo -e "❌ ${RED}Backend: Non accessible${NC}"
    exit 1
fi

# Test frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "✅ ${GREEN}Frontend: OK${NC} (http://localhost:3000)"
else
    echo -e "❌ ${RED}Frontend: Non accessible${NC}"
    exit 1
fi

echo -e "\n${BLUE}2. Test des endpoints API...${NC}"

# Test des venues
echo -n "Test des venues... "
VENUES_RESPONSE=$(curl -s http://localhost:3001/api/venues)
if echo "$VENUES_RESPONSE" | grep -q "venues"; then
    echo -e "✅ ${GREEN}OK${NC}"
    VENUE_COUNT=$(echo "$VENUES_RESPONSE" | grep -o '"id"' | wc -l)
    echo "   📊 Nombre de venues disponibles: $VENUE_COUNT"
else
    echo -e "❌ ${RED}Erreur${NC}"
fi

# Test des événements
echo -n "Test des événements... "
EVENTS_RESPONSE=$(curl -s http://localhost:3001/api/events)
if echo "$EVENTS_RESPONSE" | grep -q "events"; then
    echo -e "✅ ${GREEN}OK${NC}"
    EVENT_COUNT=$(echo "$EVENTS_RESPONSE" | grep -o '"id"' | wc -l)
    echo "   📊 Nombre d'événements disponibles: $EVENT_COUNT"
else
    echo -e "❌ ${RED}Erreur${NC}"
fi

echo -e "\n${BLUE}3. Analyse du contenu de la page d'accueil...${NC}"

# Récupérer le contenu HTML de la page d'accueil
HOMEPAGE_HTML=$(curl -s http://localhost:3000)

# Vérifier les éléments clés
echo -n "Vérification du titre principal... "
if echo "$HOMEPAGE_HTML" | grep -q "Découvrez les meilleures"; then
    echo -e "✅ ${GREEN}OK${NC}"
else
    echo -e "❌ ${RED}Manquant${NC}"
fi

echo -n "Vérification du formulaire de recherche... "
if echo "$HOMEPAGE_HTML" | grep -q "Que recherchez-vous"; then
    echo -e "✅ ${GREEN}OK${NC}"
else
    echo -e "❌ ${RED}Manquant${NC}"
fi

echo -n "Vérification des catégories... "
if echo "$HOMEPAGE_HTML" | grep -q "Restaurants"; then
    echo -e "✅ ${GREEN}OK${NC}"
else
    echo -e "❌ ${RED}Manquant${NC}"
fi

echo -n "Vérification de la section 'Comment ça marche'... "
if echo "$HOMEPAGE_HTML" | grep -q "Comment ça marche"; then
    echo -e "✅ ${GREEN}OK${NC}"
else
    echo -e "❌ ${RED}Manquant${NC}"
fi

echo -n "Vérification des témoignages... "
if echo "$HOMEPAGE_HTML" | grep -q "Ce que disent nos utilisateurs"; then
    echo -e "✅ ${GREEN}OK${NC}"
else
    echo -e "❌ ${RED}Manquant${NC}"
fi

echo -e "\n${BLUE}4. Test de performance...${NC}"

# Mesurer le temps de réponse
echo -n "Temps de réponse de la page d'accueil... "
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3000)
echo -e "${YELLOW}${RESPONSE_TIME}s${NC}"

if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    echo -e "✅ ${GREEN}Performance: Excellente${NC}"
elif (( $(echo "$RESPONSE_TIME < 3.0" | bc -l) )); then
    echo -e "⚠️  ${YELLOW}Performance: Correcte${NC}"
else
    echo -e "❌ ${RED}Performance: Lente${NC}"
fi

echo -e "\n${BLUE}5. Suggestions d'amélioration du flow d'accueil...${NC}"

echo -e "\n${YELLOW}🎯 Améliorations suggérées:${NC}"
echo "1. ${GREEN}Recherche intelligente${NC}: Ajouter des suggestions automatiques"
echo "2. ${GREEN}Géolocalisation${NC}: Détection automatique de la position"
echo "3. ${GREEN}Recherche vocale${NC}: Permettre la recherche par voix"
echo "4. ${GREEN}Filtres avancés${NC}: Prix, horaires, notes, etc."
echo "5. ${GREEN}Mode sombre${NC}: Toggle pour le thème sombre"
echo "6. ${GREEN}Notifications push${NC}: Alertes pour nouveaux événements"
echo "7. ${GREEN}Partage social${NC}: Boutons de partage sur les événements"
echo "8. ${GREEN}Mode hors ligne${NC}: Cache pour consultation sans internet"

echo -e "\n${YELLOW}📱 Améliorations mobile:${NC}"
echo "1. ${GREEN}Interface tactile${NC}: Gestes swipe pour navigation"
echo "2. ${GREEN}Recherche par QR code${NC}: Scanner pour découvrir des lieux"
echo "3. ${GREEN}Mode réalité augmentée${NC}: Voir les lieux autour de soi"
echo "4. ${GREEN}Notifications géolocalisées${NC}: Alertes quand on passe près d'un lieu"

echo -e "\n${YELLOW}🎨 Améliorations UX/UI:${NC}"
echo "1. ${GREEN}Animations fluides${NC}: Transitions et micro-interactions"
echo "2. ${GREEN}Chargement progressif${NC}: Skeleton screens"
echo "3. ${GREEN}Personnalisation${NC}: Préférences utilisateur"
echo "4. ${GREEN}Accessibilité${NC}: Support lecteurs d'écran"

echo -e "\n${GREEN}✅ Test du flow d'accueil terminé !${NC}"
echo -e "\n${BLUE}Pour tester manuellement:${NC}"
echo "• Ouvrez http://localhost:3000 dans votre navigateur"
echo "• Testez le formulaire de recherche"
echo "• Naviguez dans les différentes sections"
echo "• Vérifiez la responsivité sur mobile"

echo -e "\n${BLUE}Prochaines étapes recommandées:${NC}"
echo "1. Implémenter la fonctionnalité de recherche"
echo "2. Ajouter la géolocalisation"
echo "3. Créer des animations fluides"
echo "4. Optimiser pour mobile"
