#!/bin/bash

echo "🔧 Configuration des Variables d'Environnement Vercel"
echo "====================================================="

echo "📋 Variables d'environnement requises :"
echo ""
echo "NODE_ENV=production"
echo "DATABASE_URL=postgresql://postgres.baoywgzpmndrbiagiczs:Eliefritz97@aws-1-ca-central-1.pooler.supabase.com:6543/postgres"
echo "NEXT_PUBLIC_SUPABASE_URL=https://baoywgzpmndrbiagiczs.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb3l3Z3pwbW5kcmJpYWdpY3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTA2NjUsImV4cCI6MjA3MzUyNjY2NX0.KP9VMywToT5YvHikWqmTi5pO6HEWitL14-cnJ9jETYs"
echo "FRONTEND_URL=https://lumina-africa-frontend.vercel.app"
echo ""

echo "🎯 Étapes à suivre dans le Dashboard Vercel :"
echo ""
echo "1. **Allez sur :** https://vercel.com/dashboard"
echo "2. **Sélectionnez le projet :** backend"
echo "3. **Allez dans :** Settings → Environment Variables"
echo "4. **Ajoutez chaque variable :**"
echo "   - Cliquez sur 'Add New'"
echo "   - Name: NODE_ENV, Value: production"
echo "   - Environment: Production, Preview, Development"
echo "   - Cliquez sur 'Save'"
echo ""
echo "   Répétez pour chaque variable ci-dessus"
echo ""
echo "5. **Redéployez :**"
echo "   - Allez dans l'onglet 'Deployments'"
echo "   - Cliquez sur les 3 points (...) du dernier déploiement"
echo "   - Sélectionnez 'Redeploy'"
echo ""

echo "✅ Après configuration, testez :"
echo "curl https://backend-3s49rkeyi-enollafritzs-projects.vercel.app/api/health"
echo ""

echo "📊 Résultat attendu :"
echo '{"status":"ok","timestamp":"2025-09-20T12:00:00.000Z","service":"Lumina Africa API","database":"Supabase","version":"1.0.0"}'
echo ""

echo "🚀 Une fois configuré, votre API sera fonctionnelle !"
