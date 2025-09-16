'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventName?: string;
  date: string;
  time: string;
  guests: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  specialRequests?: string;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReservations, setSelectedReservations] = useState<string[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const mockReservations: Reservation[] = [
        {
          id: '1',
          customerName: 'Marie Koné',
          customerEmail: 'marie.kone@email.com',
          customerPhone: '+2250701234567',
          eventName: 'Soirée Jazz',
          date: '2024-01-20',
          time: '19:30',
          guests: 4,
          amount: 25000,
          status: 'confirmed',
          paymentStatus: 'paid',
          specialRequests: 'Table près de la scène',
          createdAt: '2024-01-15T10:30:00Z',
          confirmedAt: '2024-01-15T11:00:00Z'
        },
        {
          id: '2',
          customerName: 'Jean Dupont',
          customerEmail: 'jean.dupont@email.com',
          customerPhone: '+2250701234568',
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
          customerPhone: '+2250701234569',
          eventName: 'Anniversaire',
          date: '2024-01-22',
          time: '21:00',
          guests: 6,
          amount: 35000,
          status: 'confirmed',
          paymentStatus: 'paid',
          specialRequests: 'Gâteau d\'anniversaire',
          createdAt: '2024-01-14T16:45:00Z',
          confirmedAt: '2024-01-14T17:00:00Z'
        },
        {
          id: '4',
          customerName: 'Moussa Diop',
          customerEmail: 'moussa.diop@email.com',
          customerPhone: '+2250701234570',
          eventName: 'Soirée Hip-Hop',
          date: '2024-01-19',
          time: '22:00',
          guests: 8,
          amount: 40000,
          status: 'cancelled',
          paymentStatus: 'refunded',
          createdAt: '2024-01-13T09:15:00Z',
          cancelledAt: '2024-01-13T10:00:00Z',
          cancellationReason: 'Changement de plan'
        },
        {
          id: '5',
          customerName: 'Aminata Traoré',
          customerEmail: 'aminata.traore@email.com',
          customerPhone: '+2250701234571',
          eventName: 'Pièce de théâtre',
          date: '2024-01-25',
          time: '19:00',
          guests: 2,
          amount: 20000,
          status: 'completed',
          paymentStatus: 'paid',
          createdAt: '2024-01-12T11:30:00Z',
          confirmedAt: '2024-01-12T12:00:00Z'
        }
      ];
      setReservations(mockReservations);
      setFilteredReservations(mockReservations);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = reservations;

    if (searchQuery) {
      filtered = filtered.filter(reservation =>
        reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reservation.eventName && reservation.eventName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      filtered = filtered.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        switch (dateFilter) {
          case 'today':
            return reservationDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return reservationDate.toDateString() === tomorrow.toDateString();
          case 'week':
            return reservationDate >= today && reservationDate <= nextWeek;
          case 'month':
            return reservationDate.getMonth() === today.getMonth() && reservationDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredReservations(filtered);
  }, [reservations, searchQuery, statusFilter, dateFilter]);

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
    if (selectedReservations.length === filteredReservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(filteredReservations.map(reservation => reservation.id));
    }
  };

  const handleSelectReservation = (reservationId: string) => {
    setSelectedReservations(prev =>
      prev.includes(reservationId)
        ? prev.filter(id => id !== reservationId)
        : [...prev, reservationId]
    );
  };

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const handleConfirmReservation = (reservationId: string) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: 'confirmed' as const, confirmedAt: new Date().toISOString() }
          : reservation
      )
    );
  };

  const handleCancelReservation = (reservationId: string) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: 'cancelled' as const, cancelledAt: new Date().toISOString() }
          : reservation
      )
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on reservations:`, selectedReservations);
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
            Gérez les réservations de votre établissement
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-outline">
            <FunnelIcon className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total réservations</p>
              <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmées</p>
              <p className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reservations.reduce((sum, r) => sum + r.amount, 0))}
              </p>
            </div>
          </div>
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
                placeholder="Nom, email, événement..."
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
              Date
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="tomorrow">Demain</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              className="btn-outline w-full"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReservations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedReservations.length} réservation(s) sélectionnée(s)
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

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReservations.length === filteredReservations.length && filteredReservations.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Événement
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedReservations.includes(reservation.id)}
                      onChange={() => handleSelectReservation(reservation.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                      <div className="text-sm text-gray-500">{reservation.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {reservation.eventName || 'Réservation simple'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{new Date(reservation.date).toLocaleDateString('fr-FR')}</div>
                        <div className="text-sm text-gray-500">{reservation.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{reservation.guests}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(reservation.amount)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getStatusBadge(reservation.status)}
                      {getPaymentStatusBadge(reservation.paymentStatus)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewReservation(reservation)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmReservation(reservation.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="text-red-600 hover:text-red-900"
                          >
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

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-500">Aucune réservation ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Détails de la réservation</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <p className="text-sm text-gray-900">{selectedReservation.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedReservation.customerEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="text-sm text-gray-900">{selectedReservation.customerPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedReservation.date).toLocaleDateString('fr-FR')} à {selectedReservation.time}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invités</label>
                    <p className="text-sm text-gray-900">{selectedReservation.guests} personnes</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Montant</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedReservation.amount)}</p>
                  </div>
                </div>
                
                {selectedReservation.eventName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Événement</label>
                    <p className="text-sm text-gray-900">{selectedReservation.eventName}</p>
                  </div>
                )}
                
                {selectedReservation.specialRequests && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Demandes spéciales</label>
                    <p className="text-sm text-gray-900">{selectedReservation.specialRequests}</p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  {selectedReservation.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleConfirmReservation(selectedReservation.id);
                          setShowModal(false);
                        }}
                        className="btn-primary"
                      >
                        <CheckIcon className="w-4 h-4 mr-2" />
                        Confirmer
                      </button>
                      <button
                        onClick={() => {
                          handleCancelReservation(selectedReservation.id);
                          setShowModal(false);
                        }}
                        className="btn-outline"
                      >
                        <XMarkIcon className="w-4 h-4 mr-2" />
                        Annuler
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}