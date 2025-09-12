'use client';

import { useState, useEffect } from 'react';
import { 
  EyeIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface Reservation {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  guests: number;
  tableNumber?: string;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  specialRequests?: string;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setReservations([
        {
          id: '1',
          bookingNumber: 'EL001ABC123',
          customerName: 'Marie Koné',
          customerEmail: 'marie.kone@example.com',
          customerPhone: '+225 20 30 40 50',
          eventTitle: 'Soirée Jazz au Lounge',
          eventDate: '2024-12-18',
          eventTime: '21:00',
          guests: 4,
          tableNumber: 'T12',
          totalAmount: 60000,
          currency: 'XOF',
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'Mobile Money',
          specialRequests: 'Table près de la scène',
          createdAt: '2024-01-15T10:30:00',
          confirmedAt: '2024-01-15T10:35:00',
        },
        {
          id: '2',
          bookingNumber: 'EL002DEF456',
          customerName: 'Jean Dupont',
          customerEmail: 'jean.dupont@example.com',
          customerPhone: '+225 20 30 40 51',
          eventTitle: 'Happy Hour Spécial',
          eventDate: '2024-12-20',
          eventTime: '17:00',
          guests: 2,
          totalAmount: 0,
          currency: 'XOF',
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'Gratuit',
          createdAt: '2024-01-15T14:20:00',
        },
        {
          id: '3',
          bookingNumber: 'EL003GHI789',
          customerName: 'Fatou Sall',
          customerEmail: 'fatou.sall@example.com',
          customerPhone: '+225 20 30 40 52',
          eventTitle: 'Dîner Romantique',
          eventDate: '2024-12-25',
          eventTime: '19:00',
          guests: 2,
          tableNumber: 'T05',
          totalAmount: 50000,
          currency: 'XOF',
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'Carte bancaire',
          specialRequests: 'Table romantique avec vue',
          createdAt: '2024-01-14T16:45:00',
          confirmedAt: '2024-01-14T16:50:00',
        },
        {
          id: '4',
          bookingNumber: 'EL004JKL012',
          customerName: 'Aminata Traoré',
          customerEmail: 'aminata.traore@example.com',
          customerPhone: '+225 20 30 40 53',
          eventTitle: 'Soirée Jazz au Lounge',
          eventDate: '2024-12-18',
          eventTime: '21:30',
          guests: 6,
          totalAmount: 90000,
          currency: 'XOF',
          status: 'no-show',
          paymentStatus: 'paid',
          paymentMethod: 'Mobile Money',
          createdAt: '2024-01-13T11:15:00',
          confirmedAt: '2024-01-13T11:20:00',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = reservations;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    // Filtre par statut de paiement
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.paymentStatus === paymentFilter);
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(reservation => reservation.eventDate === today);
          break;
        case 'tomorrow':
          filtered = filtered.filter(reservation => reservation.eventDate === tomorrow);
          break;
        case 'this-week':
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          filtered = filtered.filter(reservation => {
            const eventDate = new Date(reservation.eventDate);
            return eventDate >= weekStart && eventDate <= weekEnd;
          });
          break;
      }
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter, paymentFilter, dateFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: 'green', text: 'Confirmé', icon: CheckIcon },
      pending: { color: 'yellow', text: 'En attente', icon: ClockIcon },
      cancelled: { color: 'red', text: 'Annulé', icon: XMarkIcon },
      completed: { color: 'blue', text: 'Terminé', icon: CheckIcon },
      'no-show': { color: 'gray', text: 'No-show', icon: XMarkIcon },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: 'green', text: 'Payé' },
      pending: { color: 'yellow', text: 'En attente' },
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

  const formatCurrency = (amount: number, currency: string) => {
    if (amount === 0) return 'Gratuit';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (reservationId: string, newStatus: string) => {
    setReservations(prev => prev.map(reservation => 
      reservation.id === reservationId 
        ? { 
            ...reservation, 
            status: newStatus as any,
            ...(newStatus === 'confirmed' && !reservation.confirmedAt ? { confirmedAt: new Date().toISOString() } : {}),
            ...(newStatus === 'cancelled' && !reservation.cancelledAt ? { cancelledAt: new Date().toISOString() } : {}),
          }
        : reservation
    ));
  };

  const sendReminder = (reservationId: string) => {
    // Logique d'envoi de rappel
    console.log('Envoi de rappel pour la réservation:', reservationId);
    // Ici, vous feriez un appel API pour envoyer le rappel
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
          <h1 className="text-3xl font-bold text-gray-900">Réservations</h1>
          <p className="mt-2 text-gray-600">
            Gérez les réservations et le plan de salle
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <MapPinIcon className="h-5 w-5 mr-2" />
            Plan de salle
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <CalendarDaysIcon className="h-5 w-5 mr-2" />
            Calendrier
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
              <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.eventDate === new Date().toISOString().split('T')[0]).length}
              </p>
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
            <div className="p-3 rounded-lg bg-red-100">
              <XMarkIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">No-show</p>
              <p className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.status === 'no-show').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une réservation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="cancelled">Annulé</option>
            <option value="completed">Terminé</option>
            <option value="no-show">No-show</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous les paiements</option>
            <option value="paid">Payé</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
            <option value="refunded">Remboursé</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="tomorrow">Demain</option>
            <option value="this-week">Cette semaine</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredReservations.length} réservation{filteredReservations.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réservation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Événement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Heure
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
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.bookingNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDateTime(reservation.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.customerEmail}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.customerPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.eventTitle}
                      </div>
                      {reservation.tableNumber && (
                        <div className="text-sm text-gray-500">
                          Table {reservation.tableNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{formatDate(reservation.eventDate)}</div>
                      <div className="text-gray-500">{reservation.eventTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.guests} personne{reservation.guests > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(reservation.totalAmount, reservation.currency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getPaymentStatusBadge(reservation.paymentStatus)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(reservation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => sendReminder(reservation.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <BellIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Details Modal */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de la réservation
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {selectedReservation.bookingNumber}
                  </h4>
                  <p className="text-gray-600">{selectedReservation.eventTitle}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <p className="text-sm text-gray-900">{selectedReservation.customerName}</p>
                    <p className="text-sm text-gray-600">{selectedReservation.customerEmail}</p>
                    <p className="text-sm text-gray-600">{selectedReservation.customerPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedReservation.status)}</div>
                    <div className="mt-1">{getPaymentStatusBadge(selectedReservation.paymentStatus)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date et heure</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedReservation.eventDate)}</p>
                    <p className="text-sm text-gray-600">{selectedReservation.eventTime}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invités</label>
                    <p className="text-sm text-gray-900">{selectedReservation.guests} personne{selectedReservation.guests > 1 ? 's' : ''}</p>
                    {selectedReservation.tableNumber && (
                      <p className="text-sm text-gray-600">Table {selectedReservation.tableNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Montant</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedReservation.totalAmount, selectedReservation.currency)}</p>
                    <p className="text-sm text-gray-600">{selectedReservation.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Créé le</label>
                    <p className="text-sm text-gray-900">{formatDateTime(selectedReservation.createdAt)}</p>
                    {selectedReservation.confirmedAt && (
                      <p className="text-sm text-gray-600">Confirmé: {formatDateTime(selectedReservation.confirmedAt)}</p>
                    )}
                  </div>
                </div>
                
                {selectedReservation.specialRequests && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Demandes spéciales</label>
                    <p className="text-sm text-gray-900">{selectedReservation.specialRequests}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                {selectedReservation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReservation.id, 'confirmed');
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReservation.id, 'cancelled');
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Annuler
                    </button>
                  </>
                )}
                {selectedReservation.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      sendReminder(selectedReservation.id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Envoyer rappel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
