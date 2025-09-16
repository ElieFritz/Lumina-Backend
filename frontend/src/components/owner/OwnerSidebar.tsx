'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  EyeIcon, 
  CreditCardIcon,
  BellIcon,
  StarIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  DocumentTextIcon,
  CurrencyDollarIcon
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
    href: '/owner',
    icon: HomeIcon,
  },
  {
    name: 'Mon établissement',
    href: '/owner/venue',
    icon: BuildingOfficeIcon,
    children: [
      { name: 'Informations générales', href: '/owner/venue', icon: BuildingOfficeIcon },
      { name: 'Médias & Photos', href: '/owner/venue/media', icon: DocumentTextIcon },
      { name: 'Horaires & Services', href: '/owner/venue/schedule', icon: CalendarDaysIcon },
    ],
  },
  {
    name: 'Événements',
    href: '/owner/events',
    icon: CalendarDaysIcon,
    children: [
      { name: 'Tous les événements', href: '/owner/events', icon: CalendarDaysIcon },
      { name: 'Créer un événement', href: '/owner/events/create', icon: PlusIcon },
      { name: 'Événements récurrents', href: '/owner/events/recurring', icon: CalendarDaysIcon },
    ],
  },
  {
    name: 'Réservations',
    href: '/owner/reservations',
    icon: EyeIcon,
    children: [
      { name: 'Liste des réservations', href: '/owner/reservations', icon: EyeIcon },
      { name: 'Plan de salle', href: '/owner/reservations/floor-plan', icon: BuildingOfficeIcon },
      { name: 'Calendrier', href: '/owner/reservations/calendar', icon: CalendarDaysIcon },
    ],
  },
  {
    name: 'Paiements',
    href: '/owner/payments',
    icon: CreditCardIcon,
    children: [
      { name: 'Transactions', href: '/owner/payments', icon: CreditCardIcon },
      { name: 'Réconciliation', href: '/owner/payments/reconciliation', icon: CurrencyDollarIcon },
      { name: 'Paramètres de versement', href: '/owner/payments/settings', icon: Cog6ToothIcon },
    ],
  },
  {
    name: 'Communication',
    href: '/owner/marketing',
    icon: BellIcon,
    children: [
      { name: 'Campagnes', href: '/owner/marketing/campaigns', icon: BellIcon },
      { name: 'Promotions', href: '/owner/marketing/promotions', icon: BellIcon },
      { name: 'Réseaux sociaux', href: '/owner/marketing/social', icon: BellIcon },
    ],
  },
  {
    name: 'Avis & Réputation',
    href: '/owner/reviews',
    icon: StarIcon,
    children: [
      { name: 'Tous les avis', href: '/owner/reviews', icon: StarIcon },
      { name: 'Réponses', href: '/owner/reviews/responses', icon: StarIcon },
      { name: 'Demandes d\'avis', href: '/owner/reviews/requests', icon: StarIcon },
    ],
  },
  {
    name: 'Staff & Équipe',
    href: '/owner/staff',
    icon: UsersIcon,
    children: [
      { name: 'Gestion du personnel', href: '/owner/staff', icon: UsersIcon },
      { name: 'Planning & Shifts', href: '/owner/staff/schedule', icon: CalendarDaysIcon },
      { name: 'Permissions', href: '/owner/staff/permissions', icon: Cog6ToothIcon },
    ],
  },
  {
    name: 'Support',
    href: '/owner/support',
    icon: ExclamationTriangleIcon,
    children: [
      { name: 'Tickets', href: '/owner/support/tickets', icon: ExclamationTriangleIcon },
      { name: 'Incidents', href: '/owner/support/incidents', icon: ExclamationTriangleIcon },
      { name: 'FAQ', href: '/owner/support/faq', icon: ExclamationTriangleIcon },
    ],
  },
  {
    name: 'Analytics',
    href: '/owner/analytics',
    icon: ChartBarIcon,
    children: [
      { name: 'Rapports', href: '/owner/analytics/reports', icon: ChartBarIcon },
      { name: 'Fidélisation', href: '/owner/analytics/loyalty', icon: StarIcon },
      { name: 'Exports', href: '/owner/analytics/exports', icon: DocumentTextIcon },
    ],
  },
  {
    name: 'Paramètres',
    href: '/owner/settings',
    icon: Cog6ToothIcon,
    children: [
      { name: 'Général', href: '/owner/settings/general', icon: Cog6ToothIcon },
      { name: 'Facturation', href: '/owner/settings/billing', icon: CurrencyDollarIcon },
      { name: 'Conformité', href: '/owner/settings/compliance', icon: DocumentTextIcon },
    ],
  },
];

export function OwnerSidebar() {
  const pathname = usePathname() || '';
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/owner') {
      return pathname === '/owner';
    }
    return pathname.startsWith(href);
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  return (
    <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Mon Établissement</h2>
        <p className="text-sm text-gray-600">Panel propriétaire</p>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <div>
                <button
                  onClick={() => item.children && toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
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
