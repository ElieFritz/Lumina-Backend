#!/bin/bash

echo "📤 Pousser vers Lumina-Backend"
echo "=============================="

echo "🔍 Vérification du repository Lumina-Backend..."
echo ""

# Vérifier si le repository existe
if git ls-remote https://github.com/ElieFritz/Lumina-Backend.git >/dev/null 2>&1; then
    echo "✅ Repository Lumina-Backend existe"
    echo ""
    echo "🔧 Ajout du remote et push..."
    
    # Ajouter le remote
    git remote add lumina-backend https://github.com/ElieFritz/Lumina-Backend.git
    
    # Pousser vers Lumina-Backend
    echo "📤 Pushing to Lumina-Backend..."
    git push lumina-backend main
    
    if [ $? -eq 0 ]; then
        echo "✅ Push réussi vers Lumina-Backend"
        echo ""
        echo "🎯 Maintenant Vercel devrait pouvoir déployer !"
        echo "Attendez 2-3 minutes puis testez :"
        echo "curl https://backend-nine-omega-30.vercel.app/api/health"
    else
        echo "❌ Erreur lors du push"
        echo "Vérifiez les permissions du repository"
    fi
else
    echo "❌ Repository Lumina-Backend n'existe pas"
    echo ""
    echo "🔧 Solutions alternatives :"
    echo "1. Créer le repository Lumina-Backend sur GitHub"
    echo "2. Changer la configuration Vercel vers Lumina"
    echo "3. Créer un nouveau projet Vercel"
    echo ""
    echo "📋 Pour créer le repository :"
    echo "1. Allez sur https://github.com/new"
    echo "2. Nom: Lumina-Backend"
    echo "3. Créez le repository"
    echo "4. Relancez ce script"
fi
