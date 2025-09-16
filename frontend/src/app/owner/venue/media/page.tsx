'use client';

import { useState, useEffect } from 'react';
import { 
  PhotoIcon, 
  PlusIcon, 
  XMarkIcon,
  CloudArrowUpIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description?: string;
  isPrimary: boolean;
  uploadedAt: string;
  size: string;
}

export default function VenueMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    // Simuler le chargement des médias
    setTimeout(() => {
      setMediaItems([
        {
          id: '1',
          type: 'image',
          url: '/images/venue-1.jpg',
          title: 'Vue extérieure',
          description: 'Façade principale du restaurant',
          isPrimary: true,
          uploadedAt: '2024-01-15',
          size: '2.3 MB'
        },
        {
          id: '2',
          type: 'image',
          url: '/images/venue-2.jpg',
          title: 'Salle principale',
          description: 'Vue de la salle de restaurant',
          isPrimary: false,
          uploadedAt: '2024-01-14',
          size: '1.8 MB'
        },
        {
          id: '3',
          type: 'image',
          url: '/images/venue-3.jpg',
          title: 'Terrasse',
          description: 'Espace extérieur avec vue',
          isPrimary: false,
          uploadedAt: '2024-01-13',
          size: '2.1 MB'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    // Logique d'upload
    console.log('Uploading files:', selectedFiles);
    setShowUploadModal(false);
    setSelectedFiles([]);
  };

  const handleDeleteMedia = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSetPrimary = (id: string) => {
    setMediaItems(prev => prev.map(item => ({
      ...item,
      isPrimary: item.id === id
    })));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Médias & Photos</h1>
          <p className="mt-2 text-gray-600">
            Gérez les photos et vidéos de votre établissement
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter des médias
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter des médias</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Cliquez pour sélectionner des fichiers
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    PNG, JPG, MP4 jusqu'à 10MB
                  </span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="sr-only"
                />
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Fichiers sélectionnés:</h4>
                <ul className="text-sm text-gray-600">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Uploader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <PhotoIcon className="w-full h-full text-gray-400" />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                {item.isPrimary && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Principal
                  </span>
                )}
              </div>
              
              {item.description && (
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.size}</span>
                <span>{item.uploadedAt}</span>
              </div>
              
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleSetPrimary(item.id)}
                  disabled={item.isPrimary}
                  className="flex-1 px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded hover:bg-primary-100 disabled:opacity-50"
                >
                  {item.isPrimary ? 'Principal' : 'Définir principal'}
                </button>
                <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded hover:bg-gray-100">
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteMedia(item.id)}
                  className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Conseils pour vos photos</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Utilisez des photos de haute qualité et bien éclairées</li>
          <li>• Montrez différents angles de votre établissement</li>
          <li>• Incluez des photos de vos spécialités culinaires</li>
          <li>• La première photo sera utilisée comme image principale</li>
        </ul>
      </div>
    </div>
  );
}
