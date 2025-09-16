#!/bin/bash

# Gestionnaire SSH pour VPS Contabo
# Usage: ./scripts/ssh-manager.sh [option]

set -e

# Configuration
VPS_HOST="31.220.90.241"
VPS_USER="root"
APP_DIR="/opt/lumina"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# Fonction pour exécuter des commandes sur le VPS
run_on_vps() {
    ssh $VPS_USER@$VPS_HOST "$1"
}

# Fonction pour copier des fichiers vers le VPS
copy_to_vps() {
    scp -r "$1" $VPS_USER@$VPS_HOST:"$2"
}

# Menu d'options
show_menu() {
    echo "🔐 Gestionnaire SSH - VPS Contabo"
    echo "================================="
    echo ""
    echo "Configuration actuelle :"
    echo "  - Host: $VPS_HOST"
    echo "  - User: $VPS_USER"
    echo "  - App Directory: $APP_DIR"
    echo ""
    echo "Options disponibles :"
    echo "  1) Se connecter au VPS"
    echo "  2) Tester la connexion"
    echo "  3) Voir le statut des services"
    echo "  4) Voir les logs de l'application"
    echo "  5) Redémarrer les services"
    echo "  6) Copier un fichier vers le VPS"
    echo "  7) Voir l'utilisation des ressources"
    echo "  8) Mettre à jour l'application"
    echo "  9) Sauvegarder la base de données"
    echo "  0) Quitter"
    echo ""
}

# Test de connexion
test_connection() {
    log_step "Test de connexion SSH..."
    if ssh -o ConnectTimeout=10 -o BatchMode=yes $VPS_USER@$VPS_HOST "echo 'Connexion SSH réussie'" 2>/dev/null; then
        log_info "✅ Connexion SSH réussie avec clé publique"
    else
        log_warn "⚠️  Connexion avec clé publique échouée, mot de passe requis"
    fi
}

# Voir le statut des services
check_services() {
    log_step "Vérification du statut des services..."
    run_on_vps "
        echo '=== Conteneurs Docker ==='
        docker-compose -f $APP_DIR/docker-compose.prod.yml ps 2>/dev/null || echo 'Aucun conteneur en cours'
        
        echo ''
        echo '=== Services système ==='
        systemctl status docker --no-pager -l || echo 'Docker non installé'
        
        echo ''
        echo '=== Ports ouverts ==='
        netstat -tlnp | grep -E ':(80|443|3001|6379)' || echo 'Aucun port ouvert'
    "
}

# Voir les logs
view_logs() {
    log_step "Affichage des logs de l'application..."
    run_on_vps "
        cd $APP_DIR
        echo '=== Logs Backend (dernières 50 lignes) ==='
        docker-compose -f docker-compose.prod.yml logs --tail=50 backend 2>/dev/null || echo 'Aucun log backend disponible'
        
        echo ''
        echo '=== Logs Nginx (dernières 20 lignes) ==='
        docker-compose -f docker-compose.prod.yml logs --tail=20 nginx 2>/dev/null || echo 'Aucun log nginx disponible'
    "
}

# Redémarrer les services
restart_services() {
    log_step "Redémarrage des services..."
    run_on_vps "
        cd $APP_DIR
        docker-compose -f docker-compose.prod.yml restart
        echo 'Services redémarrés ✅'
    "
}

# Copier un fichier
copy_file() {
    echo "Entrez le chemin du fichier local à copier :"
    read -r local_file
    echo "Entrez le chemin de destination sur le VPS :"
    read -r remote_path
    
    if [ -f "$local_file" ]; then
        log_step "Copie de $local_file vers $VPS_HOST:$remote_path"
        copy_to_vps "$local_file" "$remote_path"
        log_info "Fichier copié avec succès ✅"
    else
        log_error "Fichier local non trouvé : $local_file"
    fi
}

# Voir l'utilisation des ressources
check_resources() {
    log_step "Vérification de l'utilisation des ressources..."
    run_on_vps "
        echo '=== Utilisation CPU et Mémoire ==='
        top -bn1 | head -20
        
        echo ''
        echo '=== Utilisation disque ==='
        df -h
        
        echo ''
        echo '=== Utilisation mémoire Docker ==='
        docker system df 2>/dev/null || echo 'Docker non disponible'
    "
}

# Mettre à jour l'application
update_app() {
    log_step "Mise à jour de l'application..."
    run_on_vps "
        cd $APP_DIR
        echo 'Mise à jour du code...'
        git pull origin main
        
        echo 'Reconstruction des conteneurs...'
        docker-compose -f docker-compose.prod.yml up -d --build
        
        echo 'Application mise à jour ✅'
    "
}

# Sauvegarder la base de données
backup_database() {
    log_step "Sauvegarde de la base de données..."
    run_on_vps "
        cd $APP_DIR
        timestamp=\$(date +%Y%m%d_%H%M%S)
        backup_dir=\"/opt/lumina-backup/\$timestamp\"
        
        mkdir -p \$backup_dir
        
        echo 'Sauvegarde des volumes Docker...'
        docker run --rm -v lumina_redis_data:/data -v \$backup_dir:/backup alpine tar czf /backup/redis_data.tar.gz -C /data .
        
        echo 'Sauvegarde créée dans : \$backup_dir'
        ls -la \$backup_dir
    "
}

# Connexion SSH
connect_ssh() {
    log_info "Connexion à votre VPS..."
    ssh $VPS_USER@$VPS_HOST
}

# Menu interactif
if [ $# -eq 0 ]; then
    while true; do
        show_menu
        read -p "Choisissez une option (0-9) : " choice
        
        case $choice in
            1) connect_ssh ;;
            2) test_connection ;;
            3) check_services ;;
            4) view_logs ;;
            5) restart_services ;;
            6) copy_file ;;
            7) check_resources ;;
            8) update_app ;;
            9) backup_database ;;
            0) log_info "Au revoir !"; exit 0 ;;
            *) log_error "Option invalide. Veuillez choisir entre 0 et 9." ;;
        esac
        
        echo ""
        read -p "Appuyez sur Entrée pour continuer..."
        clear
    done
else
    # Mode ligne de commande
    case $1 in
        "connect"|"ssh") connect_ssh ;;
        "test") test_connection ;;
        "status"|"services") check_services ;;
        "logs") view_logs ;;
        "restart") restart_services ;;
        "resources") check_resources ;;
        "update") update_app ;;
        "backup") backup_database ;;
        *) 
            echo "Usage: $0 [connect|test|status|logs|restart|resources|update|backup]"
            echo "Ou lancez sans argument pour le menu interactif"
            exit 1
            ;;
    esac
fi












