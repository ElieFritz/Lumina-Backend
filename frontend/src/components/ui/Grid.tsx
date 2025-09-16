import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface GridProps {
  children: React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onClearFilters?: () => void;
  className?: string;
}

export function Grid({ 
  children, 
  loading = false, 
  emptyMessage = "Aucun résultat trouvé",
  emptyIcon,
  onClearFilters,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
}: GridProps) {
  if (loading) {
    return (
      <div className={className}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const childrenArray = React.Children.toArray(children);
  
  if (childrenArray.length === 0) {
    return (
      <div className="text-center py-12">
        {emptyIcon}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600 mb-6">
          Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
        </p>
        {onClearFilters && (
          <button 
            onClick={onClearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Effacer les filtres
          </button>
        )}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
