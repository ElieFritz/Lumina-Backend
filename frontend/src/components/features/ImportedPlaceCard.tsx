'use client';

import { useState } from 'react';
import { 
  MapPinIcon, 
  StarIcon, 
  ClockIcon, 
  PhoneIcon, 
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon as PendingIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { ClaimPlaceModal } from './ClaimPlaceModal';

interface ImportedPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  categories: string[];
  rating?: number;
  userRatingsTotal?: number;
  status: 'imported' | 'claimed' | 'verified' | 'rejected' | 'pending_verification';
  source: 'google_places' | 'manual' | 'imported';
  importDate: string;
  photoUrls: string[];
  openingHours?: {
    open_now: boolean;
    weekday_text: string[];
  };
}

interface ImportedPlaceCardProps {
  place: ImportedPlace;
  onClaim?: (claimData: any) => Promise<void>;
}

export function ImportedPlaceCard({ place, onClaim }: ImportedPlaceCardProps) {
  const [showClaimModal, setShowClaimModal] = useState(false);

  const getStatusBadge = () => {
    switch (place.status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Vérifié
          </span>
        );
      case 'claimed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <PendingIcon className="w-3 h-3 mr-1" />
            Réclamé
          </span>
        );
      case 'imported':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            Importé
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejeté
          </span>
        );
      default:
        return null;
    }
  };

  const getOpenStatus = () => {
    if (place.openingHours?.open_now !== undefined) {
      return place.openingHours.open_now ? (
        <span className="inline-flex items-center text-xs text-green-600">
          <ClockIcon className="w-3 h-3 mr-1" />
          Ouvert
        </span>
      ) : (
        <span className="inline-flex items-center text-xs text-red-600">
          <ClockIcon className="w-3 h-3 mr-1" />
          Fermé
        </span>
      );
    }
    return null;
  };

  const handleClaim = async (claimData: any) => {
    if (onClaim) {
      await onClaim(claimData);
    }
    setShowClaimModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {place.photoUrls.length > 0 ? (
            <img
              src={place.photoUrls[0]}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-gray-400 text-sm">Aucune photo</span>
            </div>
          )}
          
          {/* Badge de statut */}
          <div className="absolute top-3 left-3">
            {getStatusBadge()}
          </div>

          {/* Badge source */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-700">
              Google Places
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {place.name}
            </h3>
          </div>

          {/* Adresse */}
          <div className="flex items-start space-x-1 mb-3">
            <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-2">{place.address}</p>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-1 mb-3">
            {place.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
              >
                {category}
              </span>
            ))}
            {place.categories.length > 3 && (
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                +{place.categories.length - 3}
              </span>
            )}
          </div>

          {/* Note et statut d'ouverture */}
          <div className="flex items-center justify-between mb-4">
            {place.rating && (
              <div className="flex items-center space-x-1">
                <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">{place.rating}</span>
                <span className="text-sm text-gray-500">({place.userRatingsTotal})</span>
              </div>
            )}
            {getOpenStatus()}
          </div>

          {/* Contact */}
          <div className="space-y-2 mb-4">
            {place.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <span>{place.phone}</span>
              </div>
            )}
            {place.website && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                <span className="truncate">{place.website}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {place.status === 'imported' && onClaim && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClaimModal(true)}
                className="flex-1 text-primary-600 border-primary-600 hover:bg-primary-50"
              >
                Réclamer cet établissement
              </Button>
            )}
            
            {place.status === 'claimed' && (
              <div className="flex-1 text-center">
                <span className="text-sm text-yellow-600 font-medium">
                  En attente de vérification
                </span>
              </div>
            )}

            {place.status === 'verified' && (
              <div className="flex-1 text-center">
                <span className="text-sm text-green-600 font-medium">
                  Vérifié par le propriétaire
                </span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://maps.google.com/?q=${place.lat},${place.lng}`, '_blank')}
            >
              Voir sur Maps
            </Button>
          </div>

          {/* Note sur la source */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Données importées depuis Google Places • {new Date(place.importDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de réclamation */}
      <ClaimPlaceModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        place={place}
        onClaim={handleClaim}
      />
    </>
  );
}
