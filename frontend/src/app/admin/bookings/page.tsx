'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  venueName: string;
  eventName?: string;
  date: string;
  time: string;
  guests: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const mockBookings: Booking[] = [
        {
          id: '1',
          customerName: 'Marie Koné',
          customerEmail: 'marie.kone@email.com',
          venueName: 'Le Rooftop Abidjan',
          eventName: 'Soirée Jazz',
          date: '2024-01-20',
          time: '19:30',
          guests: 4,
          amount: 25000,
          status: 'confirmed',
          paymentStatus: 'paid',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          customerName: 'Jean Dupont',
          customerEmail: 'jean.dupont@email.com',
          venueName: 'Cinéma Pathé Cocody',
          date: '2024-01-18',
          time: '20:00',
          guests: 2,
          amount: 15000,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: '2024-01-15T14:20:00Z'
        },
        {
          id: '3',
          customerName: 'Fatou Sall',
          customerEmail: 'fatou.sall@email.com',
          venueName: 'Restaurant Le Bistrot',
          date: '2024-01-22',
          time: '21:00',
          guests: 6,
          amount: 35000,
          status: 'confirmed',
          paymentStatus: 'paid',
          createdAt: '2024-01-14T16:45:00Z'
        },
        {
          id: '4',
          customerName: 'Moussa Diop',
          customerEmail: 'moussa.diop@email.com',
          venueName: 'Club Le VIP',
          eventName: 'Soirée Hip-Hop',
          date: '2024-01-19',
          time: '22:00',
          guests: 8,
          amount: 40000,
          status: 'cancelled',
          paymentStatus: 'refunded',
          createdAt: '2024-01-13T09:15:00Z'
        },
        {
          id: '5',
          customerName: 'Aminata Traoré',
          customerEmail: 'aminata.traore@email.com',
          venueName: 'Théâtre National',
          eventName: 'Pièce de théâtre',
          date: '2024-01-25',
          time: '19:00',
          guests: 2,
          amount: 20000,
          status: 'completed',
          paymentStatus: 'paid',
          createdAt: '2024-01-12T11:30:00Z'
        }
      ];
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.eventName && booking.eventName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchQuery, statusFilter, paymentFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'yellow', text: 'En attente' },
      confirmed: { color: 'green', text: 'Confirmé' },
      cancelled: { color: 'red', text: 'Annulé' },
      completed: { color: 'blue', text: 'Terminé' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'yellow', text: 'En attente' },
      paid: { color: 'green', text: 'Payé' },
      failed: { color: 'red', text: 'Échoué' },
      refunded: { color: 'blue', text: 'Remboursé' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(booking => booking.id));
    }
  };

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on bookings:`, selectedBookings);
    // Implémenter les actions en lot
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des réservations</h1>
          <p className="mt-2 text-gray-600">
            Gérez toutes les réservations de la plateforme
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-outline">
            <FunnelIcon className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, email, établissement..."
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="cancelled">Annulé</option>
              <option value="completed">Terminé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paiement
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="input"
            >
              <option value="all">Tous les paiements</option>
              <option value="pending">En attente</option>
              <option value="paid">Payé</option>
              <option value="failed">Échoué</option>
              <option value="refunded">Remboursé</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPaymentFilter('all');
              }}
              className="btn-outline w-full"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedBookings.length} réservation(s) sélectionnée(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('confirm')}
                className="btn-sm bg-green-600 text-white hover:bg-green-700"
              >
                <CheckIcon className="w-4 h-4 mr-1" />
                Confirmer
              </button>
              <button
                onClick={() => handleBulkAction('cancel')}
                className="btn-sm bg-red-600 text-white hover:bg-red-700"
              >
                <XMarkIcon className="w-4 h-4 mr-1" />
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Établissement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invités
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={() => handleSelectBooking(booking.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.venueName}</div>
                      {booking.eventName && (
                        <div className="text-sm text-gray-500">{booking.eventName}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{new Date(booking.date).toLocaleDateString('fr-FR')}</div>
                        <div className="text-sm text-gray-500">{booking.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{booking.guests}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(booking.amount)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900">
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-500">Aucune réservation ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Précédent
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Suivant
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredBookings.length}</span> sur{' '}
              <span className="font-medium">{filteredBookings.length}</span> résultats
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Précédent
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Suivant
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}