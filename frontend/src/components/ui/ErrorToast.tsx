'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import toast, { Toast } from 'react-hot-toast';

export interface ErrorInfo {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  details?: string;
  code?: string;
  timestamp: Date;
  duration?: number;
}

interface ErrorContextType {
  errors: ErrorInfo[];
  addError: (error: Omit<ErrorInfo, 'id' | 'timestamp'>) => void;
  removeError: (id: string) => void;
  clearAll: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const addError = useCallback((error: Omit<ErrorInfo, 'id' | 'timestamp'>) => {
    const id = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newError: ErrorInfo = {
      ...error,
      id,
      timestamp: new Date(),
    };

    setErrors(prev => [...prev, newError]);

    // Auto-remove after duration
    if (error.duration && error.duration > 0) {
      setTimeout(() => {
        removeError(id);
      }, error.duration);
    }
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearAll }}>
      {children}
      <ErrorToastContainer />
    </ErrorContext.Provider>
  );
};

const ErrorToastContainer: React.FC = () => {
  const { errors, removeError } = useError();

  if (errors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {errors.map(error => (
        <ErrorToastItem
          key={error.id}
          error={error}
          onRemove={() => removeError(error.id)}
        />
      ))}
    </div>
  );
};

interface ErrorToastItemProps {
  error: ErrorInfo;
  onRemove: () => void;
}

const ErrorToastItem: React.FC<ErrorToastItemProps> = ({ error, onRemove }) => {
  const getIcon = () => {
    switch (error.type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (error.type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (error.type) {
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      case 'success':
        return 'text-green-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className={`${getBgColor()} border rounded-lg p-4 shadow-lg animate-in slide-in-from-right-5`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${getTextColor()}`}>
              {error.title}
            </h3>
            <button
              onClick={onRemove}
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className={`mt-1 text-sm ${getTextColor()} opacity-90`}>
            {error.message}
          </p>
          
          {error.details && (
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                Détails
              </summary>
              <pre className="mt-1 text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded overflow-auto">
                {error.details}
              </pre>
            </details>
          )}
          
          {error.code && (
            <p className="mt-1 text-xs text-gray-500">
              Code: {error.code}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Export the ErrorToast component for use with react-hot-toast
export const ErrorToast: React.FC<{
  t: Toast;
  title: string;
  message: string;
  details?: string;
}> = ({ t, title, message, details }) => {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
            {details && (
              <details className="mt-2 text-xs text-gray-500 cursor-pointer">
                <summary>Show Details</summary>
                <pre className="mt-1 p-2 bg-gray-100 rounded-md overflow-auto max-h-24">
                  {details}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};