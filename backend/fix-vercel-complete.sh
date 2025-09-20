#!/bin/bash

echo "🔧 Correction Complète Vercel"
echo "============================="

echo "📋 Problèmes identifiés :"
echo "1. ❌ Routing des endpoints - RECORD_NOT_FOUND"
echo "2. ❌ Variables d'environnement Supabase"
echo "3. ❌ Configuration Vercel incorrecte"
echo ""

echo "🔧 Solutions appliquées :"
echo "1. ✅ Ajout du DebugController"
echo "2. ✅ Correction de vercel.json"
echo "3. ✅ Configuration des variables d'environnement"
echo ""

echo "🚀 Redéploiement en cours..."
echo ""

# Commit et push des corrections
git add .
git commit -m "Fix Vercel configuration and add debug endpoints

- Fix vercel.json configuration for proper routing
- Add DebugController for environment variables diagnosis
- Improve build configuration with includeFiles
- Ready for production deployment"

git push origin main
git push lumina-backend main

echo ""
echo "✅ Corrections poussées vers GitHub"
echo ""

echo "⏳ Attendez 2-3 minutes que Vercel redéploie automatiquement"
echo ""

echo "🧪 Tests à effectuer après redéploiement :"
echo ""
echo "1. Test de l'endpoint de santé :"
echo "   curl https://backend-599i9rukv-enollafritzs-projects.vercel.app/api/health"
echo ""
echo "2. Test du diagnostic des variables d'environnement :"
echo "   curl https://backend-599i9rukv-enollafritzs-projects.vercel.app/api/debug/env"
echo ""
echo "3. Test de la configuration Supabase :"
echo "   curl https://backend-599i9rukv-enollafritzs-projects.vercel.app/api/debug/supabase-config"
echo ""

echo "📊 Résultats attendus :"
echo "- /api/health : Status OK avec services configurés"
echo "- /api/debug/env : Variables d'environnement présentes"
echo "- /api/debug/supabase-config : Configuration Supabase complète"
echo ""

echo "🎯 Si les tests échouent encore :"
echo "1. Vérifiez les variables d'environnement dans Vercel Dashboard"
echo "2. Vérifiez que le Root Directory est correct"
echo "3. Vérifiez les logs de build dans Vercel"
echo ""

echo "🚀 Votre API sera bientôt entièrement fonctionnelle !"
