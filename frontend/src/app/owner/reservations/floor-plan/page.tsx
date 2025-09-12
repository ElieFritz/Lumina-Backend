'use client';

import { useState, useEffect } from 'react';
import { 
  MapIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Table {
  id: string;
  number: string;
  x: number;
  y: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  reservationId?: string;
  customerName?: string;
  eventTime?: string;
  guests?: number;
}

interface Reservation {
  id: string;
  bookingNumber: string;
  customerName: string;
  guests: number;
  eventTime: string;
  status: 'pending' | 'confirmed';
}

export default function FloorPlanPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setTables([
        {
          id: '1',
          number: 'T01',
          x: 100,
          y: 100,
          capacity: 2,
          status: 'occupied',
          reservationId: '1',
          customerName: 'Marie Koné',
          eventTime: '21:00',
          guests: 2,
        },
        {
          id: '2',
          number: 'T02',
          x: 200,
          y: 100,
          capacity: 4,
          status: 'reserved',
          reservationId: '2',
          customerName: 'Jean Dupont',
          eventTime: '21:30',
          guests: 4,
        },
        {
          id: '3',
          number: 'T03',
          x: 300,
          y: 100,
          capacity: 2,
          status: 'available',
        },
        {
          id: '4',
          number: 'T04',
          x: 100,
          y: 200,
          capacity: 6,
          status: 'available',
        },
        {
          id: '5',
          number: 'T05',
          x: 200,
          y: 200,
          capacity: 4,
          status: 'occupied',
          reservationId: '3',
          customerName: 'Fatou Sall',
          eventTime: '20:00',
          guests: 4,
        },
        {
          id: '6',
          number: 'T06',
          x: 300,
          y: 200,
          capacity: 2,
          status: 'maintenance',
        },
        {
          id: '7',
          number: 'T07',
          x: 100,
          y: 300,
          capacity: 8,
          status: 'available',
        },
        {
          id: '8',
          number: 'T08',
          x: 200,
          y: 300,
          capacity: 4,
          status: 'available',
        },
        {
          id: '9',
          number: 'T09',
          x: 300,
          y: 300,
          capacity: 2,
          status: 'available',
        },
      ]);

      setReservations([
        {
          id: '1',
          bookingNumber: 'EL001ABC123',
          customerName: 'Marie Koné',
          guests: 2,
          eventTime: '21:00',
          status: 'confirmed',
        },
        {
          id: '2',
          bookingNumber: 'EL002DEF456',
          customerName: 'Jean Dupont',
          guests: 4,
          eventTime: '21:30',
          status: 'pending',
        },
        {
          id: '3',
          bookingNumber: 'EL003GHI789',
          customerName: 'Fatou Sall',
          guests: 4,
          eventTime: '20:00',
          status: 'confirmed',
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const getTableColor = (status: string) => {
    const colors = {
      available: 'bg-green-500',
      occupied: 'bg-red-500',
      reserved: 'bg-yellow-500',
      maintenance: 'bg-gray-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getTableStatusText = (status: string) => {
    const statusTexts = {
      available: 'Disponible',
      occupied: 'Occupée',
      reserved: 'Réservée',
      maintenance: 'Maintenance',
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setShowTableModal(true);
  };

  const handleAssignReservation = (tableId: string, reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      setTables(prev => prev.map(table => 
        table.id === tableId 
          ? {
              ...table,
              status: 'reserved' as const,
              reservationId: reservation.id,
              customerName: reservation.customerName,
              eventTime: reservation.eventTime,
              guests: reservation.guests,
            }
          : table
      ));
    }
    setShowReservationModal(false);
  };

  const handleUnassignReservation = (tableId: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? {
            ...table,
            status: 'available' as const,
            reservationId: undefined,
            customerName: undefined,
            eventTime: undefined,
            guests: undefined,
          }
        : table
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
          <h1 className="text-3xl font-bold text-gray-900">Plan de salle</h1>
          <p className="mt-2 text-gray-600">
            Gérez l'assignation des tables et des réservations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            {isEditing ? 'Terminer l\'édition' : 'Modifier le plan'}
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter une table
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Légende</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
            <span className="text-sm text-gray-700">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
            <span className="text-sm text-gray-700">Occupée</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
            <span className="text-sm text-gray-700">Réservée</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded mr-3"></div>
            <span className="text-sm text-gray-700">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Floor Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
          {/* Restaurant layout elements */}
          <div className="absolute inset-4 border-2 border-gray-300 rounded-lg">
            {/* Bar area */}
            <div className="absolute top-4 left-4 right-4 h-16 bg-amber-200 rounded flex items-center justify-center">
              <span className="text-sm font-medium text-amber-800">Bar</span>
            </div>
            
            {/* Kitchen area */}
            <div className="absolute bottom-4 left-4 w-32 h-20 bg-orange-200 rounded flex items-center justify-center">
              <span className="text-sm font-medium text-orange-800">Cuisine</span>
            </div>
            
            {/* Tables */}
            {tables.map((table) => (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`absolute w-16 h-16 ${getTableColor(table.status)} rounded-lg cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center justify-center text-white text-xs font-medium shadow-lg`}
                style={{
                  left: `${table.x}px`,
                  top: `${table.y}px`,
                }}
              >
                <span>{table.number}</span>
                <span className="text-xs opacity-75">{table.capacity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Liste des tables</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div key={table.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Table {table.number}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  table.status === 'available' ? 'bg-green-100 text-green-800' :
                  table.status === 'occupied' ? 'bg-red-100 text-red-800' :
                  table.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getTableStatusText(table.status)}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                Capacité: {table.capacity} personne{table.capacity > 1 ? 's' : ''}
              </div>
              
              {table.customerName && (
                <div className="text-sm text-gray-600 mb-2">
                  <div>Client: {table.customerName}</div>
                  <div>Heure: {table.eventTime}</div>
                  <div>Invités: {table.guests}</div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTableClick(table)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                {table.status === 'available' && (
                  <button
                    onClick={() => setShowReservationModal(true)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                )}
                {table.status !== 'available' && (
                  <button
                    onClick={() => handleUnassignReservation(table.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Details Modal */}
      {showTableModal && selectedTable && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Table {selectedTable.number}
                </h3>
                <button
                  onClick={() => setShowTableModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Numéro</label>
                    <p className="text-sm text-gray-900">{selectedTable.number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Capacité</label>
                    <p className="text-sm text-gray-900">{selectedTable.capacity} personne{selectedTable.capacity > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedTable.status === 'available' ? 'bg-green-100 text-green-800' :
                      selectedTable.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      selectedTable.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getTableStatusText(selectedTable.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <p className="text-sm text-gray-900">X: {selectedTable.x}, Y: {selectedTable.y}</p>
                  </div>
                </div>
                
                {selectedTable.customerName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Réservation</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">Client: {selectedTable.customerName}</p>
                      <p className="text-sm text-gray-600">Heure: {selectedTable.eventTime}</p>
                      <p className="text-sm text-gray-600">Invités: {selectedTable.guests}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowTableModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                {selectedTable.status === 'available' && (
                  <button
                    onClick={() => {
                      setShowTableModal(false);
                      setShowReservationModal(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Assigner une réservation
                  </button>
                )}
                {selectedTable.status !== 'available' && (
                  <button
                    onClick={() => {
                      handleUnassignReservation(selectedTable.id);
                      setShowTableModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Libérer la table
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Assignment Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Assigner une réservation
                </h3>
                <button
                  onClick={() => setShowReservationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Sélectionnez une réservation à assigner à la table {selectedTable?.number}
                </p>
                
                <div className="space-y-2">
                  {reservations.filter(r => r.status === 'pending' || r.status === 'confirmed').map((reservation) => (
                    <div
                      key={reservation.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => selectedTable && handleAssignReservation(selectedTable.id, reservation.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{reservation.bookingNumber}</p>
                          <p className="text-sm text-gray-600">{reservation.customerName}</p>
                          <p className="text-sm text-gray-600">{reservation.guests} personne{reservation.guests > 1 ? 's' : ''} - {reservation.eventTime}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReservationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
