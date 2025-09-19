export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>
          <div className="prose prose-lg max-w-none">
            <h2>1. Collecte des données</h2>
            <p>Nous collectons uniquement les données nécessaires au fonctionnement de notre service.</p>
            
            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour améliorer votre expérience et personnaliser nos services.</p>
            
            <h2>3. Partage des données</h2>
            <p>Nous ne partageons jamais vos données personnelles avec des tiers sans votre consentement.</p>
            
            <h2>4. Sécurité</h2>
            <p>Nous mettons en place des mesures de sécurité appropriées pour protéger vos données.</p>
            
            <h2>5. Vos droits</h2>
            <p>Vous avez le droit d'accéder, modifier ou supprimer vos données personnelles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
