#!/bin/bash

# Script de déploiement pour Render
echo "🚀 Déploiement de Lumina Africa Backend sur Render..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "backend/package.json" ]; then
    echo "❌ Erreur: Veuillez exécuter ce script depuis la racine du projet"
    exit 1
fi

# Vérifier que Git est configuré
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Erreur: Aucun remote Git trouvé"
    exit 1
fi

echo "✅ Configuration Git trouvée: $(git remote get-url origin)"

# Pousser les dernières modifications
echo "📤 Poussage des modifications vers GitHub..."
git add .
git commit -m "🚀 Deploy to Render - $(date)"
git push origin main

echo "✅ Code poussé vers GitHub"
echo ""
echo "🔗 Étapes suivantes:"
echo "1. Allez sur https://render.com"
echo "2. Connectez votre compte GitHub"
echo "3. Cliquez sur 'New +' → 'Web Service'"
echo "4. Sélectionnez le repository: $(git remote get-url origin | sed 's/.*\///' | sed 's/\.git$//')"
echo "5. Configuration:"
echo "   - Name: lumina-africa-backend"
echo "   - Root Directory: backend"
echo "   - Environment: Node"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm run start:prod"
echo ""
echo "6. Variables d'environnement à ajouter:"
echo "   NODE_ENV=production"
echo "   PORT=10000"
echo "   NEXT_PUBLIC_SUPABASE_URL=https://baoywgzpmndrbiagiczs.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb3l3Z3pwbW5kcmJpYWdpY3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTA2NjUsImV4cCI6MjA3MzUyNjY2NX0.KP9VMywToT5YvHikWqmTi5pO6HEWitL14-cnJ9jETYs"
echo "   DATABASE_URL=postgresql://postgres.baoywgzpmndrbiagiczs:Eliefritz97@aws-1-ca-central-1.pooler.supabase.com:6543/postgres"
echo "   POSTGRES_HOST=aws-1-ca-central-1.pooler.supabase.com"
echo "   POSTGRES_PORT=6543"
echo "   POSTGRES_USER=postgres.baoywgzpmndrbiagiczs"
echo "   POSTGRES_PASSWORD=Eliefritz97"
echo "   POSTGRES_DB=postgres"
echo "   FRONTEND_URL=https://lumina-africa-frontend.vercel.app"
echo ""
echo "7. Cliquez sur 'Create Web Service'"
echo ""
echo "🎉 Le déploiement sera automatique !"
