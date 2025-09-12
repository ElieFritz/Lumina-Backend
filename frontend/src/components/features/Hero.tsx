'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { VenueCategory } from '@/types/venue';
import { SearchSuggestions } from './SearchSuggestions';

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: VenueCategory.RESTAURANT, label: 'Restaurants' },
    { value: VenueCategory.CINEMA, label: 'Cinémas' },
    { value: VenueCategory.LOUNGE, label: 'Lounges' },
    { value: VenueCategory.CONCERT_HALL, label: 'Salles de concert' },
    { value: VenueCategory.BAR, label: 'Bars' },
    { value: VenueCategory.CLUB, label: 'Clubs' },
    { value: VenueCategory.THEATER, label: 'Théâtres' },
    { value: VenueCategory.SPORTS, label: 'Sports' },
  ];

  // Détection automatique de la géolocalisation
  useEffect(() => {
    if (navigator.geolocation && !location) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Utiliser l'API de géocodage inverse pour obtenir la ville
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=fr`
            );
            const data = await response.json();
            if (data.city) {
              setLocation(data.city);
            }
          } catch (error) {
            console.log('Erreur de géocodage:', error);
          } finally {
            setIsDetectingLocation(false);
          }
        },
        (error) => {
          console.log('Erreur de géolocalisation:', error);
          setIsDetectingLocation(false);
        },
        { timeout: 10000 }
      );
    }
  }, [location]);

  const handleSearch = () => {
    // Construire l'URL de recherche avec les paramètres
    const searchParams = new URLSearchParams();
    
    if (searchQuery.trim()) {
      searchParams.set('q', searchQuery.trim());
    }
    
    if (location.trim()) {
      searchParams.set('location', location.trim());
    }
    
    if (category) {
      searchParams.set('category', category);
    }
    
    // Rediriger vers la page de résultats
    const searchUrl = `/venues?${searchParams.toString()}`;
    window.location.href = searchUrl;
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=fr`
            );
            const data = await response.json();
            if (data.city) {
              setLocation(data.city);
            }
          } catch (error) {
            console.log('Erreur de géocodage:', error);
          } finally {
            setIsDetectingLocation(false);
          }
        },
        (error) => {
          console.log('Erreur de géolocalisation:', error);
          setIsDetectingLocation(false);
        }
      );
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handleSearchInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchInputBlur = () => {
    // Délai pour permettre le clic sur les suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

      <div className="relative container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mb-4 sm:mb-6">
            Découvrez les meilleures
            <span className="block text-yellow-300">sorties d'Afrique</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-100 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            Restaurants, concerts, événements... Trouvez et réservez vos sorties préférées en quelques clics
          </p>

          {/* Search Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl mx-2 sm:mx-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search Query */}
              <div className="sm:col-span-2 lg:col-span-2 relative">
                <label htmlFor="search" className="block text-xs sm:text-sm font-medium text-primary-100 mb-1 sm:mb-2">
                  Que recherchez-vous ?
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchInputFocus}
                    onBlur={handleSearchInputBlur}
                    placeholder="Restaurant, concert, événement..."
                    className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                  />
                  <SearchSuggestions
                    query={searchQuery}
                    onSelect={handleSuggestionSelect}
                    isVisible={showSuggestions}
                    onClose={() => setShowSuggestions(false)}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-primary-100 mb-1 sm:mb-2">
                  Où ?
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ville, quartier..."
                    className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Détecter ma position"
                  >
                    {isDetectingLocation ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-primary-100 mb-1 sm:mb-2">
                  Catégorie
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-4 sm:mt-6">
              <Button
                onClick={handleSearch}
                size="lg"
                className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg"
              >
                <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-1 sm:mr-2" />
                Rechercher
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-1 sm:mb-2">500+</div>
              <div className="text-sm sm:text-base text-primary-100">Établissements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-1 sm:mb-2">10K+</div>
              <div className="text-sm sm:text-base text-primary-100">Événements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-1 sm:mb-2">50K+</div>
              <div className="text-sm sm:text-base text-primary-100">Utilisateurs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

