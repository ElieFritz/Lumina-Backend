#!/bin/bash

echo "🌟 Démarrage de Lumina Africa - Plateforme de sorties en Afrique"
echo "================================================================"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le dossier racine du projet."
    exit 1
fi

echo "📋 Vérification des prérequis..."

# Vérifier PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL installé"
else
    echo "❌ PostgreSQL non installé"
    exit 1
fi

# Vérifier Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js installé"
else
    echo "❌ Node.js non installé"
    exit 1
fi

echo ""
echo "🚀 Démarrage des services..."

# Démarrer le backend
echo "🔧 Démarrage du backend..."
cd backend
if [ -f "start-backend.sh" ]; then
    chmod +x start-backend.sh
    ./start-backend.sh &
    BACKEND_PID=$!
    echo "Backend démarré avec PID: $BACKEND_PID"
else
    echo "❌ Script de démarrage backend non trouvé"
    exit 1
fi

# Attendre que le backend démarre
echo "⏳ Attente du démarrage du backend..."
sleep 10

# Tester l'API
echo "🧪 Test de l'API..."
if [ -f "test-api.js" ]; then
    node test-api.js
fi

cd ..

# Démarrer le frontend
echo "🎨 Démarrage du frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend démarré avec PID: $FRONTEND_PID"

cd ..

echo ""
echo "🎉 Lumina Africa est maintenant en cours d'exécution !"
echo "📊 Backend: http://localhost:3001"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Pour arrêter les services, utilisez Ctrl+C"

# Attendre l'interruption
trap "echo '🛑 Arrêt des services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
wait
