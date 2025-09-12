'use client';

import { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  transactionId: string;
  bookingNumber: string;
  customerName: string;
  eventTitle: string;
  amount: number;
  currency: string;
  paymentMethod: 'mobile_money' | 'card' | 'bank_transfer' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  commission: number;
  netAmount: number;
  transactionDate: string;
  processedDate?: string;
  failureReason?: string;
  refundReason?: string;
}

interface PaymentStats {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  pendingAmount: number;
  failedAmount: number;
  refundedAmount: number;
  transactionCount: number;
}

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    totalCommission: 0,
    netRevenue: 0,
    pendingAmount: 0,
    failedAmount: 0,
    refundedAmount: 0,
    transactionCount: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          transactionId: 'TXN001ABC123',
          bookingNumber: 'EL001ABC123',
          customerName: 'Marie Koné',
          eventTitle: 'Soirée Jazz au Lounge',
          amount: 60000,
          currency: 'XOF',
          paymentMethod: 'mobile_money',
          status: 'completed',
          commission: 3000,
          netAmount: 57000,
          transactionDate: '2024-01-15T10:30:00',
          processedDate: '2024-01-15T10:35:00',
        },
        {
          id: '2',
          transactionId: 'TXN002DEF456',
          bookingNumber: 'EL002DEF456',
          customerName: 'Jean Dupont',
          eventTitle: 'Happy Hour Spécial',
          amount: 0,
          currency: 'XOF',
          paymentMethod: 'cash',
          status: 'completed',
          commission: 0,
          netAmount: 0,
          transactionDate: '2024-01-15T14:20:00',
          processedDate: '2024-01-15T14:25:00',
        },
        {
          id: '3',
          transactionId: 'TXN003GHI789',
          bookingNumber: 'EL003GHI789',
          customerName: 'Fatou Sall',
          eventTitle: 'Dîner Romantique',
          amount: 50000,
          currency: 'XOF',
          paymentMethod: 'card',
          status: 'completed',
          commission: 2500,
          netAmount: 47500,
          transactionDate: '2024-01-14T16:45:00',
          processedDate: '2024-01-14T16:50:00',
        },
        {
          id: '4',
          transactionId: 'TXN004JKL012',
          bookingNumber: 'EL004JKL012',
          customerName: 'Aminata Traoré',
          eventTitle: 'Soirée Jazz au Lounge',
          amount: 90000,
          currency: 'XOF',
          paymentMethod: 'mobile_money',
          status: 'failed',
          commission: 0,
          netAmount: 0,
          transactionDate: '2024-01-13T11:15:00',
          failureReason: 'Solde insuffisant',
        },
        {
          id: '5',
          transactionId: 'TXN005MNO345',
          bookingNumber: 'EL005MNO345',
          customerName: 'Moussa Diop',
          eventTitle: 'Concert Live',
          amount: 75000,
          currency: 'XOF',
          paymentMethod: 'card',
          status: 'refunded',
          commission: 0,
          netAmount: 0,
          transactionDate: '2024-01-12T20:00:00',
          processedDate: '2024-01-12T20:05:00',
          refundReason: 'Annulation par le client',
        },
        {
          id: '6',
          transactionId: 'TXN006PQR678',
          bookingNumber: 'EL006PQR678',
          customerName: 'Khadija Ba',
          eventTitle: 'Soirée Jazz au Lounge',
          amount: 45000,
          currency: 'XOF',
          paymentMethod: 'mobile_money',
          status: 'pending',
          commission: 2250,
          netAmount: 42750,
          transactionDate: '2024-01-15T18:30:00',
        },
      ];

      setTransactions(mockTransactions);

      // Calculer les statistiques
      const totalRevenue = mockTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalCommission = mockTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.commission, 0);
      
      const netRevenue = totalRevenue - totalCommission;
      
      const pendingAmount = mockTransactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const failedAmount = mockTransactions
        .filter(t => t.status === 'failed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const refundedAmount = mockTransactions
        .filter(t => t.status === 'refunded')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalRevenue,
        totalCommission,
        netRevenue,
        pendingAmount,
        failedAmount,
        refundedAmount,
        transactionCount: mockTransactions.length,
      });

      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    // Filtre par méthode de paiement
    if (methodFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.paymentMethod === methodFilter);
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(transaction => transaction.transactionDate.startsWith(today));
          break;
        case 'yesterday':
          filtered = filtered.filter(transaction => transaction.transactionDate.startsWith(yesterday));
          break;
        case 'this-week':
          filtered = filtered.filter(transaction => transaction.transactionDate >= weekAgo);
          break;
      }
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter, methodFilter, dateFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'green', text: 'Terminé', icon: CheckIcon },
      pending: { color: 'yellow', text: 'En attente', icon: ClockIcon },
      failed: { color: 'red', text: 'Échoué', icon: XMarkIcon },
      refunded: { color: 'blue', text: 'Remboursé', icon: ArrowDownTrayIcon },
      cancelled: { color: 'gray', text: 'Annulé', icon: XMarkIcon },
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

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      mobile_money: DevicePhoneMobileIcon,
      card: CreditCardIcon,
      bank_transfer: BanknotesIcon,
      cash: CurrencyDollarIcon,
    };
    return icons[method as keyof typeof icons] || CurrencyDollarIcon;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      mobile_money: 'Mobile Money',
      card: 'Carte bancaire',
      bank_transfer: 'Virement bancaire',
      cash: 'Espèces',
    };
    return labels[method as keyof typeof labels] || method;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : 'EUR',
    }).format(amount);
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

  const handleRefund = (transactionId: string) => {
    // Logique de remboursement
    console.log('Remboursement pour la transaction:', transactionId);
    // Ici, vous feriez un appel API pour initier le remboursement
  };

  const handleRetry = (transactionId: string) => {
    // Logique de retry
    console.log('Retry pour la transaction:', transactionId);
    // Ici, vous feriez un appel API pour retenter le paiement
  };

  const exportTransactions = () => {
    // Logique d'export
    console.log('Export des transactions');
    // Ici, vous généreriez un fichier CSV ou PDF
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
          <h1 className="text-3xl font-bold text-gray-900">Paiements</h1>
          <p className="mt-2 text-gray-600">
            Gérez les transactions et la réconciliation
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportTransactions}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Exporter
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Réconciliation
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue, 'XOF')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus nets</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.netRevenue, 'XOF')}</p>
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
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingAmount, 'XOF')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Échoués</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.failedAmount, 'XOF')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Commissions Lumina</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Commission totale</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalCommission, 'XOF')}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Taux de commission</p>
            <p className="text-xl font-bold text-gray-900">5%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Nombre de transactions</p>
            <p className="text-xl font-bold text-gray-900">{stats.transactionCount}</p>
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
              placeholder="Rechercher une transaction..."
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
            <option value="completed">Terminé</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
            <option value="refunded">Remboursé</option>
            <option value="cancelled">Annulé</option>
          </select>

          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Toutes les méthodes</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="card">Carte bancaire</option>
            <option value="bank_transfer">Virement bancaire</option>
            <option value="cash">Espèces</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="yesterday">Hier</option>
            <option value="this-week">Cette semaine</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Événement
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
              {filteredTransactions.map((transaction) => {
                const PaymentMethodIcon = getPaymentMethodIcon(transaction.paymentMethod);
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.transactionId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.bookingNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.eventTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                        {transaction.commission > 0 && (
                          <div className="text-xs text-gray-500">
                            Commission: {formatCurrency(transaction.commission, transaction.currency)}
                          </div>
                        )}
                        {transaction.netAmount > 0 && (
                          <div className="text-xs text-green-600">
                            Net: {formatCurrency(transaction.netAmount, transaction.currency)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <PaymentMethodIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {getPaymentMethodLabel(transaction.paymentMethod)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(transaction.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {transaction.status === 'failed' && (
                          <button
                            onClick={() => handleRetry(transaction.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        {transaction.status === 'completed' && (
                          <button
                            onClick={() => handleRefund(transaction.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de la transaction
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
                    {selectedTransaction.transactionId}
                  </h4>
                  <p className="text-gray-600">{selectedTransaction.bookingNumber}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Événement</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.eventTitle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Montant</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Méthode de paiement</label>
                    <p className="text-sm text-gray-900">{getPaymentMethodLabel(selectedTransaction.paymentMethod)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Commission</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedTransaction.commission, selectedTransaction.currency)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Montant net</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedTransaction.netAmount, selectedTransaction.currency)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de transaction</label>
                    <p className="text-sm text-gray-900">{formatDateTime(selectedTransaction.transactionDate)}</p>
                  </div>
                </div>
                
                {selectedTransaction.processedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de traitement</label>
                    <p className="text-sm text-gray-900">{formatDateTime(selectedTransaction.processedDate)}</p>
                  </div>
                )}
                
                {selectedTransaction.failureReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Raison de l'échec</label>
                    <p className="text-sm text-red-600">{selectedTransaction.failureReason}</p>
                  </div>
                )}
                
                {selectedTransaction.refundReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Raison du remboursement</label>
                    <p className="text-sm text-blue-600">{selectedTransaction.refundReason}</p>
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
                {selectedTransaction.status === 'failed' && (
                  <button
                    onClick={() => {
                      handleRetry(selectedTransaction.id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Retenter le paiement
                  </button>
                )}
                {selectedTransaction.status === 'completed' && (
                  <button
                    onClick={() => {
                      handleRefund(selectedTransaction.id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Rembourser
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
