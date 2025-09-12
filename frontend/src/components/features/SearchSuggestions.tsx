'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, ClockIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'category';
  category?: string;
}

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

export function SearchSuggestions({ query, onSelect, isVisible, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Suggestions statiques pour la démonstration
  const staticSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'Restaurants italiens', type: 'trending', category: 'restaurant' },
    { id: '2', text: 'Cinémas à Abidjan', type: 'trending', category: 'cinema' },
    { id: '3', text: 'Bars avec terrasse', type: 'trending', category: 'bar' },
    { id: '4', text: 'Concerts ce weekend', type: 'trending', category: 'concert' },
    { id: '5', text: 'Lounges VIP', type: 'trending', category: 'lounge' },
    { id: '6', text: 'Clubs de nuit', type: 'trending', category: 'club' },
    { id: '7', text: 'Théâtres', type: 'category', category: 'theater' },
    { id: '8', text: 'Sports et fitness', type: 'category', category: 'sports' },
  ];

  // Suggestions récentes (simulées)
  const recentSuggestions: SearchSuggestion[] = [
    { id: 'r1', text: 'Pizza', type: 'recent' },
    { id: 'r2', text: 'Cinéma Cocody', type: 'recent' },
    { id: 'r3', text: 'Bar sportif', type: 'recent' },
  ];

  useEffect(() => {
    if (!query.trim() || !isVisible) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    // Simuler un délai de recherche
    const timer = setTimeout(() => {
      const filteredSuggestions = [
        ...staticSuggestions.filter(s => 
          s.text.toLowerCase().includes(query.toLowerCase())
        ),
        ...recentSuggestions.filter(s => 
          s.text.toLowerCase().includes(query.toLowerCase())
        )
      ].slice(0, 8);

      setSuggestions(filteredSuggestions);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex].text);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, selectedIndex, suggestions, onSelect, onClose]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  if (!isVisible || (!query.trim() && suggestions.length === 0)) {
    return null;
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
      case 'trending':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case 'recent':
        return 'Récent';
      case 'trending':
        return 'Tendance';
      default:
        return 'Catégorie';
    }
  };

  return (
    <div 
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-80 overflow-y-auto"
    >
      {loading ? (
        <div className="p-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <p className="text-gray-500 mt-2">Recherche...</p>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="py-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => onSelect(suggestion.text)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between ${
                index === selectedIndex ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {getSuggestionIcon(suggestion.type)}
                <span className="text-gray-900">{suggestion.text}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {getSuggestionLabel(suggestion.type)}
              </span>
            </button>
          ))}
        </div>
      ) : query.trim() ? (
        <div className="p-4 text-center text-gray-500">
          <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>Aucune suggestion trouvée</p>
        </div>
      ) : null}
      
      {/* Suggestions populaires quand pas de requête */}
      {!query.trim() && (
        <div className="py-2">
          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            Suggestions populaires
          </div>
          {staticSuggestions.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => onSelect(suggestion.text)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
            >
              {getSuggestionIcon(suggestion.type)}
              <span className="text-gray-900">{suggestion.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
