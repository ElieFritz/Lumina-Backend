import React from 'react';
import { MagnifyingGlassIcon, MapPinIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface SearchFormProps {
  searchQuery: string;
  location: string;
  date: string;
  priceRange: string;
  onSearchChange: (field: string, value: string) => void;
  onSearch: () => void;
  onClearFilters: () => void;
  showDateFilter?: boolean;
  showPriceFilter?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchForm({
  searchQuery,
  location,
  date,
  priceRange,
  onSearchChange,
  onSearch,
  onClearFilters,
  showDateFilter = true,
  showPriceFilter = true,
  placeholder = "Que recherchez-vous ?",
  className = ""
}: SearchFormProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rechercher</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Recherche */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            {placeholder}
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => onSearchChange('search', e.target.value)}
              placeholder="Restaurant, concert, événement..."
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Localisation */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Où ?
          </label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => onSearchChange('location', e.target.value)}
              placeholder="Ville, quartier..."
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Date */}
        {showDateFilter && (
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Quand ?
            </label>
            <div className="relative">
              <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => onSearchChange('date', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        )}

        {/* Prix */}
        {showPriceFilter && (
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Prix
            </label>
            <select
              id="price"
              value={priceRange}
              onChange={(e) => onSearchChange('price', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Tous les prix</option>
              <option value="0-5000">Gratuit - 5,000 FCFA</option>
              <option value="5000-15000">5,000 - 15,000 FCFA</option>
              <option value="15000-30000">15,000 - 30,000 FCFA</option>
              <option value="30000-">30,000+ FCFA</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button onClick={onSearch} className="bg-primary-600 hover:bg-primary-700">
          <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
          Rechercher
        </Button>

        <Button onClick={onClearFilters} variant="outline">
          Effacer les filtres
        </Button>
      </div>
    </div>
  );
}
