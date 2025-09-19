export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">À propos de Lumina Africa</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Lumina Africa est la plateforme de référence pour découvrir et réserver les meilleures sorties en Afrique. 
              Nous connectons les utilisateurs aux meilleurs restaurants, lounges, cinémas, concerts et événements 
              à travers le continent africain.
            </p>
            <p className="text-gray-600 mb-6">
              Notre mission est de démocratiser l'accès à la culture et aux loisirs en Afrique, en offrant une 
              expérience de réservation simple, sécurisée et accessible à tous.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notre Vision</h2>
            <p className="text-gray-600 mb-6">
              Devenir la plateforme incontournable pour les sorties en Afrique, en créant un écosystème 
              qui profite à la fois aux utilisateurs et aux partenaires.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
