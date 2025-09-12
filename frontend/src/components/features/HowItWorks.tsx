import { 
  MagnifyingGlassIcon, 
  CalendarDaysIcon, 
  CreditCardIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const steps = [
  {
    icon: MagnifyingGlassIcon,
    title: 'Découvrez',
    description: 'Explorez les meilleurs établissements et événements près de chez vous',
    color: 'text-primary-600'
  },
  {
    icon: CalendarDaysIcon,
    title: 'Réservez',
    description: 'Choisissez votre date et réservez en quelques clics',
    color: 'text-secondary-600'
  },
  {
    icon: CreditCardIcon,
    title: 'Payez',
    description: 'Paiement sécurisé via Mobile Money ou carte bancaire',
    color: 'text-green-600'
  },
  {
    icon: CheckCircleIcon,
    title: 'Profitez',
    description: 'Présentez votre QR code et profitez de votre sortie',
    color: 'text-purple-600'
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, rapide et sécurisé. Réservez vos sorties en 4 étapes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className={`w-16 h-16 ${step.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center mx-auto`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform translate-x-4">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                )}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

