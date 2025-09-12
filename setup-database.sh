    
    #!/bin/bash

echo "🗄️ Configuration de la base de données EventLink Africa..."

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "📦 Installation de PostgreSQL..."
    brew install postgresql@15
    brew services start postgresql@15
    sleep 5
else
    echo "✅ PostgreSQL est déjà installé"
fi

# Vérifier si le service PostgreSQL est en cours d'exécution
if ! brew services list | grep postgresql | grep started &> /dev/null; then
    echo "🚀 Démarrage du service PostgreSQL..."
    brew services start postgresql@15
    sleep 3
fi

# Créer la base de données
echo "🗃️ Création de la base de données..."
psql postgres -c "CREATE DATABASE lumina_africa;" 2>/dev/null || echo "Base de données déjà existante"

# Installer PostGIS
echo "🗺️ Installation de PostGIS..."
brew install postgis 2>/dev/null || echo "PostGIS déjà installé"

# Activer PostGIS
echo "🔧 Activation de PostGIS..."
psql -d lumina_africa -c "CREATE EXTENSION IF NOT EXISTS postgis;" 2>/dev/null || echo "PostGIS déjà activé"

# Créer le fichier .env pour le backend
echo "📝 Création du fichier .env..."
cat > backend/.env << 'ENVEOF'
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=
DATABASE_NAME=lumina_africa

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRES_IN=7d

# API Configuration
API_PORT=3001
API_HOST=localhost

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Payment Configuration (sandbox)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
ENVEOF

echo "✅ Configuration terminée !"
echo "🚀 Vous pouvez maintenant démarrer le backend avec :"
echo "   cd backend && npm run start:dev"
echo ""
echo "🔍 Vérification de la base de données :"
psql -d lumina_africa -c "SELECT 'PostgreSQL fonctionne!' as status, version();"
