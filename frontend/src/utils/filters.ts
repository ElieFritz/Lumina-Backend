import { Venue, Event, VenueCategory } from '@/types';

export function filterVenues(venues: Venue[], filters: {
  searchQuery: string;
  location: string;
  category: string;
  sortBy: string;
}) {
  let filteredVenues = [...venues];
  
  if (filters.searchQuery) {
    filteredVenues = filteredVenues.filter(venue =>
      venue.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      venue.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );
  }
  
  if (filters.location) {
    filteredVenues = filteredVenues.filter(venue =>
      venue.address.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.category) {
    filteredVenues = filteredVenues.filter(venue => venue.category === filters.category);
  }
  
  // Trier les résultats
  filteredVenues.sort((a, b) => {
    switch (filters.sortBy) {
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return (a.priceRange || 0) - (b.priceRange || 0);
      default:
        return 0;
    }
  });
  
  return filteredVenues;
}

export function filterEvents(events: Event[], filters: {
  searchQuery: string;
  location: string;
  date: string;
  priceRange: string;
  sortBy: string;
}) {
  let filteredEvents = [...events];
  
  if (filters.searchQuery) {
    filteredEvents = filteredEvents.filter(event =>
      event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      event.tags?.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );
  }
  
  if (filters.location) {
    filteredEvents = filteredEvents.filter(event =>
      event.venue.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.date) {
    const searchDate = new Date(filters.date);
    filteredEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate.toDateString() === searchDate.toDateString();
    });
  }
  
  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split('-').map(Number);
    filteredEvents = filteredEvents.filter(event => {
      if (max) {
        return event.price >= min && event.price <= max;
      }
      return event.price >= min;
    });
  }
  
  // Trier les résultats
  filteredEvents.sort((a, b) => {
    switch (filters.sortBy) {
      case 'date':
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      case 'price':
        return a.price - b.price;
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'popularity':
        return b.currentBookings - a.currentBookings;
      default:
        return 0;
    }
  });
  
  return filteredEvents;
}

export function getCategoryEmoji(category: VenueCategory): string {
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
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
