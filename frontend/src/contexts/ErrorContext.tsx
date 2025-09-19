'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ErrorToast } from '@/components/ui/ErrorToast';

interface ErrorContextType {
  showError: (title: string, message: string, details?: string) => void;
  apiError: any | null;
  setApiError: (error: any | null) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiError, setApiError] = useState<any | null>(null);

  const showError = useCallback((title: string, message: string, details?: string) => {
    toast.custom((t) => (
      <ErrorToast t={t} title={title} message={message} details={details} />
    ));
  }, []);

  return (
    <ErrorContext.Provider value={{ showError, apiError, setApiError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
}

export const useApiError = () => {
  const { addError } = useError();

  const handleApiError = useCallback((error: any, context?: string) => {
    let errorInfo: Omit<ErrorInfo, 'id' | 'timestamp'>;

    // Check if it's a structured API error
    if (error?.response?.data?.error) {
      const apiError: ApiError = error.response.data.error;
      
      errorInfo = {
        type: 'error',
        title: getErrorTitle(apiError.code),
        message: apiError.message,
        details: apiError.details ? JSON.stringify(apiError.details, null, 2) : undefined,
        code: apiError.code,
        duration: 5000,
      };
    } else if (error?.response?.data) {
      // Generic API error
      errorInfo = {
        type: 'error',
        title: 'Erreur API',
        message: error.response.data.message || 'Une erreur est survenue',
        details: context ? `Contexte: ${context}` : undefined,
        duration: 5000,
      };
    } else if (error?.message) {
      // Network or other error
      errorInfo = {
        type: 'error',
        title: 'Erreur de connexion',
        message: error.message,
        details: context ? `Contexte: ${context}` : undefined,
        duration: 5000,
      };
    } else {
      // Unknown error
      errorInfo = {
        type: 'error',
        title: 'Erreur inconnue',
        message: 'Une erreur inattendue s\'est produite',
        details: context ? `Contexte: ${context}` : undefined,
        duration: 5000,
      };
    }

    addError(errorInfo);
  }, [addError]);

  const handleSuccess = useCallback((message: string, title: string = 'Succès') => {
    addError({
      type: 'success',
      title,
      message,
      duration: 3000,
    });
  }, [addError]);

  const handleWarning = useCallback((message: string, title: string = 'Attention') => {
    addError({
      type: 'warning',
      title,
      message,
      duration: 4000,
    });
  }, [addError]);

  const handleInfo = useCallback((message: string, title: string = 'Information') => {
    addError({
      type: 'info',
      title,
      message,
      duration: 4000,
    });
  }, [addError]);

  return {
    handleApiError,
    handleSuccess,
    handleWarning,
    handleInfo,
  };
};

function getErrorTitle(code: string): string {
  const errorTitles: Record<string, string> = {
    // Database errors
    'DATABASE_CONNECTION_FAILED': 'Erreur de base de données',
    'DATABASE_QUERY_FAILED': 'Erreur de requête',
    'RECORD_NOT_FOUND': 'Ressource introuvable',
    'DUPLICATE_RECORD': 'Enregistrement en double',
    
    // Supabase errors
    'SUPABASE_CONNECTION_FAILED': 'Erreur de connexion',
    'SUPABASE_QUERY_FAILED': 'Erreur de requête',
    'SUPABASE_RLS_ERROR': 'Erreur d\'accès',
    
    // Validation errors
    'VALIDATION_ERROR': 'Erreur de validation',
    'INVALID_INPUT': 'Données invalides',
    'MISSING_REQUIRED_FIELD': 'Champ requis manquant',
    
    // Authentication errors
    'UNAUTHORIZED': 'Non autorisé',
    'FORBIDDEN': 'Accès interdit',
    'INVALID_CREDENTIALS': 'Identifiants invalides',
    'TOKEN_EXPIRED': 'Session expirée',
    
    // Business logic errors
    'VENUE_NOT_AVAILABLE': 'Lieu non disponible',
    'EVENT_FULL': 'Événement complet',
    'BOOKING_CONFLICT': 'Conflit de réservation',
    'PAYMENT_FAILED': 'Paiement échoué',
    
    // System errors
    'INTERNAL_SERVER_ERROR': 'Erreur serveur',
    'SERVICE_UNAVAILABLE': 'Service indisponible',
    'RATE_LIMIT_EXCEEDED': 'Limite de requêtes dépassée',
    'NETWORK_ERROR': 'Erreur réseau',
  };

  return errorTitles[code] || 'Erreur';
}