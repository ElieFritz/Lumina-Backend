'use client';

import { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  CurrencyDollarIcon, 
  StarIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  CreditCardIcon,
  BellIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface OwnerStats {
  todayReservations: number;
  todayRevenue: number;
  averageRating: number;
  totalReviews: number;
  pendingApprovals: number;
  activeEvents: number;
  monthlyRevenue: number;
  conversionRate: number;
}

interface RecentReservation {
  id: string;
  customerName: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
}

interface RecentReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  actionRequired?: boolean;
}

export default function OwnerDashboard() {
  const [stats, setStats] = useState<OwnerStats>({
    todayReservations: 0,
    todayRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    pendingApprovals: 0,
    activeEvents: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
  });

  const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([]);
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        todayReservations: 12,
        todayRevenue: 450000,
        averageRating: 4.3,
        totalReviews: 89,
        pendingApprovals: 3,
        activeEvents: 5,
        monthlyRevenue: 8500000,
        conversionRate: 15.2,
      });

      setRecentReservations([
        {
          id: '1',
          customerName: 'Marie Koné',
          time: '19:30',
          guests: 4,
          status: 'confirmed',
          amount: 25000,
        },
        {
          id: '2',
          customerName: 'Jean Dupont',
          time: '20:00',
          guests: 2,
          status: 'pending',
          amount: 15000,
        },
        {
          id: '3',
          customerName: 'Fatou Sall',
          time: '21:00',
          guests: 6,
          status: 'confirmed',
          amount: 35000,
        },
      ]);

      setRecentReviews([
        {
          id: '1',
          customerName: 'Aminata Traoré',
          rating: 5,
          comment: 'Excellent service et ambiance parfaite !',
          date: '2024-01-14',
        },
        {
          id: '2',
          customerName: 'Moussa Diop',
          rating: 4,
          comment: 'Très bon restaurant, je recommande.',
          date: '2024-01-13',
        },
      ]);

      setAlerts([
        {
          id: '1',
          type: 'warning',
          title: 'Réservation en attente',
          message: '3 réservations nécessitent votre confirmation',
          timestamp: '2024-01-15 14:30',
          actionRequired: true,
        },
        {
          id: '2',
          type: 'info',
          title: 'Nouvel avis',
          message: 'Vous avez reçu un nouvel avis 5 étoiles',
          timestamp: '2024-01-15 13:45',
          actionRequired: false,
        },
        {
          id: '3',
          type: 'error',
          title: 'Paiement échoué',
          message: 'Le paiement de la réservation #EL001ABC123 a échoué',
          timestamp: '2024-01-15 12:20',
          actionRequired: true,
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    {
      title: 'Gérer ma fiche',
      description: 'Modifier les informations de votre établissement',
      icon: BuildingOfficeIcon,
      href: '/owner/venue',
      color: 'blue',
    },
    {
      title: 'Créer un événement',
      description: 'Organiser un nouvel événement',
      icon: PlusIcon,
      href: '/owner/events/create',
      color: 'green',
    },
    {
      title: 'Voir les réservations',
      description: 'Gérer les réservations du jour',
      icon: EyeIcon,
      href: '/owner/reservations',
      color: 'purple',
    },
    {
      title: 'Paiements',
      description: 'Consulter les transactions',
      icon: CreditCardIcon,
      href: '/owner/payments',
      color: 'orange',
    },
    {
      title: 'Communication',
      description: 'Créer des campagnes marketing',
      icon: BellIcon,
      href: '/owner/marketing',
      color: 'indigo',
    },
    {
      title: 'Analytics',
      description: 'Consulter les rapports',
      icon: ChartBarIcon,
      href: '/owner/analytics',
      color: 'teal',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: 'green', text: 'Confirmé' },
      pending: { color: 'yellow', text: 'En attente' },
      cancelled: { color: 'red', text: 'Annulé' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Établissement</h1>
        <p className="mt-2 text-gray-600">
          Vue d'ensemble de votre établissement
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Réservations du jour</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayReservations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CA du jour</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.todayRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</p>
              <p className="text-sm text-gray-500">({stats.totalReviews} avis)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <ExclamationTriangleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <a
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
            </a>
          ))}
        </div>
      </div>

      {/* Recent Reservations and Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Réservations récentes</h2>
          <div className="space-y-3">
            {recentReservations.map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{reservation.customerName}</span>
                    <div className="text-xs text-gray-500">
                      {reservation.time} • {reservation.guests} personnes
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(reservation.amount)}</div>
                  {getStatusBadge(reservation.status)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <a href="/owner/reservations" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Voir toutes les réservations →
            </a>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Avis récents</h2>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="py-2 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{review.customerName}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <a href="/owner/reviews" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Voir tous les avis →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
