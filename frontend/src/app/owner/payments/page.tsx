'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  CalendarDaysIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface Payment {
  id: string;
  reservationId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer' | 'cash';
  transactionId: string;
  createdAt: string;
  completedAt?: string;
  failedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  failureReason?: string;
  refundReason?: string;
  fees: number;
  netAmount: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const mockPayments: Payment[] = [
        {
          id: '1',
          reservationId: 'RES001',
          customerName: 'Marie Koné',
          customerEmail: 'marie.kone@email.com',
          amount: 25000,
          currency: 'XOF',
          status: 'completed',
          paymentMethod: 'card',
          transactionId: 'TXN_001_ABC123',
          createdAt: '2024-01-15T10:30:00Z',
          completedAt: '2024-01-15T10:32:00Z',
          fees: 750,
          netAmount: 24250
        },
        {
          id: '2',
          reservationId: 'RES002',
          customerName: 'Jean Dupont',
          customerEmail: 'jean.dupont@email.com',
          amount: 15000,
          currency: 'XOF',
          status: 'pending',
          paymentMethod: 'mobile_money',
          transactionId: 'TXN_002_DEF456',
          createdAt: '2024-01-15T14:20:00Z',
          fees: 450,
          netAmount: 14550
        },
        {
          id: '3',
          reservationId: 'RES003',
          customerName: 'Fatou Sall',
          customerEmail: 'fatou.sall@email.com',
          amount: 35000,
          currency: 'XOF',
          status: 'completed',
          paymentMethod: 'mobile_money',
          transactionId: 'TXN_003_GHI789',
          createdAt: '2024-01-14T16:45:00Z',
          completedAt: '2024-01-14T16:47:00Z',
          fees: 1050,
          netAmount: 33950
        },
        {
          id: '4',
          reservationId: 'RES004',
          customerName: 'Moussa Diop',
          customerEmail: 'moussa.diop@email.com',
          amount: 40000,
          currency: 'XOF',
          status: 'refunded',
          paymentMethod: 'card',
          transactionId: 'TXN_004_JKL012',
          createdAt: '2024-01-13T09:15:00Z',
          completedAt: '2024-01-13T09:17:00Z',
          refundedAt: '2024-01-13T10:00:00Z',
          refundAmount: 40000,
          refundReason: 'Annulation de réservation',
          fees: 1200,
          netAmount: 0
        },
        {
          id: '5',
          reservationId: 'RES005',
          customerName: 'Aminata Traoré',
          customerEmail: 'aminata.traore@email.com',
          amount: 20000,
          currency: 'XOF',
          status: 'failed',
          paymentMethod: 'card',
          transactionId: 'TXN_005_MNO345',
          createdAt: '2024-01-12T11:30:00Z',
          failedAt: '2024-01-12T11:32:00Z',
          failureReason: 'Carte expirée',
          fees: 0,
          netAmount: 0
        }
      ];
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = payments;

    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.reservationId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.paymentMethod === methodFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        switch (dateFilter) {
          case 'today':
            return paymentDate.toDateString() === today.toDateString();
          case 'yesterday':
            return paymentDate.toDateString() === yesterday.toDateString();
          case 'week':
            return paymentDate >= lastWeek && paymentDate <= today;
          case 'month':
            return paymentDate >= lastMonth && paymentDate <= today;
          default:
            return true;
        }
      });
    }

    setFilteredPayments(filtered);
  }, [payments, searchQuery, statusFilter, methodFilter, dateFilter]);

  const formatCurrency = (amount: number, currency: string = 'XOF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'yellow', text: 'En attente', icon: ClockIcon },
      completed: { color: 'green', text: 'Terminé', icon: CheckCircleIcon },
      failed: { color: 'red', text: 'Échoué', icon: XCircleIcon },
      refunded: { color: 'blue', text: 'Remboursé', icon: ArrowPathIcon },
      cancelled: { color: 'gray', text: 'Annulé', icon: XCircleIcon },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getMethodBadge = (method: string) => {
    const methodConfig = {
      card: { color: 'blue', text: 'Carte bancaire' },
      mobile_money: { color: 'green', text: 'Mobile Money' },
      bank_transfer: { color: 'purple', text: 'Virement bancaire' },
      cash: { color: 'gray', text: 'Espèces' },
    };

    const config = methodConfig[method as keyof typeof methodConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map(payment => payment.id));
    }
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on payments:`, selectedPayments);
    // Implémenter les actions en lot
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.netAmount, 0);

  const totalFees = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.fees, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedAmount = payments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + (p.refundAmount || 0), 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des paiements</h1>
          <p className="mt-2 text-gray-600">
            Suivez et gérez tous les paiements de votre établissement
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
            <div className="p-3 rounded-lg bg-green-100">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus nets</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
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
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <ArrowPathIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Remboursés</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(refundedAmount)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <CreditCardIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Frais</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalFees)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                placeholder="Client, transaction, réservation..."
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
              <option value="completed">Terminé</option>
              <option value="failed">Échoué</option>
              <option value="refunded">Remboursé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Méthode
            </label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="input"
            >
              <option value="all">Toutes les méthodes</option>
              <option value="card">Carte bancaire</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Virement bancaire</option>
              <option value="cash">Espèces</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input"
            >
              <option value="all">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="yesterday">Hier</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setMethodFilter('all');
                setDateFilter('all');
              }}
              className="btn-outline w-full"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPayments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedPayments.length} paiement(s) sélectionné(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('export')}
                className="btn-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                Exporter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réservation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Méthode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={() => handleSelectPayment(payment.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                      <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.reservationId}</div>
                    <div className="text-sm text-gray-500">{payment.transactionId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                      {payment.status === 'completed' && (
                        <div className="text-xs text-gray-500">
                          Net: {formatCurrency(payment.netAmount, payment.currency)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getMethodBadge(payment.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCardIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun paiement trouvé</h3>
            <p className="text-gray-500">Aucun paiement ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé des paiements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Paiements réussis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">En attente</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {payments.filter(p => p.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-600">Échoués</div>
          </div>
        </div>
      </div>
    </div>
  );
}