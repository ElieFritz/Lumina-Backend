'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon, 
  HeartIcon,
  ShoppingBagIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { UserMenu } from '@/components/ui/UserMenu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const navigation = [
    { name: 'Découvrir', href: '/venues' },
    { name: 'Événements', href: '/events' },
    { name: 'Promotions', href: '/promotions' },
    { name: 'À propos', href: '/about' },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">E</span>
                </div>
                <span className="font-display font-bold text-lg sm:text-xl text-gray-900">
                  Lumina
                </span>
                <span className="text-primary-600 font-medium text-sm sm:text-base">Africa</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 text-sm xl:text-base"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-1 lg:space-x-2"
              >
                <MagnifyingGlassIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden lg:inline">Rechercher</span>
              </Button>

              <ThemeToggle />

              {isAuthenticated ? (
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <Button variant="ghost" size="sm" className="p-2">
                    <HeartIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <ShoppingBagIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  </Button>
                  {(user?.role === 'owner' || user?.role === 'manager') && (
                    <Link href="/owner">
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 lg:space-x-2">
                        <BuildingOfficeIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden lg:inline">Dashboard</span>
                      </Button>
                    </Link>
                  )}
                  <UserMenu user={user} />
                </div>
              ) : (
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-sm">
                      Se connecter
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="primary" size="sm" className="text-sm">
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="p-2"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-5 h-5" />
                ) : (
                  <Bars3Icon className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-3">
                      <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                        <UserIcon className="w-5 h-5" />
                        <span>Mon compte</span>
                      </Link>
                      <Link href="/favorites" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                        <HeartIcon className="w-5 h-5" />
                        <span>Favoris</span>
                      </Link>
                      <Link href="/reservations" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                        <ShoppingBagIcon className="w-5 h-5" />
                        <span>Mes réservations</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Link href="/auth/login">
                        <Button variant="outline" className="w-full">
                          Se connecter
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button variant="primary" className="w-full">
                          S'inscrire
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

    </>
  );
}

