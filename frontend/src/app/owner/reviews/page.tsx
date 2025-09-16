'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  UserIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ReplyIcon,
  FlagIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  eventName?: string;
  eventDate: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  response?: string;
  responseDate?: string;
  isVerified: boolean;
  helpful: number;
  notHelpful: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
    const mockReviews: Review[] = [
      {
        id: '1',
          customerName: 'Marie Koné',
          customerEmail: 'marie.kone@email.com',
          customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        rating: 5,
          title: 'Excellente soirée !',
          comment: 'Une soirée parfaite avec une ambiance chaleureuse et un service impeccable. La vue depuis le rooftop est magnifique. Je recommande vivement !',
          eventName: 'Soirée Jazz au Rooftop',
          eventDate: '2024-01-20',
          createdAt: '2024-01-21T10:30:00Z',
        status: 'approved',
          response: 'Merci beaucoup Marie ! Nous sommes ravis que vous ayez passé un excellent moment. Au plaisir de vous revoir bientôt !',
          responseDate: '2024-01-21T14:30:00Z',
          isVerified: true,
        helpful: 12,
          notHelpful: 1
      },
      {
        id: '2',
          customerName: 'Jean Dupont',
          customerEmail: 'jean.dupont@email.com',
        rating: 4,
          title: 'Très bon restaurant',
          comment: 'La nourriture était délicieuse et le service rapide. Seul bémol : un peu bruyant pour un déjeuner d\'affaires.',
        eventName: 'Déjeuner d\'affaires',
          eventDate: '2024-01-18',
          createdAt: '2024-01-18T15:45:00Z',
        status: 'approved',
          isVerified: true,
        helpful: 8,
          notHelpful: 2
      },
      {
        id: '3',
          customerName: 'Fatou Sall',
          customerEmail: 'fatou.sall@email.com',
          rating: 5,
          title: 'Anniversaire mémorable',
          comment: 'Merci pour cette soirée d\'anniversaire parfaite ! L\'équipe a été aux petits soins et a rendu cette célébration inoubliable.',
          eventName: 'Anniversaire Fatou',
          eventDate: '2024-01-22',
          createdAt: '2024-01-23T09:15:00Z',
          status: 'approved',
          response: 'Merci Fatou ! Nous sommes heureux d\'avoir contribué à votre anniversaire. Bonne continuation !',
          responseDate: '2024-01-23T11:00:00Z',
          isVerified: true,
          helpful: 15,
          notHelpful: 0
      },
      {
        id: '4',
          customerName: 'Moussa Diop',
          customerEmail: 'moussa.diop@email.com',
          rating: 2,
          title: 'Décevant',
          comment: 'L\'événement a été annulé au dernier moment sans explication claire. Très décevant.',
          eventName: 'Soirée Hip-Hop',
          eventDate: '2024-01-19',
          createdAt: '2024-01-19T20:30:00Z',
          status: 'pending',
          isVerified: false,
          helpful: 3,
          notHelpful: 8
      },
      {
        id: '5',
          customerName: 'Aminata Traoré',
          customerEmail: 'aminata.traore@email.com',
          rating: 5,
          title: 'Pièce de théâtre magnifique',
          comment: 'Une représentation exceptionnelle ! Les acteurs étaient brillants et la mise en scène parfaite. Un moment culturel inoubliable.',
          eventName: 'Pièce de théâtre',
          eventDate: '2024-01-25',
          createdAt: '2024-01-26T08:20:00Z',
          status: 'approved',
          isVerified: true,
          helpful: 20,
          notHelpful: 1
      }
    ];
    setReviews(mockReviews);
    setFilteredReviews(mockReviews);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = reviews;

    if (searchQuery) {
      filtered = filtered.filter(review => 
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (review.eventName && review.eventName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    setFilteredReviews(filtered);
  }, [reviews, searchQuery, ratingFilter, statusFilter]);

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'yellow', text: 'En attente' },
      approved: { color: 'green', text: 'Approuvé' },
      rejected: { color: 'red', text: 'Rejeté' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(filteredReviews.map(review => review.id));
    }
  };

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.response || '');
    setShowModal(true);
  };

  const handleApproveReview = (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, status: 'approved' as const }
          : review
      )
    );
  };

  const handleRejectReview = (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, status: 'rejected' as const }
          : review
      )
    );
  };

  const handleSubmitResponse = () => {
    if (selectedReview && responseText.trim()) {
      setReviews(prev =>
        prev.map(review =>
        review.id === selectedReview.id 
          ? { 
              ...review, 
              response: responseText.trim(),
                responseDate: new Date().toISOString()
            } 
          : review
        )
      );
      setShowModal(false);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on reviews:`, selectedReviews);
    // Implémenter les actions en lot
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter(r => r.status === 'approved').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;

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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des avis</h1>
          <p className="mt-2 text-gray-600">
            Gérez les avis et réponses de vos clients
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
              <StarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}/5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approuvés</p>
              <p className="text-2xl font-bold text-gray-900">{approvedReviews}</p>
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
              <p className="text-2xl font-bold text-gray-900">{pendingReviews}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total avis</p>
              <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
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
                placeholder="Client, titre, commentaire..."
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="input"
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
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
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setRatingFilter('all');
                setStatusFilter('all');
              }}
              className="btn-outline w-full"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedReviews.length} avis sélectionné(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="btn-sm bg-green-600 text-white hover:bg-green-700"
              >
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Approuver
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="btn-sm bg-red-600 text-white hover:bg-red-700"
              >
                <XCircleIcon className="w-4 h-4 mr-1" />
                Rejeter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
          {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    {review.customerAvatar ? (
                      <img
                        src={review.customerAvatar}
                        alt={review.customerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-600 font-medium">
                        {review.customerName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{review.customerName}</h3>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {getRatingStars(review.rating)}
                    </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                          {review.isVerified && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Vérifié
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(review.status)}
                        <button
                          onClick={() => handleViewReview(review)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{review.title}</h4>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>

                {review.eventName && (
                  <div className="mb-3">
                    <span className="text-xs text-gray-500">Événement: </span>
                    <span className="text-xs text-gray-900">{review.eventName}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({new Date(review.eventDate).toLocaleDateString('fr-FR')})
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      {review.helpful} utiles
                    </span>
                    <span>
                      {review.notHelpful} pas utiles
                    </span>
                  </div>
                  <div className="flex space-x-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                          onClick={() => handleApproveReview(review.id)}
                          className="btn-sm bg-green-600 text-white hover:bg-green-700"
                      >
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Approuver
                      </button>
                      <button
                          onClick={() => handleRejectReview(review.id)}
                          className="btn-sm bg-red-600 text-white hover:bg-red-700"
                      >
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          Rejeter
                      </button>
                    </>
                  )}
                    <button className="btn-sm bg-blue-600 text-white hover:bg-blue-700">
                      <ReplyIcon className="w-4 h-4 mr-1" />
                      Répondre
                  </button>
                  </div>
                </div>

                {review.response && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">Votre réponse</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {review.responseDate && new Date(review.responseDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{review.response}</p>
                  </div>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun avis trouvé</h3>
          <p className="text-gray-500">Aucun avis ne correspond à vos critères de recherche.</p>
          </div>
        )}

      {/* Review Details Modal */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Détails de l'avis</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    {selectedReview.customerAvatar ? (
                      <img
                        src={selectedReview.customerAvatar}
                        alt={selectedReview.customerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-600 font-medium">
                        {selectedReview.customerName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{selectedReview.customerName}</h4>
                    <div className="flex items-center">
                      {getRatingStars(selectedReview.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(selectedReview.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-md font-medium text-gray-900 mb-2">{selectedReview.title}</h5>
                  <p className="text-gray-600">{selectedReview.comment}</p>
            </div>

                {selectedReview.eventName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Événement</label>
                    <p className="text-sm text-gray-900">{selectedReview.eventName}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Réponse</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
                    className="input"
                placeholder="Tapez votre réponse ici..."
              />
            </div>

                <div className="flex justify-end space-x-2">
              <button
                    onClick={() => setShowModal(false)}
                    className="btn-outline"
              >
                Annuler
              </button>
              <button
                    onClick={handleSubmitResponse}
                    className="btn-primary"
              >
                    Envoyer la réponse
              </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}