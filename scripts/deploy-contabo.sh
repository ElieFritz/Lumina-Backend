#!/bin/bash

# Script de déploiement automatisé pour VPS Contabo
# Usage: ./scripts/deploy-contabo.sh

set -e

# Configuration - MODIFIEZ CES VALEURS SELON VOTRE VPS
VPS_HOST="31.220.90.241"     # IP Contabo
VPS_USER="root"              # Ou votre utilisateur SSH
APP_DIR="/opt/lumina"

echo "🚀 Déploiement de Lumina Africa sur VPS Contabo"
echo "================================================"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Fonction pour exécuter des commandes sur le VPS
run_on_vps() {
    ssh $VPS_USER@$VPS_HOST "$1"
}

# Fonction pour copier des fichiers vers le VPS
copy_to_vps() {
    scp -r "$1" $VPS_USER@$VPS_HOST:"$2"
}

log_step "1. Connexion au VPS et préparation de l'environnement"

# Vérifier la connexion SSH
log_info "Test de connexion SSH (vous devrez entrer votre mot de passe)..."
if ! ssh -o ConnectTimeout=10 $VPS_USER@$VPS_HOST "echo 'Connexion SSH réussie'" 2>/dev/null; then
    log_error "Impossible de se connecter au VPS. Vérifiez votre connexion SSH."
    exit 1
fi

log_info "Connexion SSH réussie ✅"

# Préparer le serveur
log_step "2. Préparation du serveur"
run_on_vps "
    # Mettre à jour le système
    apt update && apt upgrade -y
    
    # Installer les dépendances nécessaires
    apt install -y git curl wget unzip
    
    # Créer les répertoires nécessaires
    mkdir -p $APP_DIR
    mkdir -p /opt/lumina-backup
    
    # Configurer le firewall
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    
    echo 'Serveur préparé ✅'
"

log_step "3. Clonage du repository"
run_on_vps "
    cd /opt
    if [ -d 'Lumina' ]; then
        echo 'Repository existant détecté, mise à jour...'
        cd Lumina
        git pull origin main
    else
        echo 'Clonage du repository...'
        git clone https://github.com/ElieFritz/Lumina.git
        cd Lumina
    fi
    echo 'Repository mis à jour ✅'
"

log_step "4. Configuration de l'environnement"
run_on_vps "
    cd $APP_DIR
    
    # Créer le fichier .env s'il n'existe pas
    if [ ! -f '.env' ]; then
        cp env.production .env
        echo 'Fichier .env créé à partir du template'
    fi
    
    # Créer les répertoires nécessaires
    mkdir -p logs/nginx
    mkdir -p nginx/ssl
    
    echo 'Configuration préparée ✅'
"

log_step "5. Configuration des variables d'environnement"
log_warn "⚠️  IMPORTANT: Vous devez configurer manuellement le fichier .env sur le VPS"
log_info "Connectez-vous au VPS et éditez le fichier .env :"
echo ""
echo "ssh $VPS_USER@$VPS_HOST"
echo "cd $APP_DIR"
echo "nano .env"
echo ""
echo "Configurez au minimum :"
echo "- MONGODB_URI (votre chaîne de connexion MongoDB Atlas)"
echo "- JWT_SECRET (une clé secrète forte)"
echo "- REDIS_PASSWORD (mot de passe pour Redis)"
echo ""

read -p "Appuyez sur Entrée une fois que vous avez configuré le fichier .env..."

log_step "6. Construction et déploiement de l'application"
run_on_vps "
    cd $APP_DIR
    
    # Arrêter les conteneurs existants
    docker-compose -f docker-compose.prod.yml down || true
    
    # Nettoyer les anciennes images
    docker image prune -f
    
    # Construire et démarrer les nouveaux conteneurs
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # Attendre que les services démarrent
    sleep 30
    
    echo 'Application déployée ✅'
"

log_step "7. Vérification du déploiement"
run_on_vps "
    cd $APP_DIR
    
    # Vérifier les conteneurs
    echo 'Conteneurs en cours d\\'exécution :'
    docker-compose -f docker-compose.prod.yml ps
    
    # Vérifier les logs du backend
    echo 'Logs du backend (dernières 20 lignes) :'
    docker-compose -f docker-compose.prod.yml logs --tail=20 backend
    
    # Test de santé
    if curl -f http://localhost:3001/health; then
        echo '✅ Backend accessible'
    else
        echo '❌ Backend non accessible'
        echo 'Logs détaillés :'
        docker-compose -f docker-compose.prod.yml logs backend
    fi
"

log_step "8. Configuration finale"
log_info "🌐 Votre backend est maintenant accessible sur :"
echo "   - http://$VPS_HOST:3001"
echo "   - http://$VPS_HOST:3001/health (health check)"
echo ""
log_info "📊 Pour surveiller l'application :"
echo "   - Logs en temps réel : docker-compose -f docker-compose.prod.yml logs -f"
echo "   - Statut des conteneurs : docker-compose -f docker-compose.prod.yml ps"
echo "   - Redémarrer : docker-compose -f docker-compose.prod.yml restart"
echo ""
log_info "🔒 Prochaines étapes recommandées :"
echo "   1. Configurer un certificat SSL (Let's Encrypt)"
echo "   2. Configurer un nom de domaine"
echo "   3. Configurer MongoDB Atlas"
echo "   4. Tester l'API complète"

log_info "🎉 Déploiement terminé avec succès !"
