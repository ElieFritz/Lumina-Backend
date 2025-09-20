#!/bin/bash

# Script pour configurer Vercel en mode public
echo "🔧 Configuration de Vercel pour l'accès public"
echo "============================================="

echo "📋 Instructions pour désactiver la protection d'authentification :"
echo ""
echo "1. Allez sur le dashboard Vercel :"
echo "   https://vercel.com/dashboard"
echo ""
echo "2. Sélectionnez le projet 'backend'"
echo ""
echo "3. Allez dans l'onglet 'Settings'"
echo ""
echo "4. Dans la section 'Deployment Protection', désactivez :"
echo "   - 'Vercel Authentication'"
echo "   - 'Password Protection'"
echo ""
echo "5. Sauvegardez les modifications"
echo ""
echo "6. Redéployez le projet :"
echo "   npx vercel --prod --yes"
echo ""

echo "🔍 URLs de votre projet :"
echo "- Dashboard: https://vercel.com/dashboard"
echo "- Projet: https://vercel.com/enollafritzs-projects/backend"
echo ""

echo "📊 Une fois configuré, testez avec :"
echo "curl https://[VOTRE-URL-VERCEL]/api/health"
echo ""

echo "✅ Configuration terminée !"
