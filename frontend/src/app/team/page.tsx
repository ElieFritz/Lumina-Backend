export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Notre Équipe</h1>
          <p className="text-gray-600 mb-8">
            Découvrez les talents qui font de Lumina Africa une plateforme exceptionnelle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">EF</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Elie Fritz</h3>
              <p className="text-primary-600 text-center mb-2">Fondateur & CEO</p>
              <p className="text-gray-600 text-sm text-center">
                Visionnaire et entrepreneur passionné par l'innovation technologique en Afrique.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-24 h-24 bg-secondary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-secondary-600">MM</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Marie Martin</h3>
              <p className="text-primary-600 text-center mb-2">CTO</p>
              <p className="text-gray-600 text-sm text-center">
                Experte en technologies web et mobile, spécialisée dans les solutions scalables.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">AK</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Aïcha Kouamé</h3>
              <p className="text-primary-600 text-center mb-2">Head of Design</p>
              <p className="text-gray-600 text-sm text-center">
                Créatrice d'expériences utilisateur exceptionnelles et d'interfaces intuitives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
