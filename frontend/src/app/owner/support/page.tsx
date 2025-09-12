'use client';

import { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  BellIcon,
  UserIcon,
  CalendarDaysIcon,
  TagIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'service' | 'complaint' | 'feature_request';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  messages: TicketMessage[];
  tags: string[];
}

interface TicketMessage {
  id: string;
  sender: 'customer' | 'staff' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showNewTicket, setShowNewTicket] = useState(false);

  // Données de test
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: '1',
        title: 'Problème de paiement en ligne',
        description: 'Le client n\'arrive pas à finaliser sa réservation. Le paiement est rejeté à chaque tentative.',
        priority: 'high',
        status: 'in_progress',
        category: 'technical',
        customerName: 'Fatou Diallo',
        customerEmail: 'fatou.diallo@email.com',
        customerPhone: '+225 07 12 34 56 78',
        assignedTo: 'Aminata Traoré',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T14:20:00Z',
        tags: ['paiement', 'réservation', 'urgent'],
        messages: [
          {
            id: '1',
            sender: 'customer',
            senderName: 'Fatou Diallo',
            message: 'Bonjour, j\'essaie de réserver une table pour ce soir mais le paiement ne fonctionne pas. Pouvez-vous m\'aider ?',
            timestamp: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            sender: 'staff',
            senderName: 'Aminata Traoré',
            message: 'Bonjour Fatou, je vais vérifier votre problème de paiement. Pouvez-vous me dire quel message d\'erreur vous obtenez exactement ?',
            timestamp: '2024-01-15T11:15:00Z'
          },
          {
            id: '3',
            sender: 'customer',
            senderName: 'Fatou Diallo',
            message: 'Le message dit "Transaction échouée - Code d\'erreur 5001". J\'ai essayé avec deux cartes différentes.',
            timestamp: '2024-01-15T11:45:00Z'
          }
        ]
      },
      {
        id: '2',
        title: 'Demande de remboursement',
        description: 'Le client demande un remboursement pour une réservation annulée à la dernière minute.',
        priority: 'medium',
        status: 'open',
        category: 'billing',
        customerName: 'Moussa Traoré',
        customerEmail: 'moussa.traore@email.com',
        customerPhone: '+225 07 23 45 67 89',
        createdAt: '2024-01-15T09:15:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
        tags: ['remboursement', 'annulation'],
        messages: [
          {
            id: '1',
            sender: 'customer',
            senderName: 'Moussa Traoré',
            message: 'Bonjour, j\'ai dû annuler ma réservation d\'hier soir à cause d\'une urgence familiale. Puis-je obtenir un remboursement ?',
            timestamp: '2024-01-15T09:15:00Z'
          }
        ]
      },
      {
        id: '3',
        title: 'Service client décevant',
        description: 'Le client se plaint du service reçu lors de sa visite hier soir.',
        priority: 'high',
        status: 'resolved',
        category: 'complaint',
        customerName: 'Aminata Koné',
        customerEmail: 'aminata.kone@email.com',
        customerPhone: '+225 07 34 56 78 90',
        assignedTo: 'Aminata Traoré',
        createdAt: '2024-01-14T20:30:00Z',
        updatedAt: '2024-01-15T16:45:00Z',
        resolvedAt: '2024-01-15T16:45:00Z',
        tags: ['service', 'plainte', 'résolu'],
        messages: [
          {
            id: '1',
            sender: 'customer',
            senderName: 'Aminata Koné',
            message: 'Bonjour, j\'ai été très déçue par le service reçu hier soir. Le serveur était impoli et la nourriture était froide.',
            timestamp: '2024-01-14T20:30:00Z'
          },
          {
            id: '2',
            sender: 'staff',
            senderName: 'Aminata Traoré',
            message: 'Bonjour Aminata, je suis désolée pour votre expérience. Je vais enquêter sur cette situation et vous recontacter rapidement.',
            timestamp: '2024-01-15T08:00:00Z'
          },
          {
            id: '3',
            sender: 'staff',
            senderName: 'Aminata Traoré',
            message: 'Aminata, j\'ai parlé avec l\'équipe et nous vous offrons un repas gratuit pour vous excuser. Pouvez-vous nous contacter pour organiser cela ?',
            timestamp: '2024-01-15T16:45:00Z'
          }
        ]
      },
      {
        id: '4',
        title: 'Suggestion d\'amélioration',
        description: 'Le client suggère d\'ajouter plus d\'options végétariennes au menu.',
        priority: 'low',
        status: 'open',
        category: 'feature_request',
        customerName: 'Ibrahim Ouattara',
        customerEmail: 'ibrahim.ouattara@email.com',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
        tags: ['menu', 'végétarien', 'suggestion'],
        messages: [
          {
            id: '1',
            sender: 'customer',
            senderName: 'Ibrahim Ouattara',
            message: 'Bonjour, j\'aimerais suggérer d\'ajouter plus d\'options végétariennes à votre menu. C\'est un excellent restaurant !',
            timestamp: '2024-01-15T12:00:00Z'
          }
        ]
      }
    ];

    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
  }, []);

  // Filtrage des tickets
  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status: newStatus as any,
            updatedAt: new Date().toISOString(),
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined
          } 
        : ticket
    ));
  };

  const sendMessage = () => {
    if (selectedTicket && newMessage.trim()) {
      const message: TicketMessage = {
        id: Date.now().toString(),
        sender: 'staff',
        senderName: 'Vous',
        message: newMessage.trim(),
        timestamp: new Date().toISOString()
      };

      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              messages: [...ticket.messages, message],
              updatedAt: new Date().toISOString()
            } 
          : ticket
      ));

      setNewMessage('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'billing': return 'bg-blue-100 text-blue-800';
      case 'service': return 'bg-green-100 text-green-800';
      case 'complaint': return 'bg-red-100 text-red-800';
      case 'feature_request': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support & Incidents</h1>
          <p className="text-gray-600">Gérez les tickets de support et les incidents clients</p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="btn-primary"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nouveau ticket
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ouverts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Résolus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <BellIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par titre, client ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouverts</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolus</option>
              <option value="closed">Fermés</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Toutes les priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des tickets */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Tickets ({filteredTickets.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedTicket?.id === ticket.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {ticket.title}
                    </h3>
                    <div className="flex space-x-1 ml-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority === 'urgent' ? 'Urgent' :
                         ticket.priority === 'high' ? 'Élevée' :
                         ticket.priority === 'medium' ? 'Moyenne' : 'Faible'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{ticket.customerName}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' ? 'Ouvert' :
                       ticket.status === 'in_progress' ? 'En cours' :
                       ticket.status === 'resolved' ? 'Résolu' : 'Fermé'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {ticket.messages.length} message{ticket.messages.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Détails du ticket */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Header du ticket */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedTicket.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Par {selectedTicket.customerName}</span>
                      <span>•</span>
                      <span>{new Date(selectedTicket.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="open">Ouvert</option>
                      <option value="in_progress">En cours</option>
                      <option value="resolved">Résolu</option>
                      <option value="closed">Fermé</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority === 'urgent' ? 'Urgent' :
                     selectedTicket.priority === 'high' ? 'Élevée' :
                     selectedTicket.priority === 'medium' ? 'Moyenne' : 'Faible'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedTicket.category)}`}>
                    {selectedTicket.category === 'technical' ? 'Technique' :
                     selectedTicket.category === 'billing' ? 'Facturation' :
                     selectedTicket.category === 'service' ? 'Service' :
                     selectedTicket.category === 'complaint' ? 'Plainte' : 'Suggestion'}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{selectedTicket.description}</p>

                <div className="flex flex-wrap gap-2">
                  {selectedTicket.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Conversation ({selectedTicket.messages.length})
                </h3>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'staff'
                            ? 'bg-primary-600 text-white'
                            : message.sender === 'system'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'staff' ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          {message.senderName} • {new Date(message.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Nouveau message */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex space-x-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre réponse..."
                      rows={3}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un ticket</h3>
              <p className="text-gray-600">Choisissez un ticket dans la liste pour voir les détails et répondre.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
