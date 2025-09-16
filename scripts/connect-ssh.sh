#!/bin/bash

# Script de connexion SSH pour VPS Contabo
# Usage: ./scripts/connect-ssh.sh

set -e

# Configuration
VPS_HOST="31.220.90.241"
VPS_USER="root"
APP_DIR="/opt/lumina"

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

echo "🔐 Connexion SSH à votre VPS Contabo"
echo "===================================="
echo ""
log_info "Configuration :"
echo "  - Host: $VPS_HOST"
echo "  - User: $VPS_USER"
echo "  - App Directory: $APP_DIR"
echo ""

# Vérifier si SSH est disponible
if ! command -v ssh &> /dev/null; then
    log_error "SSH n'est pas installé sur votre système"
    exit 1
fi

# Test de connexion
log_step "Test de connexion SSH..."
if ssh -o ConnectTimeout=10 -o BatchMode=yes $VPS_USER@$VPS_HOST "echo 'Connexion SSH réussie'" 2>/dev/null; then
    log_info "Connexion SSH réussie avec clé publique ✅"
    echo ""
    log_info "Connexion à votre VPS..."
    ssh $VPS_USER@$VPS_HOST
else
    log_warn "Connexion avec clé publique échouée, tentative avec mot de passe..."
    echo ""
    log_info "Vous devrez entrer votre mot de passe SSH"
    echo ""
    log_info "Connexion à votre VPS..."
    ssh $VPS_USER@$VPS_HOST
fi





