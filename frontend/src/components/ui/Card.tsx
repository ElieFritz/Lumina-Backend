import React from 'react';
import { MapPinIcon, StarIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { Venue, Event, VenueCategory } from '@/types';

interface VenueCardProps {
  venue: Venue;
  onViewDetails: (id: string) => void;
  className?: string;
}

interface EventCardProps {
  event: Event;
  onViewDetails: (id: string) => void;
  className?: string;
}

export function VenueCard({ venue, onViewDetails, className = "" }: VenueCardProps) {
  const getCategoryEmoji = (category: VenueCategory) => {
    const emojis = {
      [VenueCategory.RESTAURANT]: '🍽️',
      [VenueCategory.CINEMA]: '🎬',
      [VenueCategory.LOUNGE]: '🍸',
      [VenueCategory.CONCERT_HALL]: '🎵',
      [VenueCategory.BAR]: '🍺',
      [VenueCategory.CLUB]: '🕺',
      [VenueCategory.THEATER]: '🎭',
      [VenueCategory.SPORTS]: '⚽',
    };
    return emojis[category] || '📍';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <div className="relative">
        <img
          src={venue.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
          alt={venue.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
            {getCategoryEmoji(venue.category)} {venue.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
            venue.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {venue.isActive ? 'Ouvert' : 'Fermé'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{venue.description}</p>
        
        <div className="flex items-center text-gray-500 mb-4">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span className="text-sm">{venue.address}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{venue.averageRating || 'N/A'}</span>
            <span className="text-sm text-gray-500 ml-1">({venue.totalReviews})</span>
          </div>
          <div className="text-sm text-gray-500">
            {venue.priceRange ? `${venue.priceRange} FCFA` : 'Prix sur demande'}
          </div>
        </div>
        
        <Button 
          onClick={() => onViewDetails(venue.id)}
          className="w-full bg-primary-600 hover:bg-primary-700"
        >
          Voir les détails
        </Button>
      </div>
    </div>
  );
}

export function EventCard({ event, onViewDetails, className = "" }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getAvailabilityColor = (current: number, max?: number) => {
    if (!max) return 'text-gray-600';
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <div className="relative">
        <img
          src={event.images?.[0] || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
            {formatPrice(event.price)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
            event.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {event.status === 'published' ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="flex items-center text-gray-500 mb-2">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span className="text-sm">{formatDate(event.eventDate)}</span>
        </div>
        
        <div className="flex items-center text-gray-500 mb-2">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span className="text-sm">{event.venue.name}, {event.venue.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{event.averageRating || 'N/A'}</span>
            <span className="text-sm text-gray-500 ml-1">({event.totalReviews})</span>
          </div>
          <div className={`text-sm font-medium ${getAvailabilityColor(event.currentBookings, event.maxCapacity)}`}>
            {event.currentBookings}/{event.maxCapacity || '∞'} places
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 mb-4">
          <UsersIcon className="w-4 h-4 mr-1" />
          <span className="text-sm">Organisé par {event.organizer.firstName} {event.organizer.lastName}</span>
        </div>
        
        <Button 
          onClick={() => onViewDetails(event.id)}
          className="w-full bg-primary-600 hover:bg-primary-700"
        >
          Voir les détails
        </Button>
      </div>
    </div>
  );
}
