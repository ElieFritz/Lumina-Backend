'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface Stat {
  id: string;
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats: Stat[] = [
    {
      id: 'users',
      value: '50K+',
      label: 'Utilisateurs actifs',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Croissance de 300% cette année'
    },
    {
      id: 'venues',
      value: '500+',
      label: 'Établissements partenaires',
      icon: BuildingOfficeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Dans 15 villes africaines'
    },
    {
      id: 'events',
      value: '10K+',
      label: 'Événements organisés',
      icon: CalendarDaysIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Chaque mois en moyenne'
    },
    {
      id: 'revenue',
      value: '2M+',
      label: 'FCFA générés',
      icon: CurrencyDollarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Pour nos partenaires'
    },
    {
      id: 'growth',
      value: '400%',
      label: 'Croissance annuelle',
      icon: ArrowTrendingUpIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Taux de croissance record'
    },
    {
      id: 'cities',
      value: '15+',
      label: 'Villes couvertes',
      icon: GlobeAltIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'De Dakar à Johannesburg'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Lumina Africa en chiffres
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La plateforme qui révolutionne les sorties en Afrique et crée des opportunités économiques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">
                      {stat.description}
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      isVisible ? 'w-full' : 'w-0'
                    }`}
                    style={{ 
                      backgroundColor: stat.color.replace('text-', 'bg-'),
                      animationDelay: `${index * 200 + 500}ms`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Call-to-action pour les entrepreneurs */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Rejoignez la révolution économique africaine
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Devenez partenaire et générez des revenus supplémentaires avec votre établissement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Devenir partenaire
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
                Voir les opportunités
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
