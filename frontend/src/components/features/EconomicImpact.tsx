'use client';

import { useState } from 'react';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface ImpactMetric {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: 'up' | 'down' | 'stable';
  percentage: string;
}

export function EconomicImpact() {
  const [activeTab, setActiveTab] = useState('entrepreneurs');

  const impactMetrics: Record<string, ImpactMetric[]> = {
    entrepreneurs: [
      {
        id: 'revenue',
        title: 'Revenus supplémentaires',
        value: '2.5M FCFA',
        description: 'Revenus moyens générés par mois',
        icon: CurrencyDollarIcon,
        color: 'text-green-600',
        trend: 'up',
        percentage: '+45%'
      },
      {
        id: 'customers',
        title: 'Nouveaux clients',
        value: '150+',
        description: 'Clients acquis via la plateforme',
        icon: UserGroupIcon,
        color: 'text-blue-600',
        trend: 'up',
        percentage: '+60%'
      },
      {
        id: 'visibility',
        title: 'Visibilité digitale',
        value: '300%',
        description: 'Augmentation de la visibilité en ligne',
        icon: ChartBarIcon,
        color: 'text-purple-600',
        trend: 'up',
        percentage: '+300%'
      }
    ],
    consumers: [
      {
        id: 'savings',
        title: 'Économies réalisées',
        value: '25%',
        description: 'Réduction moyenne des coûts de sortie',
        icon: BanknotesIcon,
        color: 'text-green-600',
        trend: 'up',
        percentage: '-25%'
      },
      {
        id: 'discovery',
        title: 'Nouveaux lieux découverts',
        value: '80%',
        description: 'Utilisateurs découvrent de nouveaux endroits',
        icon: BuildingOfficeIcon,
        color: 'text-orange-600',
        trend: 'up',
        percentage: '+80%'
      },
      {
        id: 'satisfaction',
        title: 'Satisfaction client',
        value: '4.8/5',
        description: 'Note moyenne des expériences',
        icon: ArrowTrendingUpIcon,
        color: 'text-yellow-600',
        trend: 'up',
        percentage: '+15%'
      }
    ],
    economy: [
      {
        id: 'jobs',
        title: 'Emplois créés',
        value: '500+',
        description: 'Emplois directs et indirects générés',
        icon: UserGroupIcon,
        color: 'text-blue-600',
        trend: 'up',
        percentage: '+200%'
      },
      {
        id: 'gdp',
        title: 'Contribution au PIB',
        value: '0.3%',
        description: 'Contribution au PIB local',
        icon: ChartBarIcon,
        color: 'text-green-600',
        trend: 'up',
        percentage: '+0.3%'
      },
      {
        id: 'digital',
        title: 'Transformation digitale',
        value: '85%',
        description: 'Établissements digitalisés',
        icon: BuildingOfficeIcon,
        color: 'text-purple-600',
        trend: 'up',
        percentage: '+85%'
      }
    ]
  };

  const tabs = [
    { id: 'entrepreneurs', label: 'Entrepreneurs', icon: BuildingOfficeIcon },
    { id: 'consumers', label: 'Consommateurs', icon: UserGroupIcon },
    { id: 'economy', label: 'Économie locale', icon: ChartBarIcon }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Impact économique réel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lumina Africa ne se contente pas de connecter les gens, nous créons une véritable économie collaborative
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 mb-4 mx-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impactMetrics[activeTab].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    metric.color.replace('text-', 'bg-').replace('-600', '-100')
                  }`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.percentage}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      metric.trend === 'up' ? 'bg-green-500' : 
                      metric.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </h3>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  {metric.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Success Stories */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Histoires de succès
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Restaurant Le Bistrot</h4>
                  <p className="text-sm text-gray-600">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Depuis notre partenariat avec Lumina Africa, nos revenus ont augmenté de 45%. 
                Nous recevons 150 nouveaux clients par mois grâce à la plateforme."
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-semibold">+45% de revenus</span>
                <span className="text-gray-500">150 clients/mois</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Club Nocturne Yopougon</h4>
                  <p className="text-sm text-gray-600">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "La digitalisation de nos réservations nous a fait gagner 3 heures par jour. 
                Nos soirées sont maintenant toujours complètes."
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600 font-semibold">+80% d'occupation</span>
                <span className="text-gray-500">3h économisées/jour</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
