'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface Permission {
  resource: string;
  action: string;
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    { resource: 'events', action: 'read' },
    { resource: 'venues', action: 'read' },
    { resource: 'reservations', action: 'create' },
    { resource: 'reservations', action: 'read' },
    { resource: 'reviews', action: 'create' },
    { resource: 'reviews', action: 'read' },
    { resource: 'profile', action: 'update' },
  ],
  [UserRole.VENUE_OWNER]: [
    { resource: 'events', action: 'read' },
    { resource: 'events', action: 'create' },
    { resource: 'events', action: 'update' },
    { resource: 'events', action: 'delete' },
    { resource: 'venues', action: 'read' },
    { resource: 'venues', action: 'update' },
    { resource: 'reservations', action: 'read' },
    { resource: 'reservations', action: 'update' },
    { resource: 'reviews', action: 'read' },
    { resource: 'analytics', action: 'read' },
    { resource: 'profile', action: 'update' },
  ],
  [UserRole.ORGANIZER]: [
    { resource: 'events', action: 'read' },
    { resource: 'events', action: 'create' },
    { resource: 'events', action: 'update' },
    { resource: 'events', action: 'delete' },
    { resource: 'venues', action: 'read' },
    { resource: 'reservations', action: 'read' },
    { resource: 'reviews', action: 'read' },
    { resource: 'analytics', action: 'read' },
    { resource: 'profile', action: 'update' },
  ],
  [UserRole.ADMIN]: [
    { resource: '*', action: '*' }, // Admin a tous les droits
  ],
};

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    
    // Admin a tous les droits
    if (user.role === UserRole.ADMIN) return true;

    return userPermissions.some(
      permission => 
        (permission.resource === resource || permission.resource === '*') &&
        (permission.action === action || permission.action === '*')
    );
  };

  const canAccess = (path: string): boolean => {
    if (!user) return false;

    // Routes publiques
    const publicRoutes = ['/', '/auth/login', '/auth/register', '/venues', '/events'];
    if (publicRoutes.includes(path)) return true;

    // Routes utilisateur
    if (path.startsWith('/dashboard') || path.startsWith('/profile')) {
      return user.role === UserRole.USER || user.role === UserRole.VENUE_OWNER || user.role === UserRole.ORGANIZER;
    }

    // Routes propriétaire de lieu
    if (path.startsWith('/owner')) {
      return user.role === UserRole.VENUE_OWNER || user.role === UserRole.ADMIN;
    }

    // Routes organisateur
    if (path.startsWith('/organizer')) {
      return user.role === UserRole.ORGANIZER || user.role === UserRole.ADMIN;
    }

    // Routes admin
    if (path.startsWith('/admin')) {
      return user.role === UserRole.ADMIN;
    }

    return false;
  };

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case UserRole.USER:
        return 'Utilisateur';
      case UserRole.VENUE_OWNER:
        return 'Propriétaire de lieu';
      case UserRole.ORGANIZER:
        return 'Organisateur';
      case UserRole.ADMIN:
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };

  const getRoleDescription = (role: UserRole): string => {
    switch (role) {
      case UserRole.USER:
        return 'Peut réserver des événements et laisser des avis';
      case UserRole.VENUE_OWNER:
        return 'Peut gérer ses lieux et créer des événements';
      case UserRole.ORGANIZER:
        return 'Peut créer et gérer des événements';
      case UserRole.ADMIN:
        return 'Accès complet à toutes les fonctionnalités';
      default:
        return 'Accès limité';
    }
  };

  return {
    hasPermission,
    canAccess,
    getRoleDisplayName,
    getRoleDescription,
    userRole: user?.role,
    isAdmin: user?.role === UserRole.ADMIN,
    isOwner: user?.role === UserRole.VENUE_OWNER,
    isOrganizer: user?.role === UserRole.ORGANIZER,
    isUser: user?.role === UserRole.USER,
  };
}

