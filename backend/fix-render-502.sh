#!/bin/bash

# Script pour corriger le problème 502 Bad Gateway sur Render
echo "🔧 Correction du problème 502 Bad Gateway"
echo "========================================"

SERVICE_ID="srv-d36rf915pdvs73dc9b2g"
PROJECT_ID="prj-d36reom3jp1c73bfr25g"
API_URL="https://lumina-csjl.onrender.com"

echo "📋 Informations du service:"
echo "- Service ID: $SERVICE_ID"
echo "- Project ID: $PROJECT_ID"
echo "- API URL: $API_URL"
echo ""

echo "🔍 Diagnostic du problème 502..."
echo "Le 502 Bad Gateway indique que:"
echo "1. Le service Render est déployé"
echo "2. Mais l'application ne démarre pas correctement"
echo "3. Ou l'application crash au démarrage"
echo ""

echo "🔧 Solutions à appliquer:"
echo "1. Vérifier la configuration de démarrage"
echo "2. Ajuster les variables d'environnement"
echo "3. Forcer un redéploiement"
echo ""

echo "📝 Vérification de la configuration actuelle..."
echo "render.yaml:"
if [ -f "render.yaml" ]; then
    cat render.yaml
else
    echo "❌ render.yaml manquant"
fi

echo ""
echo "package.json (scripts):"
if [ -f "package.json" ]; then
    grep -A 10 '"scripts"' package.json
else
    echo "❌ package.json manquant"
fi

echo ""
echo "🔧 Création d'une configuration optimisée pour Render..."

# Créer un nouveau render.yaml optimisé
cat > render.yaml << 'EOF'
services:
  - type: web
    name: lumina-africa-backend
    env: node
    plan: free
    region: oregon
    buildCommand: npm install && npm run build
    startCommand: node dist/main.js
    rootDir: backend
    healthCheckPath: /api/health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: NEXT_PUBLIC_SUPABASE_URL
        value: https://baoywgzpmndrbiagiczs.supabase.co
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb3l3Z3pwbW5kcmJpYWdpY3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTA2NjUsImV4cCI6MjA3MzUyNjY2NX0.KP9VMywToT5YvHikWqmTi5pO6HEWitL14-cnJ9jETYs
      - key: DATABASE_URL
        value: postgresql://postgres.baoywgzpmndrbiagiczs:Eliefritz97@aws-1-ca-central-1.pooler.supabase.com:6543/postgres
      - key: POSTGRES_HOST
        value: aws-1-ca-central-1.pooler.supabase.com
      - key: POSTGRES_PORT
        value: 6543
      - key: POSTGRES_USER
        value: postgres.baoywgzpmndrbiagiczs
      - key: POSTGRES_PASSWORD
        value: Eliefritz97
      - key: POSTGRES_DB
        value: postgres
      - key: FRONTEND_URL
        value: https://lumina-africa-frontend.vercel.app
EOF

echo "✅ Nouveau render.yaml créé avec startCommand: node dist/main.js"
echo ""

echo "🔧 Création d'un script de démarrage optimisé..."

# Créer un script de démarrage optimisé
cat > start.sh << 'EOF'
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
EOF

chmod +x start.sh

echo "✅ Script de démarrage start.sh créé"
echo ""

echo "📝 Mise à jour du package.json pour inclure le script de démarrage..."

# Mettre à jour package.json pour inclure le script de démarrage
if [ -f "package.json" ]; then
    # Ajouter le script de démarrage si pas déjà présent
    if ! grep -q '"start:render"' package.json; then
        # Trouver la ligne avec "start:prod" et ajouter le script après
        sed -i.bak '/"start:prod": "node dist\/main",/a\
    "start:render": "node dist/main.js",' package.json
        echo "✅ Script start:render ajouté au package.json"
    else
        echo "✅ Script start:render déjà présent"
    fi
else
    echo "❌ package.json non trouvé"
fi

echo ""
echo "🔧 Création d'un fichier de configuration d'environnement..."

# Créer un fichier .env pour Render
cat > .env << 'EOF'
NODE_ENV=production
PORT=10000
NEXT_PUBLIC_SUPABASE_URL=https://baoywgzpmndrbiagiczs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb3l3Z3pwbW5kcmJpYWdpY3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTA2NjUsImV4cCI6MjA3MzUyNjY2NX0.KP9VMywToT5YvHikWqmTi5pO6HEWitL14-cnJ9jETYs
DATABASE_URL=postgresql://postgres.baoywgzpmndrbiagiczs:Eliefritz97@aws-1-ca-central-1.pooler.supabase.com:6543/postgres
POSTGRES_HOST=aws-1-ca-central-1.pooler.supabase.com
POSTGRES_PORT=6543
POSTGRES_USER=postgres.baoywgzpmndrbiagiczs
POSTGRES_PASSWORD=Eliefritz97
POSTGRES_DB=postgres
FRONTEND_URL=https://lumina-africa-frontend.vercel.app
EOF

echo "✅ Fichier .env créé"
echo ""

echo "🧪 Test local de la nouvelle configuration..."
echo "Test avec: node dist/main.js"
timeout 10s node dist/main.js &
TEST_PID=$!
sleep 5
if ps -p $TEST_PID > /dev/null; then
    echo "✅ Application démarre correctement localement"
    kill $TEST_PID
else
    echo "❌ Problème au démarrage local"
fi

echo ""
echo "📤 Commit et push des corrections..."
git add .
git commit -m "Fix: Optimize Render deployment configuration for 502 error

- Update render.yaml to use direct dist/main.js start
- Add start.sh script for better startup control
- Add .env file for environment variables
- Update package.json with start:render script
- Remove dependency on index.js shim"

git push origin main

echo ""
echo "✅ Corrections poussées sur GitHub"
echo ""
echo "🔍 Vérification du déploiement..."
echo "1. Allez sur: https://dashboard.render.com/project/$PROJECT_ID"
echo "2. Vérifiez que le nouveau déploiement est en cours"
echo "3. Attendez 2-3 minutes pour le déploiement"
echo "4. Testez: $API_URL/api/health"
echo ""
echo "📊 Si le problème persiste, vérifiez les logs Render pour:"
echo "- Erreurs de compilation"
echo "- Erreurs de démarrage de l'application"
echo "- Problèmes de connexion à la base de données"
echo "- Erreurs de configuration des variables d'environnement"
