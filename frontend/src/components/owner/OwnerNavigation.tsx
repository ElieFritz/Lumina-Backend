'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  HomeIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export function OwnerNavigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleBackToUser = () => {
    setIsNavigating(true);
    // Attendre un peu pour éviter les conflits de navigation
    setTimeout(() => {
      router.push('/dashboard');
    }, 100);
  };

  const handleLogout = () => {
    setIsNavigating(true);
    logout();
  };

  // Réinitialiser l'état de navigation quand on change de page
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  if (isNavigating) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToUser}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour au dashboard utilisateur
          </button>
          
          <div className="flex items-center text-sm text-gray-600">
            <BuildingOfficeIcon className="h-4 w-4 mr-2" />
            <span>Mode Propriétaire</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Connecté en tant que <span className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
