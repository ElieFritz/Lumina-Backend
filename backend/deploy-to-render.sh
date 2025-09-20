#!/bin/bash

# Script de déploiement pour Render
echo "🚀 Déploiement Lumina Backend sur Render"
echo "========================================"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ] || [ ! -f "render.yaml" ]; then
    echo "❌ Erreur: Exécutez ce script depuis le répertoire backend/"
    exit 1
fi

# Vérifier que les fichiers nécessaires existent
echo "📁 Vérification des fichiers..."
if [ -f "index.js" ]; then
    echo "✅ index.js trouvé"
else
    echo "❌ index.js manquant"
    exit 1
fi

if [ -f "dist/main.js" ]; then
    echo "✅ dist/main.js trouvé"
else
    echo "❌ dist/main.js manquant - compilation en cours..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Échec de la compilation"
        exit 1
    fi
fi

# Vérifier le statut Git
echo "📋 Vérification du statut Git..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Des changements non commitées détectés"
    echo "Voulez-vous les commiter et pousser? (y/n)"
    read -r response
    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        git add .
        git commit -m "Deploy: Update for Render deployment"
        git push origin main
        echo "✅ Changements poussés vers GitHub"
    else
        echo "⚠️  Déploiement sans commit des changements"
    fi
else
    echo "✅ Aucun changement non commité"
fi

# Vérifier la configuration render.yaml
echo "🔧 Vérification de la configuration render.yaml..."
if grep -q "startCommand: node index.js" render.yaml; then
    echo "✅ startCommand configuré correctement"
else
    echo "❌ startCommand incorrect dans render.yaml"
    exit 1
fi

if grep -q '"main": "dist/main.js"' package.json; then
    echo "✅ Champ main configuré dans package.json"
else
    echo "❌ Champ main manquant dans package.json"
    exit 1
fi

echo ""
echo "🎯 Instructions pour le déploiement:"
echo "1. Allez sur https://dashboard.render.com"
echo "2. Vérifiez que le service 'lumina-africa-backend' existe"
echo "3. Si le service n'existe pas, créez-le en utilisant le fichier render.yaml"
echo "4. Le déploiement automatique devrait se déclencher"
echo "5. Surveillez les logs de déploiement"
echo ""

# Tenter de vérifier le statut via l'API Render (si possible)
echo "🔍 Tentative de vérification du statut..."
if command -v curl &> /dev/null; then
    echo "Utilisez l'URL de votre service Render pour vérifier le statut:"
    echo "curl https://votre-service.onrender.com/api/health"
else
    echo "Installez curl pour tester l'API: brew install curl"
fi

echo ""
echo "📊 URLs importantes:"
echo "- Dashboard Render: https://dashboard.render.com"
echo "- Repository GitHub: https://github.com/ElieFritz/Lumina"
echo "- API Health: https://votre-service.onrender.com/api/health"
echo "- Swagger Docs: https://votre-service.onrender.com/api/docs"
echo ""
echo "✅ Script de déploiement terminé!"
