'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  CalendarDaysIcon, 
  CreditCardIcon,
  QrCodeIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface ValuePoint {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  benefit: string;
}

export function ValueProposition() {
  const [activePoint, setActivePoint] = useState(0);

  const valuePoints: ValuePoint[] = [
    {
      id: 'discover',
      title: 'Découvrez',
      description: 'Explorez les meilleurs endroits près de chez vous avec des recommandations personnalisées',
      icon: MagnifyingGlassIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      benefit: 'Trouvez des endroits que vous ne connaissiez pas'
    },
    {
      id: 'book',
      title: 'Réservez',
      description: 'Réservez en quelques clics avec des réductions exclusives et des offres spéciales',
      icon: CalendarDaysIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      benefit: 'Jusqu\'à 50% de réduction sur vos sorties'
    },
    {
      id: 'pay',
      title: 'Payez',
      description: 'Paiement sécurisé via Mobile Money, Orange Money ou carte bancaire',
      icon: CreditCardIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      benefit: 'Paiements instantanés et sécurisés'
    },
    {
      id: 'enjoy',
      title: 'Profitez',
      description: 'Présentez votre QR code à l\'entrée et profitez de votre sortie',
      icon: QrCodeIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      benefit: 'Entrée rapide, plus d\'attente'
    }
  ];

  const quickStats = [
    { icon: MapPinIcon, value: '500+', label: 'Établissements', color: 'text-blue-600' },
    { icon: StarIcon, value: '4.8/5', label: 'Note moyenne', color: 'text-yellow-600' },
    { icon: UsersIcon, value: '50K+', label: 'Utilisateurs', color: 'text-green-600' },
    { icon: CurrencyDollarIcon, value: '2M+', label: 'FCFA économisés', color: 'text-purple-600' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Votre sortie parfaite en 4 étapes simples
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez, réservez, payez et profitez des meilleures sorties d'Afrique 
            avec des réductions exclusives et des paiements sécurisés
          </p>
        </div>

        {/* Value Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {valuePoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={point.id}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                  activePoint === index ? 'ring-2 ring-primary-500 scale-105' : ''
                }`}
                onClick={() => setActivePoint(index)}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${point.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${point.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {point.description}
                  </p>
                  <div className={`text-sm font-medium ${point.color}`}>
                    {point.benefit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Rejoignez des milliers d'utilisateurs satisfaits
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors text-lg">
              Découvrir les sorties
            </button>
            <button className="border-2 border-primary-600 text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-600 hover:text-white transition-colors text-lg">
              Voir les réductions
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✨ Première sortie gratuite • 💳 Paiements sécurisés • 📱 Application mobile
          </p>
        </div>
      </div>
    </section>
  );
}
