'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  duration: number;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  amount: number;
  notes?: string;
}

export default function ReservationsCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    // Simuler le chargement des réservations
    setTimeout(() => {
      setReservations([
        {
          id: '1',
          customerName: 'Marie Koné',
          customerPhone: '+225 07 12 34 56 78',
          date: '2024-01-15',
          time: '19:30',
          duration: 120,
          guests: 4,
          status: 'confirmed',
          amount: 25000,
          notes: 'Anniversaire de mariage'
        },
        {
          id: '2',
          customerName: 'Jean Dupont',
          customerPhone: '+225 07 23 45 67 89',
          date: '2024-01-15',
          time: '20:00',
          duration: 90,
          guests: 2,
          status: 'pending',
          amount: 15000
        },
        {
          id: '3',
          customerName: 'Fatou Sall',
          customerPhone: '+225 07 34 56 78 90',
          date: '2024-01-16',
          time: '21:00',
          duration: 150,
          guests: 6,
          status: 'confirmed',
          amount: 35000,
          notes: 'Dîner d\'affaires'
        },
        {
          id: '4',
          customerName: 'Aminata Traoré',
          customerPhone: '+225 07 45 67 89 01',
          date: '2024-01-17',
          time: '18:30',
          duration: 120,
          guests: 3,
          status: 'confirmed',
          amount: 20000
        }
      ]);
    }, 1000);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Ajouter les jours vides du mois précédent
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getReservationsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return reservations.filter(res => res.date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendrier des réservations</h1>
          <p className="mt-2 text-gray-600">
            Visualisez et gérez vos réservations par date
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg ${
                view === 'month' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-2 text-sm font-medium border-l border-gray-300 ${
                view === 'week' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg border-l border-gray-300 ${
                view === 'day' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Jour
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Days of week header */}
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2"></div>;
            }
            
            const dayReservations = getReservationsForDate(day);
            const hasReservations = dayReservations.length > 0;
            
            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day.toISOString().split('T')[0])}
                className={`p-2 min-h-[100px] border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  isToday(day) ? 'bg-primary-50 border-primary-200' : ''
                } ${isSelected(day) ? 'ring-2 ring-primary-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    isToday(day) ? 'text-primary-600' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </span>
                  {hasReservations && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {dayReservations.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayReservations.slice(0, 2).map(reservation => (
                    <div
                      key={reservation.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReservation(reservation);
                      }}
                      className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${getStatusColor(reservation.status)}`}
                    >
                      {reservation.time} - {reservation.customerName}
                    </div>
                  ))}
                  {dayReservations.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayReservations.length - 2} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Réservations du {new Date(selectedDate).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          
          <div className="space-y-3">
            {getReservationsForDate(new Date(selectedDate)).map(reservation => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedReservation(reservation)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-sm font-medium text-gray-900">{reservation.customerName}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {reservation.time} • {reservation.guests} personnes • {reservation.duration} min
                  </div>
                  {reservation.notes && (
                    <div className="mt-1 text-sm text-gray-500">{reservation.notes}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(reservation.amount)}</div>
                  <div className="text-sm text-gray-500">{reservation.customerPhone}</div>
                </div>
              </div>
            ))}
            
            {getReservationsForDate(new Date(selectedDate)).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune réservation pour cette date
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la réservation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client</label>
                <p className="text-sm text-gray-900">{selectedReservation.customerName}</p>
                <p className="text-sm text-gray-600">{selectedReservation.customerPhone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date et heure</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedReservation.date).toLocaleDateString('fr-FR')} à {selectedReservation.time}
                </p>
                <p className="text-sm text-gray-600">Durée: {selectedReservation.duration} minutes</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Détails</label>
                <p className="text-sm text-gray-900">{selectedReservation.guests} personnes</p>
                <p className="text-sm text-gray-900">{formatCurrency(selectedReservation.amount)}</p>
                {selectedReservation.notes && (
                  <p className="text-sm text-gray-600 mt-1">{selectedReservation.notes}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReservation.status)}`}>
                  {getStatusLabel(selectedReservation.status)}
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedReservation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Fermer
              </button>
              {selectedReservation.status === 'pending' && (
                <>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                    <CheckIcon className="h-4 w-4 inline mr-1" />
                    Confirmer
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                    <XMarkIcon className="h-4 w-4 inline mr-1" />
                    Refuser
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
