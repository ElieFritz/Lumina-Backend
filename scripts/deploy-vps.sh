#!/bin/bash

# Script de déploiement pour VPS Contabo
# Usage: ./scripts/deploy-vps.sh

set -e

echo "🚀 Déploiement de Lumina Africa sur VPS Contabo"
echo "================================================"

# Variables
VPS_USER=${VPS_USER:-"root"}
VPS_HOST=${VPS_HOST:-"your-vps-ip"}
APP_DIR="/opt/lumina"
BACKUP_DIR="/opt/lumina-backup"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Vérifier les prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if [ -z "$VPS_HOST" ] || [ "$VPS_HOST" = "your-vps-ip" ]; then
        log_error "VPS_HOST n'est pas défini. Veuillez définir la variable d'environnement VPS_HOST"
        exit 1
    fi
    
    if ! command -v ssh &> /dev/null; then
        log_error "SSH n'est pas installé"
        exit 1
    fi
    
    if ! command -v scp &> /dev/null; then
        log_error "SCP n'est pas installé"
        exit 1
    fi
    
    log_info "Prérequis validés ✅"
}

# Tester la connexion SSH
test_ssh_connection() {
    log_info "Test de la connexion SSH..."
    
    if ssh -o ConnectTimeout=10 -o BatchMode=yes $VPS_USER@$VPS_HOST exit 2>/dev/null; then
        log_info "Connexion SSH réussie ✅"
    else
        log_error "Impossible de se connecter au VPS. Vérifiez vos clés SSH et l'IP du serveur"
        exit 1
    fi
}

# Préparer le serveur
prepare_server() {
    log_info "Préparation du serveur..."
    
    ssh $VPS_USER@$VPS_HOST << 'EOF'
        # Mettre à jour le système
        apt update && apt upgrade -y
        
        # Installer Docker si nécessaire
        if ! command -v docker &> /dev/null; then
            curl -fsSL https://get.docker.com -o get-docker.sh
            sh get-docker.sh
            systemctl enable docker
            systemctl start docker
        fi
        
        # Installer Docker Compose si nécessaire
        if ! command -v docker-compose &> /dev/null; then
            curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            chmod +x /usr/local/bin/docker-compose
        fi
        
        # Créer les répertoires nécessaires
        mkdir -p /opt/lumina/{backend,nginx,logs}
        mkdir -p /opt/lumina-backup
        
        # Configurer le firewall
        ufw allow 22/tcp
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw --force enable
        
        echo "Serveur préparé ✅"
EOF
}

# Sauvegarder l'ancienne version
backup_current_version() {
    log_info "Sauvegarde de la version actuelle..."
    
    ssh $VPS_USER@$VPS_HOST << EOF
        if [ -d "$APP_DIR" ]; then
            timestamp=\$(date +%Y%m%d_%H%M%S)
            cp -r $APP_DIR $BACKUP_DIR/backup_\$timestamp
            log_info "Sauvegarde créée: $BACKUP_DIR/backup_\$timestamp"
        fi
EOF
}

# Déployer l'application
deploy_application() {
    log_info "Déploiement de l'application..."
    
    # Copier les fichiers
    log_info "Copie des fichiers vers le serveur..."
    scp -r backend/ $VPS_USER@$VPS_HOST:$APP_DIR/
    scp -r nginx/ $VPS_USER@$VPS_HOST:$APP_DIR/
    scp docker-compose.prod.yml $VPS_USER@$VPS_HOST:$APP_DIR/docker-compose.yml
    scp env.production $VPS_USER@$VPS_HOST:$APP_DIR/.env
    
    # Déployer sur le serveur
    ssh $VPS_USER@$VPS_HOST << 'EOF'
        cd /opt/lumina
        
        # Arrêter les conteneurs existants
        docker-compose down || true
        
        # Nettoyer les anciennes images
        docker image prune -f
        
        # Construire et démarrer les nouveaux conteneurs
        docker-compose up -d --build
        
        # Attendre que les services démarrent
        sleep 30
        
        # Vérifier la santé des services
        if curl -f http://localhost:3001/health; then
            echo "✅ Backend déployé avec succès"
        else
            echo "❌ Échec du déploiement du backend"
            docker-compose logs backend
            exit 1
        fi
EOF
}

# Vérifier le déploiement
verify_deployment() {
    log_info "Vérification du déploiement..."
    
    # Test de santé du backend
    if curl -f http://$VPS_HOST:3001/health; then
        log_info "✅ Backend accessible"
    else
        log_error "❌ Backend non accessible"
        return 1
    fi
    
    # Test de l'API
    if curl -f http://$VPS_HOST:3001/api; then
        log_info "✅ API accessible"
    else
        log_warn "⚠️  API non accessible (peut être normal)"
    fi
    
    log_info "Déploiement vérifié ✅"
}

# Fonction principale
main() {
    check_prerequisites
    test_ssh_connection
    prepare_server
    backup_current_version
    deploy_application
    verify_deployment
    
    log_info "🎉 Déploiement terminé avec succès!"
    log_info "🌐 Backend accessible sur: http://$VPS_HOST:3001"
    log_info "📊 Health check: http://$VPS_HOST:3001/health"
}

# Exécuter le script
main "$@"
