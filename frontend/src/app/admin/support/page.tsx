'use client';

import { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  TagIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'account' | 'general' | 'bug';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  messages: {
    id: string;
    content: string;
    sender: 'user' | 'admin';
    senderName: string;
    createdAt: string;
  }[];
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setTickets([
        {
          id: '1',
          ticketNumber: 'SUP001',
          subject: 'Problème de paiement',
          description: 'Je n\'arrive pas à effectuer un paiement pour réserver un événement. L\'erreur indique "Transaction échouée" mais mon compte a été débité.',
          category: 'billing',
          priority: 'high',
          status: 'in_progress',
          user: {
            id: '1',
            name: 'Marie Koné',
            email: 'marie.kone@example.com',
            phone: '+225 07 12 34 56 78',
          },
          assignedTo: {
            id: 'admin1',
            name: 'Admin User',
            email: 'admin@lumina.africa',
          },
          createdAt: '2024-01-15T10:30:00',
          updatedAt: '2024-01-15T14:20:00',
          messages: [
            {
              id: '1',
              content: 'Bonjour, j\'ai un problème avec un paiement...',
              sender: 'user',
              senderName: 'Marie Koné',
              createdAt: '2024-01-15T10:30:00',
            },
            {
              id: '2',
              content: 'Bonjour Marie, je vais examiner votre problème de paiement. Pouvez-vous me fournir le numéro de transaction ?',
              sender: 'admin',
              senderName: 'Admin User',
              createdAt: '2024-01-15T11:15:00',
            },
          ],
        },
        {
          id: '2',
          ticketNumber: 'SUP002',
          subject: 'Compte bloqué',
          description: 'Mon compte a été bloqué sans raison apparente. Je ne peux plus me connecter.',
          category: 'account',
          priority: 'urgent',
          status: 'open',
          user: {
            id: '2',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+225 07 98 76 54 32',
          },
          createdAt: '2024-01-15T14:45:00',
          updatedAt: '2024-01-15T14:45:00',
          messages: [
            {
              id: '3',
              content: 'Mon compte est bloqué, pouvez-vous m\'aider ?',
              sender: 'user',
              senderName: 'John Doe',
              createdAt: '2024-01-15T14:45:00',
            },
          ],
        },
        {
          id: '3',
          ticketNumber: 'SUP003',
          subject: 'Bug dans l\'application',
          description: 'L\'application se ferme automatiquement quand je clique sur "Mes réservations".',
          category: 'bug',
          priority: 'medium',
          status: 'resolved',
          user: {
            id: '3',
            name: 'Fatou Diop',
            email: 'fatou.diop@example.com',
          },
          assignedTo: {
            id: 'admin1',
            name: 'Admin User',
            email: 'admin@lumina.africa',
          },
          createdAt: '2024-01-14T16:20:00',
          updatedAt: '2024-01-15T09:30:00',
          resolvedAt: '2024-01-15T09:30:00',
          messages: [
            {
              id: '4',
              content: 'L\'app se ferme quand je vais dans mes réservations',
              sender: 'user',
              senderName: 'Fatou Diop',
              createdAt: '2024-01-14T16:20:00',
            },
            {
              id: '5',
              content: 'Merci pour le signalement. Le bug a été corrigé dans la version 1.2.3. Veuillez mettre à jour l\'application.',
              sender: 'admin',
              senderName: 'Admin User',
              createdAt: '2024-01-15T09:30:00',
            },
          ],
        },
        {
          id: '4',
          ticketNumber: 'SUP004',
          subject: 'Question sur les tarifs',
          description: 'Comment fonctionnent les tarifs pour les propriétaires de lieux ? Y a-t-il des frais cachés ?',
          category: 'general',
          priority: 'low',
          status: 'closed',
          user: {
            id: '4',
            name: 'Ahmed Traoré',
            email: 'ahmed.traore@example.com',
            phone: '+225 07 55 66 77 88',
          },
          assignedTo: {
            id: 'admin1',
            name: 'Admin User',
            email: 'admin@lumina.africa',
          },
          createdAt: '2024-01-13T11:00:00',
          updatedAt: '2024-01-14T15:45:00',
          resolvedAt: '2024-01-14T15:45:00',
          messages: [
            {
              id: '6',
              content: 'Bonjour, j\'aimerais connaître les tarifs pour les propriétaires...',
              sender: 'user',
              senderName: 'Ahmed Traoré',
              createdAt: '2024-01-13T11:00:00',
            },
            {
              id: '7',
              content: 'Bonjour Ahmed, nos tarifs sont transparents : 5% de commission sur chaque réservation réussie. Aucun frais caché.',
              sender: 'admin',
              senderName: 'Admin User',
              createdAt: '2024-01-14T15:45:00',
            },
          ],
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = tickets;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Filtre par priorité
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'green', text: 'Faible', icon: CheckIcon },
      medium: { color: 'yellow', text: 'Moyenne', icon: ClockIcon },
      high: { color: 'orange', text: 'Élevée', icon: ExclamationTriangleIcon },
      urgent: { color: 'red', text: 'Urgente', icon: ExclamationTriangleIcon },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: 'red', text: 'Ouvert', icon: ExclamationTriangleIcon },
      in_progress: { color: 'yellow', text: 'En cours', icon: ClockIcon },
      resolved: { color: 'green', text: 'Résolu', icon: CheckIcon },
      closed: { color: 'gray', text: 'Fermé', icon: XMarkIcon },
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

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      technical: { color: 'blue', text: 'Technique', icon: DocumentTextIcon },
      billing: { color: 'green', text: 'Facturation', icon: TagIcon },
      account: { color: 'purple', text: 'Compte', icon: UserIcon },
      general: { color: 'gray', text: 'Général', icon: ChatBubbleLeftRightIcon },
      bug: { color: 'red', text: 'Bug', icon: ExclamationTriangleIcon },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig];
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

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { 
        ...ticket, 
        status: newStatus as any,
        updatedAt: new Date().toISOString(),
        resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined
      } : ticket
    ));
  };

  const handleSendMessage = (ticketId: string) => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'admin' as const,
      senderName: 'Admin User',
      createdAt: new Date().toISOString(),
    };

    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            messages: [...ticket.messages, message],
            updatedAt: new Date().toISOString()
          } 
        : ticket
    ));

    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Support Client</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            Gérez les tickets de support et l'assistance client
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 lg:p-3 rounded-lg bg-blue-100">
              <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
            </div>
            <div className="ml-2 sm:ml-3 lg:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{tickets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 lg:p-3 rounded-lg bg-red-100">
              <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-600" />
            </div>
            <div className="ml-2 sm:ml-3 lg:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Ouverts</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 lg:p-3 rounded-lg bg-yellow-100">
              <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600" />
            </div>
            <div className="ml-2 sm:ml-3 lg:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">En cours</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 lg:p-3 rounded-lg bg-green-100">
              <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
            </div>
            <div className="ml-2 sm:ml-3 lg:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Résolus</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un ticket..."
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
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Toutes les priorités</option>
            <option value="urgent">Urgente</option>
            <option value="high">Élevée</option>
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            <option value="technical">Technique</option>
            <option value="billing">Facturation</option>
            <option value="account">Compte</option>
            <option value="general">Général</option>
            <option value="bug">Bug</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredTickets.length} ticket{filteredTickets.length > 1 ? 's' : ''} trouvé{filteredTickets.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigné à
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.ticketNumber}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {ticket.subject}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(ticket.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ticket.user.email}
                      </div>
                      {ticket.user.phone && (
                        <div className="text-xs text-gray-400">
                          {ticket.user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCategoryBadge(ticket.category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(ticket.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.assignedTo ? (
                      <div>
                        <div className="font-medium">{ticket.assignedTo.name}</div>
                        <div className="text-gray-500">{ticket.assignedTo.email}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Non assigné</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {ticket.status === 'open' && (
                        <button
                          onClick={() => handleStatusChange(ticket.id, 'in_progress')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <ClockIcon className="h-4 w-4" />
                        </button>
                      )}
                      {ticket.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusChange(ticket.id, 'resolved')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckIcon className="h-4 w-4" />
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

      {/* Ticket Details Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Ticket {selectedTicket.ticketNumber}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ticket Info */}
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedTicket.subject}
                    </h4>
                    <p className="text-gray-600 mt-2">{selectedTicket.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Statut</label>
                      <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priorité</label>
                      <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                      <div className="mt-1">{getCategoryBadge(selectedTicket.category)}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Utilisateur</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">{selectedTicket.user.name}</p>
                            <p className="text-sm text-gray-600">{selectedTicket.user.email}</p>
                            {selectedTicket.user.phone && (
                              <p className="text-sm text-gray-600">{selectedTicket.user.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assigné à</label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.assignedTo ? selectedTicket.assignedTo.name : 'Non assigné'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Créé le</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedTicket.createdAt)}</p>
                    </div>
                    
                    {selectedTicket.resolvedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Résolu le</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedTicket.resolvedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Messages */}
                <div className="lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h4>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'admin'
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'admin' ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            {message.senderName} - {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* New Message */}
                  {selectedTicket.status !== 'closed' && (
                    <div className="mt-4">
                      <div className="flex space-x-2">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Tapez votre réponse..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          rows={3}
                        />
                        <button
                          onClick={() => handleSendMessage(selectedTicket.id)}
                          disabled={!newMessage.trim()}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Envoyer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                {selectedTicket.status === 'open' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedTicket.id, 'in_progress');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700"
                  >
                    Prendre en charge
                  </button>
                )}
                {selectedTicket.status === 'in_progress' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedTicket.id, 'resolved');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Marquer comme résolu
                  </button>
                )}
                {selectedTicket.status === 'resolved' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedTicket.id, 'closed');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Fermer le ticket
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
