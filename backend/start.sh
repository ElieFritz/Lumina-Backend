#!/bin/bash

echo "🚀 Démarrage de l'application Lumina Backend"
echo "==========================================="

# Vérifier que les fichiers nécessaires existent
if [ ! -f "dist/main.js" ]; then
    echo "❌ dist/main.js non trouvé. Compilation nécessaire..."
    npm run build
fi

if [ ! -f "package.json" ]; then
    echo "❌ package.json non trouvé"
    exit 1
fi

echo "✅ Fichiers de démarrage vérifiés"
echo "🌐 Démarrage de l'application sur le port ${PORT:-10000}"

# Démarrer l'application
exec node dist/main.js
