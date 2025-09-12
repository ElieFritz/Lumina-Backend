'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/auth';
import { 
  UserIcon, 
  Cog6ToothIcon, 
  HeartIcon, 
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface UserMenuProps {
  user: User | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.firstName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-medium text-sm">
              {user.firstName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <span className="hidden md:block text-gray-700 font-medium">
          {user.firstName || 'Utilisateur'}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName || ''} {user.lastName || ''}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            {/* Menu Items */}
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="w-4 h-4 mr-3" />
              Mon profil
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Cog6ToothIcon className="w-4 h-4 mr-3" />
              Paramètres
            </Link>

            <Link
              href="/favorites"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <HeartIcon className="w-4 h-4 mr-3" />
              Favoris
            </Link>

            <Link
              href="/reservations"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBagIcon className="w-4 h-4 mr-3" />
              Mes réservations
            </Link>

            {/* Venue Owner/Organizer specific links */}
            {user.role === 'venue_owner' && (
              <>
                <div className="border-t border-gray-100 my-1" />
                <Link
                  href="/dashboard/venues"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="w-4 h-4 mr-3">🏢</span>
                  Mes établissements
                </Link>
              </>
            )}

            {user.role === 'organizer' && (
              <>
                <div className="border-t border-gray-100 my-1" />
                <Link
                  href="/dashboard/events"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="w-4 h-4 mr-3">🎉</span>
                  Mes événements
                </Link>
              </>
            )}

            {/* Admin specific links */}
            {user.role === 'admin' && (
              <>
                <div className="border-t border-gray-100 my-1" />
                <Link
                  href="/admin"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="w-4 h-4 mr-3">⚙️</span>
                  Administration
                </Link>
              </>
            )}

            {/* Logout */}
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

