'use client';

import { useState, useEffect } from 'react';
import { 
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  FlagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  CalendarDaysIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  eventName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  response?: string;
  responseDate?: string;
  helpful: number;
  notHelpful: number;
  isVerified: boolean;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Données de test
  useEffect(() => {
    const mockReviews: Review[] = [
      {
        id: '1',
        customerName: 'Fatou Diallo',
        customerAvatar: '/avatars/fatou.jpg',
        rating: 5,
        comment: 'Excellent restaurant ! La nourriture était délicieuse et le service impeccable. Je recommande vivement.',
        date: '2024-01-15',
        eventName: 'Dîner romantique',
        status: 'approved',
        response: 'Merci beaucoup Fatou ! Nous sommes ravis que vous ayez passé un excellent moment.',
        responseDate: '2024-01-16',
        helpful: 12,
        notHelpful: 1,
        isVerified: true
      },
      {
        id: '2',
        customerName: 'Moussa Traoré',
        rating: 4,
        comment: 'Très bon restaurant, ambiance agréable. Seul bémol : l\'attente était un peu longue.',
        date: '2024-01-14',
        eventName: 'Déjeuner d\'affaires',
        status: 'approved',
        response: 'Merci Moussa ! Nous travaillons sur l\'optimisation de nos temps de service.',
        responseDate: '2024-01-15',
        helpful: 8,
        notHelpful: 2,
        isVerified: true
      },
      {
        id: '3',
        customerName: 'Aminata Koné',
        rating: 2,
        comment: 'Service très lent et nourriture tiède. Décevant pour le prix payé.',
        date: '2024-01-13',
        status: 'pending',
        helpful: 3,
        notHelpful: 5,
        isVerified: false
      },
      {
        id: '4',
        customerName: 'Ibrahim Ouattara',
        rating: 5,
        comment: 'Parfait ! Tout était excellent, de l\'accueil au dessert. À refaire absolument !',
        date: '2024-01-12',
        eventName: 'Anniversaire',
        status: 'approved',
        response: 'Merci Ibrahim ! Nous sommes heureux d\'avoir contribué à votre célébration.',
        responseDate: '2024-01-13',
        helpful: 15,
        notHelpful: 0,
        isVerified: true
      },
      {
        id: '5',
        customerName: 'Anonyme',
        rating: 1,
        comment: 'Très mauvais service, personnel impoli. Je ne reviendrai jamais.',
        date: '2024-01-11',
        status: 'flagged',
        helpful: 1,
        notHelpful: 8,
        isVerified: false
      }
    ];
    setReviews(mockReviews);
    setFilteredReviews(mockReviews);
  }, []);

  // Filtrage des avis
  useEffect(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.eventName && review.eventName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const handleStatusChange = (reviewId: string, newStatus: 'approved' | 'rejected' | 'flagged') => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: newStatus } : review
    ));
  };

  const handleResponse = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.response || '');
    setShowResponseModal(true);
  };

  const submitResponse = () => {
    if (selectedReview && responseText.trim()) {
      setReviews(prev => prev.map(review => 
        review.id === selectedReview.id 
          ? { 
              ...review, 
              response: responseText.trim(),
              responseDate: new Date().toISOString().split('T')[0]
            } 
          : review
      ));
      setShowResponseModal(false);
      setResponseText('');
      setSelectedReview(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="w-4 h-4" />;
      case 'pending': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'rejected': return <XCircleIcon className="w-4 h-4" />;
      case 'flagged': return <FlagIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIconSolid
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const stats = {
    total: reviews.length,
    average: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0',
    pending: reviews.filter(r => r.status === 'pending').length,
    flagged: reviews.filter(r => r.status === 'flagged').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avis & E-réputation</h1>
          <p className="text-gray-600">Gérez les avis clients et votre réputation en ligne</p>
        </div>
        <button className="btn-primary">
          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
          Demander des avis
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <StarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{stats.average}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total avis</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FlagIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Signalés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.flagged}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, commentaire ou événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              <option value="pending">En attente</option>
              <option value="approved">Approuvés</option>
              <option value="rejected">Rejetés</option>
              <option value="flagged">Signalés</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Avis clients ({filteredReviews.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.customerAvatar ? (
                      <img
                        src={review.customerAvatar}
                        alt={review.customerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-500" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                      {review.isVerified && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {getStatusIcon(review.status)}
                        <span className="ml-1">
                          {review.status === 'approved' ? 'Approuvé' :
                           review.status === 'pending' ? 'En attente' :
                           review.status === 'rejected' ? 'Rejeté' : 'Signalé'}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('fr-FR')}
                      </span>
                      {review.eventName && (
                        <span className="text-sm text-gray-500">
                          • {review.eventName}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3">{review.comment}</p>

                    {review.response && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">Réponse de l'établissement</span>
                          <span className="text-sm text-gray-500">
                            {review.responseDate && new Date(review.responseDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.response}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <HandThumbUpIcon className="w-4 h-4" />
                        <span>{review.helpful}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HandThumbDownIcon className="w-4 h-4" />
                        <span>{review.notHelpful}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(review.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Approuver"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Rejeter"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleResponse(review)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Répondre"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleStatusChange(review.id, 'flagged')}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                    title="Signaler"
                  >
                    <FlagIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="p-12 text-center">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun avis trouvé</h3>
            <p className="text-gray-600">Aucun avis ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Modal de réponse */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Répondre à l'avis de {selectedReview.customerName}
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center space-x-1 mb-2">
                {renderStars(selectedReview.rating)}
              </div>
              <p className="text-gray-700">{selectedReview.comment}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre réponse
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tapez votre réponse ici..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={submitResponse}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Publier la réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
