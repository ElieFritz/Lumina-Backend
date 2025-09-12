'use client';

import { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ShieldCheckIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'manager' | 'waiter' | 'chef' | 'host' | 'bartender' | 'cleaner';
  status: 'active' | 'inactive' | 'on_leave';
  hireDate: string;
  lastLogin?: string;
  permissions: string[];
  avatar?: string;
}

interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [activeTab, setActiveTab] = useState<'staff' | 'shifts' | 'checklists'>('staff');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Données de test
  useEffect(() => {
    const mockStaff: StaffMember[] = [
      {
        id: '1',
        name: 'Aminata Traoré',
        email: 'aminata@restaurant.ci',
        phone: '+225 07 12 34 56 78',
        role: 'manager',
        status: 'active',
        hireDate: '2023-01-15',
        lastLogin: '2024-01-15T08:30:00Z',
        permissions: ['manage_staff', 'view_reports', 'manage_inventory'],
        avatar: '/avatars/aminata.jpg'
      },
      {
        id: '2',
        name: 'Kouassi Jean',
        email: 'kouassi@restaurant.ci',
        phone: '+225 07 23 45 67 89',
        role: 'waiter',
        status: 'active',
        hireDate: '2023-03-20',
        lastLogin: '2024-01-15T09:15:00Z',
        permissions: ['take_orders', 'view_reservations']
      },
      {
        id: '3',
        name: 'Fatou Diallo',
        email: 'fatou@restaurant.ci',
        phone: '+225 07 34 56 78 90',
        role: 'chef',
        status: 'active',
        hireDate: '2023-02-10',
        lastLogin: '2024-01-15T07:45:00Z',
        permissions: ['manage_menu', 'view_orders']
      },
      {
        id: '4',
        name: 'Moussa Koné',
        email: 'moussa@restaurant.ci',
        phone: '+225 07 45 67 89 01',
        role: 'host',
        status: 'on_leave',
        hireDate: '2023-05-12',
        permissions: ['manage_reservations', 'greet_customers']
      }
    ];

    const mockShifts: Shift[] = [
      {
        id: '1',
        staffId: '1',
        staffName: 'Aminata Traoré',
        date: '2024-01-16',
        startTime: '08:00',
        endTime: '16:00',
        status: 'scheduled',
        notes: 'Gestion de l\'équipe matin'
      },
      {
        id: '2',
        staffId: '2',
        staffName: 'Kouassi Jean',
        date: '2024-01-16',
        startTime: '12:00',
        endTime: '20:00',
        status: 'scheduled',
        notes: 'Service déjeuner et dîner'
      },
      {
        id: '3',
        staffId: '3',
        staffName: 'Fatou Diallo',
        date: '2024-01-16',
        startTime: '06:00',
        endTime: '14:00',
        status: 'in_progress',
        notes: 'Préparation des plats'
      }
    ];

    const mockChecklists: Checklist[] = [
      {
        id: '1',
        title: 'Ouverture du restaurant',
        items: [
          { id: '1', description: 'Vérifier les réservations du jour', completed: true, completedBy: 'Aminata Traoré', completedAt: '2024-01-16T08:00:00Z' },
          { id: '2', description: 'Contrôler l\'état des tables', completed: true, completedBy: 'Kouassi Jean', completedAt: '2024-01-16T08:15:00Z' },
          { id: '3', description: 'Vérifier les stocks de boissons', completed: false },
          { id: '4', description: 'Allumer les équipements de cuisine', completed: true, completedBy: 'Fatou Diallo', completedAt: '2024-01-16T07:30:00Z' }
        ],
        assignedTo: 'Aminata Traoré',
        dueDate: '2024-01-16',
        status: 'in_progress'
      },
      {
        id: '2',
        title: 'Fermeture du restaurant',
        items: [
          { id: '1', description: 'Nettoyer toutes les tables', completed: false },
          { id: '2', description: 'Faire l\'inventaire des stocks', completed: false },
          { id: '3', description: 'Éteindre tous les équipements', completed: false },
          { id: '4', description: 'Verrouiller les portes', completed: false }
        ],
        assignedTo: 'Kouassi Jean',
        dueDate: '2024-01-16',
        status: 'pending'
      }
    ];

    setStaff(mockStaff);
    setShifts(mockShifts);
    setChecklists(mockChecklists);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'waiter': return 'bg-blue-100 text-blue-800';
      case 'chef': return 'bg-orange-100 text-orange-800';
      case 'host': return 'bg-green-100 text-green-800';
      case 'bartender': return 'bg-yellow-100 text-yellow-800';
      case 'cleaner': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChecklistStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === checklistId 
        ? {
            ...checklist,
            items: checklist.items.map(item =>
              item.id === itemId 
                ? { 
                    ...item, 
                    completed: !item.completed,
                    completedBy: !item.completed ? 'Utilisateur actuel' : undefined,
                    completedAt: !item.completed ? new Date().toISOString() : undefined
                  }
                : item
            )
          }
        : checklist
    ));
  };

  const stats = {
    totalStaff: staff.length,
    activeStaff: staff.filter(s => s.status === 'active').length,
    onLeave: staff.filter(s => s.status === 'on_leave').length,
    todayShifts: shifts.filter(s => s.date === new Date().toISOString().split('T')[0]).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff & Opérations</h1>
          <p className="text-gray-600">Gérez votre équipe, les plannings et les tâches opérationnelles</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddStaff(true)}
            className="btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Ajouter un membre
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total staff</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStaff}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeStaff}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En congé</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onLeave}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shifts aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayShifts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('staff')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'staff'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserGroupIcon className="w-5 h-5 inline mr-2" />
              Équipe
            </button>
            <button
              onClick={() => setActiveTab('shifts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shifts'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CalendarDaysIcon className="w-5 h-5 inline mr-2" />
              Plannings
            </button>
            <button
              onClick={() => setActiveTab('checklists')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'checklists'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ClipboardDocumentListIcon className="w-5 h-5 inline mr-2" />
              Tâches
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Équipe */}
          {activeTab === 'staff' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Membres de l'équipe</h2>
                <button
                  onClick={() => setShowAddStaff(true)}
                  className="btn-outline"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Ajouter
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                  <div key={member.id} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{member.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{member.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role === 'manager' ? 'Manager' :
                         member.role === 'waiter' ? 'Serveur' :
                         member.role === 'chef' ? 'Chef' :
                         member.role === 'host' ? 'Hôte' :
                         member.role === 'bartender' ? 'Barman' : 'Nettoyeur'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status === 'active' ? 'Actif' :
                         member.status === 'inactive' ? 'Inactif' : 'En congé'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p>Embauché le {new Date(member.hireDate).toLocaleDateString('fr-FR')}</p>
                      {member.lastLogin && (
                        <p>Dernière connexion: {new Date(member.lastLogin).toLocaleDateString('fr-FR')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Plannings */}
          {activeTab === 'shifts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Plannings des équipes</h2>
                <button
                  onClick={() => setShowAddShift(true)}
                  className="btn-outline"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Ajouter un shift
                </button>
              </div>

              <div className="space-y-4">
                {shifts.map((shift) => (
                  <div key={shift.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{shift.staffName}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(shift.date).toLocaleDateString('fr-FR')} • {shift.startTime} - {shift.endTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getShiftStatusColor(shift.status)}`}>
                          {shift.status === 'scheduled' ? 'Programmé' :
                           shift.status === 'in_progress' ? 'En cours' :
                           shift.status === 'completed' ? 'Terminé' : 'Annulé'}
                        </span>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {shift.notes && (
                      <p className="text-sm text-gray-600 mt-2">{shift.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Tâches */}
          {activeTab === 'checklists' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Listes de tâches</h2>
                <button
                  onClick={() => setShowAddChecklist(true)}
                  className="btn-outline"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Ajouter une liste
                </button>
              </div>

              <div className="space-y-4">
                {checklists.map((checklist) => (
                  <div key={checklist.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{checklist.title}</h3>
                        <p className="text-sm text-gray-600">
                          Assigné à: {checklist.assignedTo} • Échéance: {new Date(checklist.dueDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChecklistStatusColor(checklist.status)}`}>
                        {checklist.status === 'pending' ? 'En attente' :
                         checklist.status === 'in_progress' ? 'En cours' : 'Terminé'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {checklist.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleChecklistItem(checklist.id, item.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              item.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {item.completed && <CheckCircleIcon className="w-3 h-3" />}
                          </button>
                          <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.description}
                          </span>
                          {item.completed && item.completedBy && (
                            <span className="text-xs text-gray-500">
                              par {item.completedBy}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
