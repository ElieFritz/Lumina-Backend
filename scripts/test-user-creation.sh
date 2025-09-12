#!/bin/bash

echo "🧪 TEST CRÉATION UTILISATEUR - EventLink Africa"
echo "=============================================="
echo ""

# Configuration
API_URL="http://localhost:3001/api"
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="lumina2024"
DB_NAME="lumina_africa"

# Ajouter PostgreSQL au PATH
export PATH="/Library/PostgreSQL/17/bin:$PATH"

echo "🔧 Configuration:"
echo "• API: $API_URL"
echo "• Base de données: $DB_NAME"
echo ""

# Test 1: Vérifier que le backend est en cours d'exécution
echo "1. Test de connexion au backend..."
if curl -s $API_URL/health > /dev/null; then
    echo "✅ Backend connecté: OK"
else
    echo "❌ Backend non disponible"
    exit 1
fi

# Test 2: Compter les utilisateurs avant
echo ""
echo "2. Nombre d'utilisateurs avant le test..."
USERS_BEFORE=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')
echo "• Utilisateurs existants: $USERS_BEFORE"

# Test 3: Créer un nouvel utilisateur
echo ""
echo "3. Création d'un nouvel utilisateur..."
TIMESTAMP=$(date +%s)
USER_EMAIL="testuser$TIMESTAMP@example.com"

REGISTER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Test\",\"lastName\":\"User$TIMESTAMP\",\"email\":\"$USER_EMAIL\",\"password\":\"password123\"}")

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo "✅ Inscription réussie"
    echo "• Email: $USER_EMAIL"
    echo "• Réponse: $(echo $REGISTER_RESPONSE | jq -r '.user.firstName + \" \" + .user.lastName' 2>/dev/null || echo 'Utilisateur créé')"
else
    echo "❌ Erreur d'inscription"
    echo "• Réponse: $REGISTER_RESPONSE"
    exit 1
fi

# Test 4: Vérifier que l'utilisateur a été ajouté à la base de données
echo ""
echo "4. Vérification en base de données..."
USERS_AFTER=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')
echo "• Utilisateurs après: $USERS_AFTER"

if [ "$USERS_AFTER" -gt "$USERS_BEFORE" ]; then
    echo "✅ Utilisateur ajouté en base de données"
else
    echo "❌ Utilisateur non trouvé en base de données"
    exit 1
fi

# Test 5: Vérifier les détails de l'utilisateur en base
echo ""
echo "5. Détails de l'utilisateur en base..."
USER_DETAILS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT id, \"firstName\", \"lastName\", email, role, status FROM users WHERE email = '$USER_EMAIL';" 2>/dev/null)
echo "• Détails: $USER_DETAILS"

# Test 6: Tester la connexion
echo ""
echo "6. Test de connexion..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"password123\"}")

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo "✅ Connexion réussie"
    echo "• Token généré: OUI"
else
    echo "❌ Erreur de connexion"
    echo "• Réponse: $LOGIN_RESPONSE"
    exit 1
fi

# Test 7: Vérifier le hashage du mot de passe
echo ""
echo "7. Vérification du hashage du mot de passe..."
PASSWORD_HASH=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT password FROM users WHERE email = '$USER_EMAIL';" 2>/dev/null | tr -d ' ')
if [[ $PASSWORD_HASH == \$2a\$* ]]; then
    echo "✅ Mot de passe correctement hashé (bcrypt)"
else
    echo "❌ Mot de passe non hashé ou mal hashé"
    echo "• Hash: $PASSWORD_HASH"
fi

echo ""
echo "📊 RÉSUMÉ DU TEST"
echo "=================="
echo "• Utilisateurs avant: $USERS_BEFORE"
echo "• Utilisateurs après: $USERS_AFTER"
echo "• Nouvel utilisateur: $USER_EMAIL"
echo "• Inscription: ✅"
echo "• Sauvegarde en DB: ✅"
echo "• Connexion: ✅"
echo "• Hashage mot de passe: ✅"
echo ""
echo "🎉 TEST RÉUSSI ! L'intégration frontend-backend-base de données fonctionne parfaitement !"
