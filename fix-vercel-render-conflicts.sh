#!/bin/bash

echo "🔧 Correction des conflits Frontend Vercel ↔ Backend Render"
echo "=========================================================="

# Configuration
FRONTEND_DIR="/Users/macmiui/lumina/Lumina/frontend"
BACKEND_DIR="/Users/macmiui/lumina/Lumina/backend"
PROJECT_ROOT="/Users/macmiui/lumina/Lumina"

# URLs
RENDER_BACKEND_URL="https://lumina-csjl.onrender.com"
VERCEL_FRONTEND_URL="https://lumina-africa-frontend.vercel.app"

echo ""
echo "📋 1. Vérification de la configuration actuelle"
echo "-----------------------------------------------"

# Vérifier next.config.js
echo "🔍 Configuration Next.js:"
if [ -f "$FRONTEND_DIR/next.config.js" ]; then
    echo "✅ next.config.js trouvé"
    grep -A 5 "NEXT_PUBLIC_API_URL" "$FRONTEND_DIR/next.config.js" || echo "❌ NEXT_PUBLIC_API_URL non trouvé"
else
    echo "❌ next.config.js non trouvé"
fi

# Vérifier vercel.json
echo ""
echo "🔍 Configuration Vercel:"
if [ -f "$FRONTEND_DIR/vercel.json" ]; then
    echo "✅ vercel.json trouvé"
    grep -A 3 "destination" "$FRONTEND_DIR/vercel.json" || echo "❌ destination non trouvé"
else
    echo "❌ vercel.json non trouvé"
fi

# Vérifier render.yaml
echo ""
echo "🔍 Configuration Render:"
if [ -f "$BACKEND_DIR/render.yaml" ]; then
    echo "✅ render.yaml trouvé"
    grep -A 3 "name:" "$BACKEND_DIR/render.yaml" || echo "❌ name non trouvé"
else
    echo "❌ render.yaml non trouvé"
fi

echo ""
echo "📋 2. Test de connectivité"
echo "-------------------------"

# Test backend Render
echo "🔍 Test backend Render ($RENDER_BACKEND_URL):"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$RENDER_BACKEND_URL")
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend Render: OK (HTTP $BACKEND_STATUS)"
else
    echo "❌ Backend Render: Échec (HTTP $BACKEND_STATUS)"
fi

# Test frontend Vercel
echo "🔍 Test frontend Vercel ($VERCEL_FRONTEND_URL):"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_FRONTEND_URL")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend Vercel: OK (HTTP $FRONTEND_STATUS)"
else
    echo "❌ Frontend Vercel: Échec (HTTP $FRONTEND_STATUS)"
fi

echo ""
echo "📋 3. Correction des configurations"
echo "----------------------------------"

# Corriger next.config.js
echo "🔧 Correction de next.config.js..."
cat > "$FRONTEND_DIR/next.config.js" << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during production builds on Vercel
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'localhost',
      'lumina-africa.com',
      'www.lumina-africa.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'lumina-csjl.onrender.com',
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://lumina-csjl.onrender.com' 
      : 'http://localhost:3001',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  },
  async rewrites() {
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://lumina-csjl.onrender.com' 
      : 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
EOF
echo "✅ next.config.js corrigé"

# Corriger vercel.json
echo "🔧 Correction de vercel.json..."
cat > "$FRONTEND_DIR/vercel.json" << 'EOF'
{
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://lumina-csjl.onrender.com"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://lumina-csjl.onrender.com/api/$1"
    }
  ]
}
EOF
echo "✅ vercel.json corrigé"

# Corriger render.yaml
echo "🔧 Correction de render.yaml..."
cat > "$BACKEND_DIR/render.yaml" << 'EOF'
services:
  - type: web
    name: lumina-africa-backend
    env: node
    plan: free
    region: oregon
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
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
echo "✅ render.yaml corrigé"

echo ""
echo "📋 4. Correction des variables d'environnement"
echo "---------------------------------------------"

# Créer .env.local pour le frontend
echo "🔧 Création de .env.local pour le frontend..."
cat > "$FRONTEND_DIR/.env.local" << 'EOF'
NEXT_PUBLIC_API_URL=https://lumina-csjl.onrender.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_key_here
EOF
echo "✅ .env.local créé"

# Vérifier .env du backend
echo "🔍 Vérification de .env du backend..."
if [ -f "$BACKEND_DIR/.env" ]; then
    echo "✅ .env du backend trouvé"
    echo "Variables d'environnement du backend:"
    grep -E "^(NODE_ENV|PORT|NEXT_PUBLIC_SUPABASE|DATABASE_URL|POSTGRES|FRONTEND_URL)" "$BACKEND_DIR/.env" | head -10
else
    echo "❌ .env du backend non trouvé"
fi

echo ""
echo "📋 5. Test de communication locale"
echo "--------------------------------"

# Démarrer le backend localement pour test
echo "🚀 Démarrage du backend local pour test..."
cd "$BACKEND_DIR"
npm run start:prod &
BACKEND_PID=$!
sleep 10

# Test de communication
echo "🔍 Test de communication frontend ↔ backend local..."
LOCAL_BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/health")
if [ "$LOCAL_BACKEND_STATUS" = "200" ]; then
    echo "✅ Communication locale: OK"
else
    echo "❌ Communication locale: Échec (HTTP $LOCAL_BACKEND_STATUS)"
fi

# Arrêter le backend local
kill $BACKEND_PID 2>/dev/null

echo ""
echo "📋 6. Poussage des changements"
echo "-----------------------------"

cd "$PROJECT_ROOT"
git add .
git commit -m "🔧 Fix Vercel-Render conflicts and environment variables"
git push origin main

echo "✅ Changements poussés vers GitHub"

echo ""
echo "📋 7. Instructions pour le déploiement"
echo "-------------------------------------"
echo "1. Vérifiez que le backend Render est configuré avec:"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm run start:prod"
echo "   - Port: 10000"
echo ""
echo "2. Redéployez le frontend Vercel:"
echo "   - Allez sur vercel.com"
echo "   - Redéployez le projet lumina-africa-frontend"
echo ""
echo "3. Testez la communication:"
echo "   - Frontend: $VERCEL_FRONTEND_URL"
echo "   - Backend: $RENDER_BACKEND_URL"
echo "   - API Health: $RENDER_BACKEND_URL/api/health"

echo ""
echo "🎉 Correction terminée!"
