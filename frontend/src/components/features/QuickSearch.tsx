'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CalendarDaysIcon,
  TagIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface QuickSearchOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  popular?: boolean;
}

export function QuickSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const quickOptions: QuickSearchOption[] = [
    {
      id: 'restaurants',
      title: 'Restaurants',
      description: 'Découvrez les meilleures tables',
      icon: TagIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      popular: true
    },
    {
      id: 'events',
      title: 'Événements',
      description: 'Concerts, spectacles, festivals',
      icon: CalendarDaysIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      popular: true
    },
    {
      id: 'nightlife',
      title: 'Vie nocturne',
      description: 'Bars, clubs, lounges',
      icon: FireIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'culture',
      title: 'Culture',
      description: 'Cinémas, théâtres, musées',
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const popularSearches = [
    'Restaurant français Abidjan',
    'Concert ce weekend',
    'Bar avec terrasse',
    'Cinéma IMAX',
    'Soirée VIP',
    'Brunch dimanche'
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // TODO: Navigate to search results
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              Que voulez-vous faire aujourd'hui ?
            </h2>
            <p className="text-lg text-gray-600">
              Trouvez rapidement votre prochaine sortie avec des recommandations personnalisées
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Restaurant, concert, bar, cinéma..."
                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="md:w-64">
                <div className="relative">
                  <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Où ? (Ville, quartier)"
                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>Rechercher</span>
              </button>
            </div>
          </div>

          {/* Quick Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recherches populaires</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedCategory(option.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedCategory === option.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${option.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${option.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{option.title}</span>
                          {option.popular && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Populaire
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Searches */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recherches fréquentes</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
