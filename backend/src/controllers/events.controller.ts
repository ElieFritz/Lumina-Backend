import { Controller, Get, Param, Query } from '@nestjs/common';

// Types temporaires
interface Event {
  id: number;
  title: string;
  description: string;
  venueId: number;
  venueName: string;
  category: string;
  date: string;
  time: string;
  price: number;
  currency: string;
  availableTickets: number;
  totalTickets: number;
  images: string[];
  isActive: boolean;
}

@Controller('events')
export class EventsController {
  private mockEvents: Event[] = [
    {
      id: 1,
      title: "Concert Youssou N'Dour",
      description: "Concert exceptionnel du légendaire chanteur sénégalais",
      venueId: 1,
      venueName: "Restaurant Le Baobab",
      category: "concert",
      date: "2024-12-15",
      time: "20:00",
      price: 25000,
      currency: "XOF",
      availableTickets: 45,
      totalTickets: 100,
      images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"],
      isActive: true
    },
    {
      id: 2,
      title: "Avant-première Black Panther 3",
      description: "Projection en avant-première du nouveau film Marvel",
      venueId: 2,
      venueName: "Cinéma Canal Olympia",
      category: "cinema",
      date: "2024-12-20",
      time: "19:30",
      price: 5000,
      currency: "XOF",
      availableTickets: 120,
      totalTickets: 150,
      images: ["https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=500"],
      isActive: true
    },
    {
      id: 3,
      title: "Soirée Jazz au Lounge",
      description: "Soirée jazz avec groupe local et cocktails signature",
      venueId: 3,
      venueName: "Lounge Sky Bar",
      category: "lounge",
      date: "2024-12-18",
      time: "21:00",
      price: 15000,
      currency: "XOF",
      availableTickets: 25,
      totalTickets: 50,
      images: ["https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500"],
      isActive: true
    }
  ];

  @Get()
  getAllEvents(@Query('category') category?: string) {
    let events = this.mockEvents;
    
    if (category) {
      events = events.filter(event => event.category === category);
    }
    
    return {
      data: events,
      total: events.length,
      page: 1,
      limit: 10
    };
  }

  @Get(':id')
  getEventById(@Param('id') id: string) {
    const event = this.mockEvents.find(e => e.id === parseInt(id));
    
    if (!event) {
      return {
        error: 'Event not found',
        statusCode: 404
      };
    }
    
    return { data: event };
  }

  @Get('venue/:venueId')
  getEventsByVenue(@Param('venueId') venueId: string) {
    const events = this.mockEvents.filter(event => event.venueId === parseInt(venueId));
    
    return {
      data: events,
      total: events.length,
      venueId: parseInt(venueId)
    };
  }
}
