import { Controller, Get, Query } from '@nestjs/common';

@Controller('venues')
export class SimpleVenuesController {
  private mockVenues = [
    {
      id: 1,
      name: "Restaurant Le Baobab",
      description: "Cuisine africaine authentique dans un cadre chaleureux",
      category: "restaurant",
      location: {
        address: "123 Avenue de la République",
        city: "Abidjan",
        coordinates: { lat: 5.3599, lng: -4.0083 }
      },
      rating: 4.5,
      priceRange: "€€",
      images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500"],
      isOpen: true,
      openingHours: "11:00 - 23:00"
    },
    {
      id: 2,
      name: "Cinéma Canal Olympia",
      description: "Cinéma moderne avec les dernières sorties",
      category: "cinema",
      location: {
        address: "456 Boulevard de la Paix",
        city: "Abidjan",
        coordinates: { lat: 5.3600, lng: -4.0084 }
      },
      rating: 4.2,
      priceRange: "€€",
      images: ["https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=500"],
      isOpen: true,
      openingHours: "10:00 - 24:00"
    },
    {
      id: 3,
      name: "Lounge Sky Bar",
      description: "Bar panoramique avec vue sur la ville",
      category: "lounge",
      location: {
        address: "789 Rue des Cocotiers",
        city: "Abidjan",
        coordinates: { lat: 5.3601, lng: -4.0085 }
      },
      rating: 4.7,
      priceRange: "€€€",
      images: ["https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500"],
      isOpen: true,
      openingHours: "18:00 - 02:00"
    }
  ];

  @Get()
  getAllVenues(@Query('category') category?: string) {
    let venues = this.mockVenues;
    
    if (category) {
      venues = venues.filter(venue => venue.category === category);
    }
    
    return {
      data: venues,
      total: venues.length,
      page: 1,
      limit: 10
    };
  }
}
