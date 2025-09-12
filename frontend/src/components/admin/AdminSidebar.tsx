'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';
import { 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  UsersIcon, 
  CreditCardIcon,
  BellIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  HomeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloudArrowDownIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: HomeIcon,
  },
  {
    name: 'Lieux',
    href: '/admin/venues',
    icon: BuildingOfficeIcon,
    children: [
      { name: 'Tous les lieux', href: '/admin/venues', icon: BuildingOfficeIcon },
      { name: 'En attente', href: '/admin/venues/pending', icon: ExclamationTriangleIcon },
      { name: 'Créer un lieu', href: '/admin/venues/create', icon: BuildingOfficeIcon },
    ],
  },
  {
    name: 'Import Google Places',
    href: '/admin/places-import',
    icon: CloudArrowDownIcon,
    children: [
      { name: 'Importer', href: '/admin/places-import', icon: CloudArrowDownIcon },
      { name: 'Établissements', href: '/admin/places-import/places', icon: MapPinIcon },
    ],
  },
  {
    name: 'Événements',
    href: '/admin/events',
    icon: CalendarDaysIcon,
    children: [
      { name: 'Tous les événements', href: '/admin/events', icon: CalendarDaysIcon },
      { name: 'Brouillons', href: '/admin/events/drafts', icon: CalendarDaysIcon },
      { name: 'Créer un événement', href: '/admin/events/create', icon: CalendarDaysIcon },
    ],
  },
  {
    name: 'Utilisateurs',
    href: '/admin/users',
    icon: UsersIcon,
    children: [
      { name: 'Tous les utilisateurs', href: '/admin/users', icon: UsersIcon },
      { name: 'En attente de vérification', href: '/admin/users/pending', icon: ExclamationTriangleIcon },
      { name: 'Organisateurs', href: '/admin/users/organizers', icon: UsersIcon },
    ],
  },
  {
    name: 'Réservations',
    href: '/admin/bookings',
    icon: CreditCardIcon,
    children: [
      { name: 'Toutes les réservations', href: '/admin/bookings', icon: CreditCardIcon },
      { name: 'Paiements échoués', href: '/admin/bookings/failed', icon: ExclamationTriangleIcon },
      { name: 'Remboursements', href: '/admin/bookings/refunds', icon: CreditCardIcon },
    ],
  },
  {
    name: 'Notifications',
    href: '/admin/notifications',
    icon: BellIcon,
    children: [
      { name: 'Campagnes', href: '/admin/notifications/campaigns', icon: BellIcon },
      { name: 'Templates', href: '/admin/notifications/templates', icon: BellIcon },
      { name: 'Historique', href: '/admin/notifications/history', icon: BellIcon },
    ],
  },
  {
    name: 'Support',
    href: '/admin/support',
    icon: ExclamationTriangleIcon,
    children: [
      { name: 'Tickets', href: '/admin/support/tickets', icon: ExclamationTriangleIcon },
      { name: 'Incidents', href: '/admin/support/incidents', icon: ExclamationTriangleIcon },
      { name: 'FAQ', href: '/admin/support/faq', icon: ExclamationTriangleIcon },
    ],
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: ChartBarIcon,
    children: [
      { name: 'Rapports', href: '/admin/analytics/reports', icon: ChartBarIcon },
      { name: 'Métriques', href: '/admin/analytics/metrics', icon: ChartBarIcon },
      { name: 'Exports', href: '/admin/analytics/exports', icon: ChartBarIcon },
    ],
  },
  {
    name: 'Paramètres',
    href: '/admin/settings',
    icon: Cog6ToothIcon,
    children: [
      { name: 'Général', href: '/admin/settings/general', icon: Cog6ToothIcon },
      { name: 'Sécurité', href: '/admin/settings/security', icon: Cog6ToothIcon },
      { name: 'Intégrations', href: '/admin/settings/integrations', icon: Cog6ToothIcon },
      { name: 'Logs audit', href: '/admin/settings/audit-logs', icon: Cog6ToothIcon },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isCurrentRoute } = useAdminNavigation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand les sections qui contiennent la page active
  useEffect(() => {
    const activeSection = menuItems.find(item => {
      if (item.href === pathname) return true;
      if (item.children) {
        return item.children.some(child => child.href === pathname);
      }
      return false;
    });
    
    if (activeSection && activeSection.children) {
      setExpandedItems(prev => 
        prev.includes(activeSection.name) 
          ? prev 
          : [...prev, activeSection.name]
      );
    }
  }, [pathname]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    return isCurrentRoute(href);
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  return (
    <div className="w-full lg:w-64 bg-white shadow-lg h-auto lg:h-screen overflow-y-auto">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Lumina Admin</h2>
        <p className="text-xs sm:text-sm text-gray-600">Panel d'administration</p>
      </div>
      
      <nav className="px-2 sm:px-4 pb-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <div>
                <button
                  onClick={() => item.children && toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.children && (
                    isExpanded(item.name) ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )
                  )}
                </button>
                
                {item.children && isExpanded(item.name) && (
                  <ul className="mt-1 ml-8 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          href={child.href}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive(child.href)
                              ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-500'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
