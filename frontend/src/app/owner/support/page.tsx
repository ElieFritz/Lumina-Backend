'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarDaysIcon,
  TagIcon,
  EyeIcon,
  ReplyIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  messages: Array<{
  id: string;
    sender: 'user' | 'support';
  message: string;
  timestamp: string;
  attachments?: string[];
  }>;
  assignedTo?: string;
  tags: string[];
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'technical' as const,
    priority: 'medium' as const
  });

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const mockTickets: SupportTicket[] = [
      {
        id: '1',
          title: 'Problème de paiement avec Mobile Money',
          description: 'Les paiements Mobile Money ne sont pas traités correctement depuis hier.',
          category: 'billing',
        priority: 'high',
          status: 'open',
        createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          lastMessageAt: '2024-01-15T10:30:00Z',
        messages: [
          {
            id: '1',
              sender: 'user',
              message: 'Bonjour, j\'ai un problème avec les paiements Mobile Money. Les transactions ne sont pas traitées.',
            timestamp: '2024-01-15T10:30:00Z'
            }
          ],
          tags: ['paiement', 'mobile-money']
      },
      {
        id: '2',
          title: 'Demande de fonctionnalité : notifications push',
          description: 'Serait-il possible d\'ajouter des notifications push pour les nouvelles réservations ?',
          category: 'feature',
        priority: 'medium',
          status: 'in_progress',
          createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
          lastMessageAt: '2024-01-15T09:15:00Z',
        messages: [
          {
            id: '1',
              sender: 'user',
              message: 'Bonjour, j\'aimerais savoir s\'il est possible d\'ajouter des notifications push pour les nouvelles réservations.',
              timestamp: '2024-01-14T14:20:00Z'
            },
            {
              id: '2',
              sender: 'support',
              message: 'Bonjour ! C\'est une excellente idée. Nous étudions cette fonctionnalité et elle devrait être disponible dans la prochaine mise à jour.',
            timestamp: '2024-01-15T09:15:00Z'
          }
          ],
          assignedTo: 'Support Team',
          tags: ['fonctionnalité', 'notifications']
      },
      {
        id: '3',
          title: 'Bug : Affichage des images sur mobile',
          description: 'Les images des établissements ne s\'affichent pas correctement sur les appareils mobiles.',
          category: 'bug',
          priority: 'medium',
        status: 'resolved',
          createdAt: '2024-01-13T16:45:00Z',
          updatedAt: '2024-01-14T11:30:00Z',
          lastMessageAt: '2024-01-14T11:30:00Z',
        messages: [
          {
            id: '1',
              sender: 'user',
              message: 'Les images des établissements ne s\'affichent pas correctement sur mon téléphone.',
              timestamp: '2024-01-13T16:45:00Z'
          },
          {
            id: '2',
              sender: 'support',
              message: 'Nous avons identifié le problème et l\'avons corrigé. Pouvez-vous vérifier maintenant ?',
              timestamp: '2024-01-14T11:30:00Z'
            }
          ],
          assignedTo: 'Dev Team',
          tags: ['bug', 'mobile', 'images']
      },
      {
        id: '4',
          title: 'Question sur les frais de commission',
          description: 'Comment sont calculés les frais de commission sur les réservations ?',
          category: 'billing',
        priority: 'low',
          status: 'closed',
          createdAt: '2024-01-12T11:30:00Z',
          updatedAt: '2024-01-13T08:45:00Z',
          lastMessageAt: '2024-01-13T08:45:00Z',
        messages: [
          {
            id: '1',
              sender: 'user',
              message: 'Bonjour, pouvez-vous m\'expliquer comment sont calculés les frais de commission ?',
              timestamp: '2024-01-12T11:30:00Z'
            },
            {
              id: '2',
              sender: 'support',
              message: 'Les frais de commission sont de 3% sur chaque réservation réussie. Vous pouvez voir le détail dans votre tableau de bord.',
              timestamp: '2024-01-13T08:45:00Z'
            }
          ],
          assignedTo: 'Billing Team',
          tags: ['commission', 'frais']
        }
      ];
    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = tickets;

    if (searchQuery) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: 'red', text: 'Ouvert', icon: ExclamationTriangleIcon },
      in_progress: { color: 'yellow', text: 'En cours', icon: ClockIcon },
      resolved: { color: 'green', text: 'Résolu', icon: CheckCircleIcon },
      closed: { color: 'gray', text: 'Fermé', icon: CheckCircleIcon },
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'gray', text: 'Faible' },
      medium: { color: 'yellow', text: 'Moyenne' },
      high: { color: 'orange', text: 'Élevée' },
      urgent: { color: 'red', text: 'Urgente' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      technical: { color: 'blue', text: 'Technique' },
      billing: { color: 'green', text: 'Facturation' },
      feature: { color: 'purple', text: 'Fonctionnalité' },
      bug: { color: 'red', text: 'Bug' },
      other: { color: 'gray', text: 'Autre' },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleSendMessage = () => {
    if (selectedTicket && newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'user' as const,
        message: newMessage.trim(),
        timestamp: new Date().toISOString()
      };

      setTickets(prev =>
        prev.map(ticket =>
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              messages: [...ticket.messages, message],
                lastMessageAt: message.timestamp,
                updatedAt: message.timestamp
            } 
          : ticket
        )
      );

      setNewMessage('');
    }
  };

  const handleCreateTicket = () => {
    if (newTicket.title.trim() && newTicket.description.trim()) {
      const ticket: SupportTicket = {
        id: Date.now().toString(),
        title: newTicket.title.trim(),
        description: newTicket.description.trim(),
        category: newTicket.category,
        priority: newTicket.priority,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messages: [{
          id: '1',
          sender: 'user',
          message: newTicket.description.trim(),
          timestamp: new Date().toISOString()
        }],
        tags: []
      };
      
      setTickets(prev => [ticket, ...prev]);
      setNewTicket({ title: '', description: '', category: 'technical', priority: 'medium' });
      setShowNewTicketModal(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Support & Assistance</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos tickets de support et obtenez de l'aide
          </p>
        </div>
        <button
          onClick={() => setShowNewTicketModal(true)}
          className="btn-primary"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Nouveau ticket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total tickets</p>
              <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ouverts</p>
              <p className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'open').length}
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
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Résolus</p>
              <p className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
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
                placeholder="Titre, description, tags..."
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
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="closed">Fermé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input"
            >
              <option value="all">Toutes les priorités</option>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="all">Toutes les catégories</option>
              <option value="technical">Technique</option>
              <option value="billing">Facturation</option>
              <option value="feature">Fonctionnalité</option>
              <option value="bug">Bug</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('all');
              }}
              className="btn-outline w-full"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
              {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                    {getCategoryBadge(ticket.category)}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{ticket.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
            </div>
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-1" />
                      {ticket.assignedTo || 'Non assigné'}
          </div>
                    <div className="flex items-center">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                      {ticket.messages.length} message(s)
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewTicket(ticket)}
                      className="btn-outline"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Voir
                    </button>
                  </div>
                </div>

                {ticket.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ticket.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun ticket trouvé</h3>
          <p className="text-gray-500">Aucun ticket ne correspond à vos critères de recherche.</p>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">{selectedTicket.title}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                  {getCategoryBadge(selectedTicket.category)}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Messages</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                        className={`p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-50 ml-8'
                            : 'bg-gray-50 mr-8'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-gray-900">{message.message}</p>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(message.timestamp).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    ))}
                    </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-1 input"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="btn-primary"
                    >
                      <ReplyIcon className="w-4 h-4 mr-2" />
                      Envoyer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Nouveau ticket de support</h3>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Décrivez brièvement votre problème..."
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    placeholder="Décrivez en détail votre problème ou votre demande..."
                    className="input"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value as any }))}
                      className="input"
                    >
                      <option value="technical">Technique</option>
                      <option value="billing">Facturation</option>
                      <option value="feature">Fonctionnalité</option>
                      <option value="bug">Bug</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="input"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="btn-outline"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateTicket}
                  disabled={!newTicket.title.trim() || !newTicket.description.trim()}
                  className="btn-primary"
                >
                  Créer le ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}