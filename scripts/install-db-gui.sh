#!/bin/bash

echo "🖥️  INSTALLATION INTERFACE GRAPHIQUE BASE DE DONNÉES"
echo "=================================================="
echo ""

echo "Choisissez une interface graphique pour PostgreSQL:"
echo ""
echo "1. DBeaver (Gratuit, multiplateforme, recommandé)"
echo "2. TablePlus (macOS, interface moderne)"
echo "3. pgAdmin (Web-based, complet)"
echo "4. Toutes les options"
echo ""

read -p "Votre choix (1-4): " choice

case $choice in
    1)
        echo "📥 Installation de DBeaver..."
        brew install --cask dbeaver-community
        echo "✅ DBeaver installé!"
        echo "   Lancez DBeaver et connectez-vous avec:"
        echo "   • Host: localhost"
        echo "   • Port: 5432"
        echo "   • Database: lumina_africa"
        echo "   • User: $(whoami)"
        ;;
    2)
        echo "📥 Installation de TablePlus..."
        brew install --cask tableplus
        echo "✅ TablePlus installé!"
        echo "   Lancez TablePlus et créez une nouvelle connexion PostgreSQL"
        ;;
    3)
        echo "📥 Installation de pgAdmin..."
        brew install --cask pgadmin4
        echo "✅ pgAdmin installé!"
        echo "   Lancez pgAdmin et configurez un nouveau serveur"
        ;;
    4)
        echo "📥 Installation de toutes les interfaces..."
        brew install --cask dbeaver-community
        brew install --cask tableplus
        brew install --cask pgadmin4
        echo "✅ Toutes les interfaces installées!"
        echo ""
        echo "🔗 Informations de connexion pour toutes:"
        echo "   • Host: localhost"
        echo "   • Port: 5432"
        echo "   • Database: lumina_africa"
        echo "   • User: $(whoami)"
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "📋 Prochaines étapes:"
echo "1. Lancez l'interface graphique installée"
echo "2. Créez une nouvelle connexion PostgreSQL"
echo "3. Utilisez les informations de connexion ci-dessus"
echo "4. Explorez la base de données 'lumina_africa'"
echo ""
echo "✅ Installation terminée!"
