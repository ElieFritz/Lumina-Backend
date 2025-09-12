#!/bin/bash

# EventLink Africa - Script de configuration
echo "🚀 Configuration d'EventLink Africa..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ avant de continuer."
    echo "📥 Téléchargez Node.js depuis: https://nodejs.org/"
    exit 1
fi

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker avant de continuer."
    echo "📥 Téléchargez Docker depuis: https://www.docker.com/get-started"
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose avant de continuer."
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp env.example .env
    echo "⚠️  Veuillez configurer le fichier .env avec vos paramètres"
fi

# Installer les dépendances du monorepo
echo "📦 Installation des dépendances..."
npm install

# Installer les dépendances du backend
echo "📦 Installation des dépendances backend..."
cd backend
npm install
cd ..

# Installer les dépendances du frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
npm install
cd ..

echo "🎉 Configuration terminée !"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurez le fichier .env avec vos paramètres"
echo "2. Démarrez les services avec: npm run docker:up"
echo "3. Ou démarrez manuellement:"
echo "   - Backend: cd backend && npm run start:dev"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Accès aux services:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:3001"
echo "   - API Docs: http://localhost:3001/api/docs"
echo ""
echo "📚 Documentation: Voir README.md"

