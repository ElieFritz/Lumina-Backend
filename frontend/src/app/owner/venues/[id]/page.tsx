'use client';

import { useState } from 'react';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  StarIcon,
  EyeIcon,
  CalendarDaysIcon,
  UsersIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Venue {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  priceRange: string;
  capacity: number;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  location: {
    lat: number;
    lng: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function VenueDetailPage() {
  const params = useParams();
  const venueId = params.id as string;
  const [activeTab, setActiveTab] = useState('overview');

  // Données mock - à remplacer par un appel API
  const [venue] = useState<Venue>({
    id: venueId,
    name: 'Restaurant Le Baobab',
    category: 'restaurant',
    description: 'Cuisine africaine authentique dans un cadre chaleureux et moderne. Nous proposons une expérience culinaire unique qui célèbre les saveurs traditionnelles de l\'Afrique de l\'Ouest avec une touche contemporaine.',
    address: 'Riviera 2, Cocody, Rue des Jardins',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    postalCode: '00225',
    phone: '+225 07 12 34 56 78',
    email: 'contact@lebaobab.ci',
    website: 'https://lebaobab.ci',
    priceRange: '$$',
    capacity: 80,
    status: 'active',
    rating: 4.5,
    reviewCount: 127,
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800'
    ],
    amenities: [
      'Wi-Fi gratuit',
      'Parking',
      'Terrasse',
      'Musique live',
      'Climatisation',
      'Accessible PMR',
      'Animaux acceptés',
      'Cuisine ouverte'
    ],
    openingHours: {
      monday: { open: '09:00', close: '22:00', isOpen: true },
      tuesday: { open: '09:00', close: '22:00', isOpen: true },
      wednesday: { open: '09:00', close: '22:00', isOpen: true },
      thursday: { open: '09:00', close: '22:00', isOpen: true },
      friday: { open: '09:00', close: '23:00', isOpen: true },
      saturday: { open: '09:00', close: '23:00', isOpen: true },
      sunday: { open: '10:00', close: '21:00', isOpen: true }
    },
    location: {
      lat: 5.3599,
      lng: -4.0083
    },
    tags: ['cuisine africaine', 'ambiance chaleureuse', 'terrasse', 'musique live'],
    createdAt: '2024-01-15',
    updatedAt: '2024-09-18'
  });

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'restaurant': 'Restaurant',
      'bar': 'Bar',
      'lounge': 'Lounge',
      'club': 'Club',
      'cinema': 'Cinéma',
      'theater': 'Théâtre',
      'hotel': 'Hôtel',
      'spa': 'Spa',
      'gym': 'Salle de sport',
      'other': 'Autre'
    };
    return categories[category] || category;
  };

  const getStatusLabel = (status: string) => {
    const statuses: { [key: string]: string } = {
      'active': 'Actif',
      'inactive': 'Inactif',
      'pending': 'En attente'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriceRangeLabel = (priceRange: string) => {
    switch (priceRange) {
      case '$':
        return 'Économique';
      case '$$':
        return 'Modéré';
      case '$$$':
        return 'Cher';
      case '$$$$':
        return 'Très cher';
      default:
        return priceRange;
    }
  };

  const getDayLabel = (day: string) => {
    const days: { [key: string]: string } = {
      'monday': 'Lundi',
      'tuesday': 'Mardi',
      'wednesday': 'Mercredi',
      'thursday': 'Jeudi',
      'friday': 'Vendredi',
      'saturday': 'Samedi',
      'sunday': 'Dimanche'
    };
    return days[day] || day;
  };

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: EyeIcon },
    { id: 'details', label: 'Détails', icon: BuildingOfficeIcon },
    { id: 'schedule', label: 'Horaires', icon: ClockIcon },
    { id: 'photos', label: 'Photos', icon: PhotoIcon },
    { id: 'analytics', label: 'Analytiques', icon: CalendarDaysIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/owner/venues"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{venue.name}</h1>
            <p className="text-gray-600">{getCategoryLabel(venue.category)} • {venue.city}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(venue.status)}`}>
            {getStatusLabel(venue.status)}
          </span>
          <Link
            href={`/owner/venues/${venue.id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Modifier
          </Link>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={venue.images[0]}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold mb-1">{venue.name}</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{venue.rating}</span>
              <span className="ml-1">({venue.reviewCount} avis)</span>
            </div>
            <div className="flex items-center">
              <CurrencyDollarIcon className="w-4 h-4 mr-1" />
              <span>{getPriceRangeLabel(venue.priceRange)}</span>
            </div>
            <div className="flex items-center">
              <UsersIcon className="w-4 h-4 mr-1" />
              <span>{venue.capacity} places</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{venue.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations de contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="w-5 h-5 mr-3 text-gray-400" />
                      <span>{venue.address}, {venue.city}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="w-5 h-5 mr-3 text-gray-400" />
                      <span>{venue.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <GlobeAltIcon className="w-5 h-5 mr-3 text-gray-400" />
                      <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                        {venue.website}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Équipements</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <p className="mt-1 text-sm text-gray-900">{venue.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                      <p className="mt-1 text-sm text-gray-900">{getCategoryLabel(venue.category)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Capacité</label>
                      <p className="mt-1 text-sm text-gray-900">{venue.capacity} personnes</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fourchette de prix</label>
                      <p className="mt-1 text-sm text-gray-900">{getPriceRangeLabel(venue.priceRange)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse complète</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Adresse</label>
                      <p className="mt-1 text-sm text-gray-900">{venue.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ville</label>
                      <p className="mt-1 text-sm text-gray-900">{venue.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pays</label>
                      <p className="mt-1 text-sm text-gray-900">{venue.country}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Code postal</label>
                      <p className="mt-1 text-sm text-gray-900">{venue.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mots-clés</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Horaires d'ouverture</h3>
              <div className="space-y-3">
                {Object.entries(venue.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <span className="w-20 text-sm font-medium text-gray-900">
                        {getDayLabel(day)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={hours.isOpen}
                          disabled
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-600">
                          {hours.isOpen ? 'Ouvert' : 'Fermé'}
                        </span>
                      </div>
                    </div>
                    {hours.isOpen && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{hours.open}</span>
                        <span>à</span>
                        <span>{hours.close}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Photos de l'établissement</h3>
                <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <PhotoIcon className="w-4 h-4 mr-2" />
                  Ajouter des photos
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {venue.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`${venue.name} - Photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full text-gray-600 hover:text-red-600 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytiques de l'établissement</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Vues totales</h4>
                  <p className="text-2xl font-bold text-gray-900">2,847</p>
                  <p className="text-sm text-green-600">+12% ce mois</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Réservations</h4>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-green-600">+8% ce mois</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Note moyenne</h4>
                  <p className="text-2xl font-bold text-gray-900">{venue.rating}</p>
                  <p className="text-sm text-gray-600">sur 5 étoiles</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-sm font-medium text-gray-600 mb-4">Évolution des vues (30 derniers jours)</h4>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Graphique des vues (à implémenter)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
