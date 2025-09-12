'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCardIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  bookingNumber: string;
  event: {
    id: string;
    title: string;
    startDate: string;
    venue: {
      name: string;
      city: string;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  tickets: {
    quantity: number;
    type: string;
    price: number;
  }[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'failed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  refundAmount?: number;
  refundReason?: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setBookings([
        {
          id: '1',
          bookingNumber: 'EL001ABC123',
          event: {
            id: '1',
            title: 'Concert Youssou N\'Dour',
            startDate: '2024-12-15T20:00:00',
            venue: { name: 'Restaurant Le Baobab', city: 'Abidjan' },
          },
          user: {
            id: '1',
            name: 'Marie Koné',
            email: 'marie.kone@example.com',
          },
          tickets: [
            { quantity: 2, type: 'Standard', price: 25000 },
          ],
          totalAmount: 50000,
          currency: 'XOF',
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'Mobile Money',
          createdAt: '2024-01-15T10:30:00',
          updatedAt: '2024-01-15T10:35:00',
        },
        {
          id: '2',
          bookingNumber: 'EL002DEF456',
          event: {
            id: '2',
            title: 'Avant-première Black Panther 3',
            startDate: '2024-12-20T19:30:00',
            venue: { name: 'Cinéma Canal Olympia', city: 'Abidjan' },
          },
          user: {
            id: '2',
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
          tickets: [
            { quantity: 1, type: 'VIP', price: 10000 },
          ],
          totalAmount: 10000,
          currency: 'XOF',
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'Carte Bancaire',
          createdAt: '2024-01-15T14:20:00',
          updatedAt: '2024-01-15T14:20:00',
        },
        {
          id: '3',
          bookingNumber: 'EL003GHI789',
          event: {
            id: '3',
            title: 'Soirée Jazz au Lounge',
            startDate: '2024-12-18T21:00:00',
            venue: { name: 'Lounge Sky Bar', city: 'Abidjan' },
          },
          user: {
            id: '3',
            name: 'Admin User',
            email: 'admin@lumina.africa',
          },
          tickets: [
            { quantity: 4, type: 'Standard', price: 15000 },
          ],
          totalAmount: 60000,
          currency: 'XOF',
          status: 'cancelled',
          paymentStatus: 'refunded',
          paymentMethod: 'Mobile Money',
          createdAt: '2024-01-14T16:45:00',
          updatedAt: '2024-01-15T09:30:00',
          refundAmount: 60000,
          refundReason: 'Annulation par l\'utilisateur',
        },
        {
          id: '4',
          bookingNumber: 'EL004JKL012',
          event: {
            id: '1',
            title: 'Concert Youssou N\'Dour',
            startDate: '2024-12-15T20:00:00',
            venue: { name: 'Restaurant Le Baobab', city: 'Abidjan' },
          },
          user: {
            id: '4',
            name: 'Fatou Diop',
            email: 'fatou.diop@example.com',
          },
          tickets: [
            { quantity: 1, type: 'Standard', price: 25000 },
          ],
          totalAmount: 25000,
          currency: 'XOF',
          status: 'failed',
          paymentStatus: 'failed',
          paymentMethod: 'Carte Bancaire',
          createdAt: '2024-01-15T11:15:00',
          updatedAt: '2024-01-15T11:20:00',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filtre par statut de paiement
    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentStatusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, paymentStatusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: 'green', text: 'Confirmé', icon: CheckIcon },
      pending: { color: 'yellow', text: 'En attente', icon: ClockIcon },
      cancelled: { color: 'red', text: 'Annulé', icon: XMarkIcon },
      refunded: { color: 'blue', text: 'Remboursé', icon: CurrencyDollarIcon },
      failed: { color: 'red', text: 'Échoué', icon: ExclamationTriangleIcon },
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
      paid: { color: 'green', text: 'Payé', icon: CheckIcon },
      pending: { color: 'yellow', text: 'En attente', icon: ClockIcon },
      failed: { color: 'red', text: 'Échoué', icon: XMarkIcon },
      refunded: { color: 'blue', text: 'Remboursé', icon: CurrencyDollarIcon },
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : 'EUR',
    }).format(amount);
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus as any } : booking
    ));
  };

  const handlePaymentStatusChange = (bookingId: string, newPaymentStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, paymentStatus: newPaymentStatus as any } : booking
    ));
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
          <p className="mt-2 text-gray-600">
            Suivez et gérez toutes les réservations et paiements
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Réservations</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
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
                {bookings.filter(b => b.status === 'confirmed').length}
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
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Problématiques</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.status === 'failed' || b.paymentStatus === 'failed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option value="confirmed">Confirmé</option>
            <option value="pending">En attente</option>
            <option value="cancelled">Annulé</option>
            <option value="refunded">Remboursé</option>
            <option value="failed">Échoué</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous les paiements</option>
            <option value="paid">Payé</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
            <option value="refunded">Remboursé</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredBookings.length} réservation{filteredBookings.length > 1 ? 's' : ''} trouvée{filteredBookings.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réservation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Événement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billets
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
                    <div className="flex items-center">
                      <CreditCardIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.bookingNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.event.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.event.startDate)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.event.venue.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.tickets.map((ticket, index) => (
                      <div key={index}>
                        {ticket.quantity}x {ticket.type}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">
                        {formatPrice(booking.totalAmount, booking.currency)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.paymentMethod}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XMarkIcon className="h-4 w-4" />
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

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
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
                    {selectedBooking.bookingNumber}
                  </h4>
                  <p className="text-gray-600">Créée le {formatDate(selectedBooking.createdAt)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Paiement</label>
                    <div className="mt-1">{getPaymentStatusBadge(selectedBooking.paymentStatus)}</div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Événement</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedBooking.event.title}</p>
                        <p className="text-sm text-gray-600">{formatDate(selectedBooking.event.startDate)}</p>
                        <div className="flex items-center mt-1">
                          <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-600">{selectedBooking.event.venue.name}, {selectedBooking.event.venue.city}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Utilisateur</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedBooking.user.name}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Billets</label>
                  <div className="mt-1 space-y-2">
                    {selectedBooking.tickets.map((ticket, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">{ticket.quantity}x {ticket.type}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(ticket.price * ticket.quantity, selectedBooking.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Montant total</label>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(selectedBooking.totalAmount, selectedBooking.currency)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Méthode de paiement</label>
                    <p className="text-sm text-gray-900">{selectedBooking.paymentMethod}</p>
                  </div>
                </div>
                
                {selectedBooking.refundAmount && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <label className="block text-sm font-medium text-red-700">Remboursement</label>
                    <p className="text-sm text-red-900">
                      {formatPrice(selectedBooking.refundAmount, selectedBooking.currency)}
                    </p>
                    {selectedBooking.refundReason && (
                      <p className="text-xs text-red-600 mt-1">{selectedBooking.refundReason}</p>
                    )}
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
                {selectedBooking.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'confirmed');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Confirmer
                  </button>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'cancelled');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Annuler
                  </button>
                )}
                {selectedBooking.paymentStatus === 'failed' && (
                  <button
                    onClick={() => {
                      handlePaymentStatusChange(selectedBooking.id, 'pending');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700"
                  >
                    Relancer le paiement
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

