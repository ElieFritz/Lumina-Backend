export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Centre d'aide</h1>
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Comment réserver ?</h2>
              <p className="text-gray-600">
                La réservation est simple : découvrez les lieux, choisissez votre date, et réservez en quelques clics.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Modes de paiement</h2>
              <p className="text-gray-600">
                Nous acceptons Mobile Money, cartes bancaires et autres moyens de paiement locaux.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Annulation</h2>
              <p className="text-gray-600">
                Vous pouvez annuler votre réservation jusqu'à 24h avant l'événement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
