'use client';

import { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon, 
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  ClockIcon,
  PhotoIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface VenueInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  capacity: number;
  status: 'active' | 'inactive' | 'pending';
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
}

export default function VenuePage() {
  const [venue, setVenue] = useState<VenueInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showImageUpload, setShowImageUpload] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setVenue({
        id: '1',
        name: 'Restaurant Le Baobab',
        description: 'Restaurant traditionnel africain offrant une cuisine authentique dans une ambiance chaleureuse.',
        category: 'restaurant',
        address: '123 Avenue de la République',
        city: 'Abidjan',
        phone: '+225 20 30 40 50',
        email: 'contact@lebaobab.ci',
        website: 'www.lebaobab.ci',
        openingHours: {
          monday: '11:00 - 23:00',
          tuesday: '11:00 - 23:00',
          wednesday: '11:00 - 23:00',
          thursday: '11:00 - 23:00',
          friday: '11:00 - 00:00',
          saturday: '11:00 - 00:00',
          sunday: '12:00 - 22:00',
        },
        services: ['WiFi', 'Parking', 'Terrasse', 'Climatisation', 'Musique live'],
        capacity: 80,
        status: 'active',
        isVerified: true,
        rating: 4.5,
        reviewCount: 127,
        images: [
          '/images/venue-1.jpg',
          '/images/venue-2.jpg',
          '/images/venue-3.jpg',
        ],
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const getCategoryLabel = (category: string) => {
    const categories = {
      restaurant: 'Restaurant',
      bar: 'Bar',
      lounge: 'Lounge',
      club: 'Club',
      cafe: 'Café',
      hotel: 'Hôtel',
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: 'Actif' },
      inactive: { color: 'gray', text: 'Inactif' },
      pending: { color: 'yellow', text: 'En attente' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  const handleSave = () => {
    // Logique de sauvegarde
    setIsEditing(false);
    // Ici, vous feriez un appel API pour sauvegarder les modifications
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Recharger les données originales
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="text-center py-12">
        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun établissement</h3>
        <p className="mt-1 text-sm text-gray-500">Commencez par créer votre établissement.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Établissement</h1>
          <p className="mt-2 text-gray-600">
            Gérez les informations de votre établissement
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Modifier
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Sauvegarder
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status and Verification */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{venue.name}</h2>
              <p className="text-gray-600">{getCategoryLabel(venue.category)}</p>
            </div>
            {getStatusBadge(venue.status)}
          </div>
          <div className="flex items-center space-x-2">
            {venue.isVerified && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Vérifié
              </span>
            )}
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">{venue.rating}/5</span>
              <span className="text-sm text-gray-500 ml-1">({venue.reviewCount} avis)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Photos</h2>
          <button
            onClick={() => setShowImageUpload(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Ajouter des photos
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {venue.images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                <PhotoIcon className="w-full h-full text-gray-400" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                <button className="opacity-0 group-hover:opacity-100 text-white bg-red-600 hover:bg-red-700 rounded-full p-2 transition-all duration-200">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'établissement</label>
            {isEditing ? (
              <input
                type="text"
                value={venue.name}
                onChange={(e) => setVenue({...venue, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{venue.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            {isEditing ? (
              <select
                value={venue.category}
                onChange={(e) => setVenue({...venue, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="restaurant">Restaurant</option>
                <option value="bar">Bar</option>
                <option value="lounge">Lounge</option>
                <option value="club">Club</option>
                <option value="cafe">Café</option>
                <option value="hotel">Hôtel</option>
              </select>
            ) : (
              <p className="text-gray-900">{getCategoryLabel(venue.category)}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            {isEditing ? (
              <textarea
                value={venue.description}
                onChange={(e) => setVenue({...venue, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{venue.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="h-4 w-4 inline mr-1" />
              Adresse
            </label>
            {isEditing ? (
              <input
                type="text"
                value={venue.address}
                onChange={(e) => setVenue({...venue, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{venue.address}, {venue.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <PhoneIcon className="h-4 w-4 inline mr-1" />
              Téléphone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={venue.phone}
                onChange={(e) => setVenue({...venue, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{venue.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={venue.email}
                onChange={(e) => setVenue({...venue, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{venue.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GlobeAltIcon className="h-4 w-4 inline mr-1" />
              Site web
            </label>
            {isEditing ? (
              <input
                type="url"
                value={venue.website}
                onChange={(e) => setVenue({...venue, website: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{venue.website}</p>
            )}
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <ClockIcon className="h-5 w-5 inline mr-2" />
          Horaires d'ouverture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(venue.openingHours).map(([day, hours]) => (
            <div key={day} className="flex justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
              {isEditing ? (
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setVenue({
                    ...venue, 
                    openingHours: {...venue.openingHours, [day]: e.target.value}
                  })}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <span className="text-sm text-gray-900">{hours}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Services and Capacity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Services et capacité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
            {isEditing ? (
              <div className="space-y-2">
                {venue.services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => {
                        const newServices = [...venue.services];
                        newServices[index] = e.target.value;
                        setVenue({...venue, services: newServices});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        const newServices = venue.services.filter((_, i) => i !== index);
                        setVenue({...venue, services: newServices});
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setVenue({...venue, services: [...venue.services, '']})}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Ajouter un service
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {venue.services.map((service, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {service}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacité</label>
            {isEditing ? (
              <input
                type="number"
                value={venue.capacity}
                onChange={(e) => setVenue({...venue, capacity: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{venue.capacity} personnes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
