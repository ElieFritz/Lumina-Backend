'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  UsersIcon, 
  CreditCardIcon,
  BellIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalVenues: number;
  totalEvents: number;
  totalUsers: number;
  totalBookings: number;
  pendingApprovals: number;
  activeIncidents: number;
  revenue: number;
  conversionRate: number;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  actionRequired?: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVenues: 0,
    totalEvents: 0,
    totalUsers: 0,
    totalBookings: 0,
    pendingApprovals: 0,
    activeIncidents: 0,
    revenue: 0,
    conversionRate: 0,
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        totalVenues: 156,
        totalEvents: 89,
        totalUsers: 2847,
        totalBookings: 1243,
        pendingApprovals: 12,
        activeIncidents: 3,
        revenue: 2450000,
        conversionRate: 12.5,
      });

      setAlerts([
        {
          id: '1',
          type: 'warning',
          title: 'Paiement échoué',
          message: '3 réservations avec paiement échoué nécessitent une attention',
          timestamp: '2024-01-15 14:30',
          actionRequired: true,
        },
        {
          id: '2',
          type: 'info',
          title: 'Nouveau lieu en attente',
          message: 'Restaurant "Le Baobab" attend validation',
          timestamp: '2024-01-15 13:45',
          actionRequired: true,
        },
        {
          id: '3',
          type: 'error',
          title: 'Incident technique',
          message: 'Problème de synchronisation avec le système de paiement',
          timestamp: '2024-01-15 12:20',
          actionRequired: true,
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Lieux',
      value: stats.totalVenues,
      icon: BuildingOfficeIcon,
      color: 'blue',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Événements',
      value: stats.totalEvents,
      icon: CalendarDaysIcon,
      color: 'green',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'purple',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Réservations',
      value: stats.totalBookings,
      icon: CreditCardIcon,
      color: 'orange',
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      title: 'En attente',
      value: stats.pendingApprovals,
      icon: ExclamationTriangleIcon,
      color: 'yellow',
      change: '-2',
      changeType: 'negative' as const,
    },
    {
      title: 'Incidents',
      value: stats.activeIncidents,
      icon: ExclamationTriangleIcon,
      color: 'red',
      change: '+1',
      changeType: 'negative' as const,
    },
  ];

  const quickActions = [
    {
      title: 'Gérer les lieux',
      description: 'Valider, modifier ou désactiver les lieux',
      icon: BuildingOfficeIcon,
      href: '/admin/venues',
      color: 'blue',
    },
    {
      title: 'Gérer les événements',
      description: 'Créer, modifier ou publier des événements',
      icon: CalendarDaysIcon,
      href: '/admin/events',
      color: 'green',
    },
    {
      title: 'Gérer les utilisateurs',
      description: 'Vérifier, bloquer ou gérer les comptes',
      icon: UsersIcon,
      href: '/admin/users',
      color: 'purple',
    },
    {
      title: 'Réservations & Paiements',
      description: 'Suivre les transactions et remboursements',
      icon: CreditCardIcon,
      href: '/admin/bookings',
      color: 'orange',
    },
    {
      title: 'Notifications',
      description: 'Créer et envoyer des campagnes',
      icon: BellIcon,
      href: '/admin/notifications',
      color: 'indigo',
    },
    {
      title: 'Support',
      description: 'Gérer les tickets et incidents',
      icon: ExclamationTriangleIcon,
      href: '/admin/support',
      color: 'red',
    },
    {
      title: 'Analytics',
      description: 'Consulter les rapports et métriques',
      icon: ChartBarIcon,
      href: '/admin/analytics',
      color: 'teal',
    },
    {
      title: 'Paramètres',
      description: 'Configuration et sécurité',
      icon: Cog6ToothIcon,
      href: '/admin/settings',
      color: 'gray',
    },
  ];

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
        <p className="mt-2 text-gray-600">
          Vue d'ensemble de la plateforme Lumina Africa
        </p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertes récentes</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'error'
                    ? 'bg-red-50 border-red-400'
                    : alert.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-400'
                    : alert.type === 'success'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                  </div>
                  {alert.actionRequired && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Action requise
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                <p className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} vs mois dernier
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                  <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                </div>
                <h3 className="ml-3 font-medium text-gray-900">{action.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Nouveau lieu "Cinéma Canal Olympia" validé</span>
            </div>
            <span className="text-xs text-gray-500">Il y a 2 heures</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Événement "Concert Youssou N'Dour" publié</span>
            </div>
            <span className="text-xs text-gray-500">Il y a 4 heures</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Paiement échoué pour réservation #EL001ABC123</span>
            </div>
            <span className="text-xs text-gray-500">Il y a 6 heures</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Nouvel utilisateur "Marie Koné" inscrit</span>
            </div>
            <span className="text-xs text-gray-500">Il y a 8 heures</span>
          </div>
        </div>
      </div>
    </div>
  );
}
