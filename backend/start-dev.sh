#!/bin/bash

# Script de démarrage intelligent pour le développement
echo "🚀 Démarrage de Lumina Africa Backend - Mode Développement"

# Vérifier si Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution. Démarrage de Docker..."
    open -a Docker
    echo "⏳ Attente du démarrage de Docker..."
    sleep 10
fi

# Vérifier si les services Docker sont en cours d'exécution
echo "🔍 Vérification des services Docker..."
if ! docker-compose ps | grep -q "lumina-postgres.*Up"; then
    echo "📦 Démarrage des services Docker..."
    docker-compose up -d postgres redis elasticsearch
    echo "⏳ Attente du démarrage des services..."
    sleep 15
fi

# Vérifier la connexion à PostgreSQL
echo "🔍 Test de connexion à PostgreSQL..."
if docker exec lumina-postgres psql -U lumina_user -d lumina_africa -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ PostgreSQL est prêt"
else
    echo "❌ Erreur de connexion à PostgreSQL"
    exit 1
fi

# Vérifier la connexion à Redis
echo "🔍 Test de connexion à Redis..."
if docker exec lumina-redis redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis est prêt"
else
    echo "❌ Erreur de connexion à Redis"
    exit 1
fi

# Vérifier la connexion à Elasticsearch
echo "🔍 Test de connexion à Elasticsearch..."
if curl -s http://localhost:9200 > /dev/null 2>&1; then
    echo "✅ Elasticsearch est prêt"
else
    echo "❌ Erreur de connexion à Elasticsearch"
    exit 1
fi

# Copier le fichier d'environnement de développement
echo "📋 Configuration de l'environnement de développement..."
if [ -f "../env.development" ]; then
    cp ../env.development .env
    echo "✅ Fichier .env de développement copié"
else
    echo "⚠️  Fichier env.development non trouvé, utilisation du .env existant"
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrer le backend
echo "🚀 Démarrage du backend NestJS..."
npm run start:dev


