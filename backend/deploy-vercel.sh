#!/bin/bash

# Script pour déployer le backend sur Vercel
echo "🚀 Déploiement du backend sur Vercel"
echo "===================================="

echo "📋 Préparation du déploiement..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ package.json non trouvé. Assurez-vous d'être dans le répertoire backend."
    exit 1
fi

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Échec de l'installation de Vercel CLI"
        exit 1
    fi
fi

echo "✅ Vercel CLI installé"

# Vérifier la configuration
echo "🔍 Vérification de la configuration..."
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json non trouvé"
    exit 1
fi

if [ ! -f "dist/main.js" ]; then
    echo "🔧 Compilation de l'application..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Échec de la compilation"
        exit 1
    fi
fi

echo "✅ Configuration vérifiée"

# Se connecter à Vercel
echo "🔐 Connexion à Vercel..."
vercel login
if [ $? -ne 0 ]; then
    echo "❌ Échec de la connexion à Vercel"
    exit 1
fi

echo "✅ Connecté à Vercel"

# Déployer
echo "🚀 Déploiement en cours..."
vercel --prod
if [ $? -ne 0 ]; then
    echo "❌ Échec du déploiement"
    exit 1
fi

echo ""
echo "✅ Déploiement réussi !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez les variables d'environnement dans le dashboard Vercel"
echo "2. Testez votre API avec l'URL fournie"
echo "3. Vérifiez les logs dans le dashboard Vercel"
echo ""
echo "🔧 Variables d'environnement à configurer :"
echo "- NODE_ENV=production"
echo "- DATABASE_URL=postgresql://postgres.baoywgzpmndrbiagiczs:Eliefritz97@aws-1-ca-central-1.pooler.supabase.com:6543/postgres"
echo "- NEXT_PUBLIC_SUPABASE_URL=https://baoywgzpmndrbiagiczs.supabase.co"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb3l3Z3pwbW5kcmJpYWdpY3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTA2NjUsImV4cCI6MjA3MzUyNjY2NX0.KP9VMywToT5YvHikWqmTi5pO6HEWitL14-cnJ9jETYs"
echo "- FRONTEND_URL=https://lumina-africa-frontend.vercel.app"
echo ""
echo "🌐 Dashboard Vercel: https://vercel.com/dashboard"
