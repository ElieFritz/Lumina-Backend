#!/bin/bash

echo "🗄️  CONSULTATION BASE DE DONNÉES - EventLink Africa"
echo "=================================================="
echo ""

# Configuration
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="lumina2024"
DB_NAME="lumina_africa"

# Ajouter PostgreSQL au PATH
export PATH="/Library/PostgreSQL/17/bin:$PATH"

echo "🔧 Configuration:"
echo "• Host: $DB_HOST"
echo "• Port: $DB_PORT"
echo "• User: $DB_USER"
echo "• Database: $DB_NAME"
echo ""

# Test de connexion
echo "1. Test de connexion..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Connexion PostgreSQL: OK"
else
    echo "❌ Connexion PostgreSQL: ERREUR"
    exit 1
fi

echo ""
echo "📊 2. STATISTIQUES GÉNÉRALES"
echo "============================"

# Compter les enregistrements
USERS_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')
VENUES_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM venues;" 2>/dev/null | tr -d ' ')
EVENTS_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM events;" 2>/dev/null | tr -d ' ')
BOOKINGS_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM bookings;" 2>/dev/null | tr -d ' ')
REVIEWS_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM reviews;" 2>/dev/null | tr -d ' ')

echo "• Utilisateurs: $USERS_COUNT"
echo "• Venues: $VENUES_COUNT"
echo "• Événements: $EVENTS_COUNT"
echo "• Réservations: $BOOKINGS_COUNT"
echo "• Avis: $REVIEWS_COUNT"

echo ""
echo "👤 3. UTILISATEURS"
echo "=================="
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT id, \"firstName\", \"lastName\", email, role, status FROM users ORDER BY id;"

echo ""
echo "🏢 4. VENUES"
echo "============"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT id, name, category, city, rating, \"reviewCount\", \"priceRange\", status FROM venues ORDER BY id;"

echo ""
echo "🎭 5. ÉVÉNEMENTS"
echo "================"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT id, title, category, \"startDate\", \"totalTickets\", \"availableTickets\", \"soldTickets\", price, currency, status FROM events ORDER BY id;"

echo ""
echo "🎫 6. RÉSERVATIONS"
echo "=================="
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT id, \"bookingNumber\", \"ticketQuantity\", \"totalAmount\", currency, status, \"paymentStatus\", \"paymentMethod\" FROM bookings ORDER BY id;"

echo ""
echo "⭐ 7. AVIS"
echo "=========="
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT id, rating, type, \"isVerified\", \"isPublic\", \"userId\", \"venueId\", \"eventId\" FROM reviews ORDER BY id;"

echo ""
echo "🔗 8. INFORMATIONS DE CONNEXION POUR PGADMIN"
echo "============================================"
echo "• Host: $DB_HOST"
echo "• Port: $DB_PORT"
echo "• Database: $DB_NAME"
echo "• Username: $DB_USER"
echo "• Password: $DB_PASSWORD"
echo ""

echo "📋 9. COMMANDES UTILES"
echo "====================="
echo "• Se connecter: PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
echo "• Lister les tables: \dt"
echo "• Voir la structure d'une table: \d table_name"
echo "• Quitter: \q"
echo ""

echo "✅ Consultation terminée!"
