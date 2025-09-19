'use client';

import { useCallback } from 'react';
import { useApiError } from '@/contexts/ErrorContext';

export const useApiErrorHandler = () => {
  const { handleApiError, handleSuccess, handleWarning, handleInfo } = useApiError();

  const withErrorHandling = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      context?: string,
      options?: {
        showSuccess?: boolean;
        successMessage?: string;
        successTitle?: string;
        onError?: (error: any) => void;
        onSuccess?: (result: T) => void;
      }
    ): Promise<T | null> => {
      try {
        const result = await apiCall();
        
        if (options?.showSuccess && options?.successMessage) {
          handleSuccess(
            options.successMessage,
            options.successTitle
          );
        }
        
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        handleApiError(error, context);
        options?.onError?.(error);
        return null;
      }
    },
    [handleApiError, handleSuccess]
  );

  const withRetry = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      maxRetries: number = 3,
      delay: number = 1000,
      context?: string
    ): Promise<T | null> => {
      let lastError: any;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const result = await apiCall();
          return result;
        } catch (error) {
          lastError = error;
          
          // Don't retry on certain error types
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            break;
          }
          
          if (attempt < maxRetries) {
            handleWarning(
              `Tentative ${attempt}/${maxRetries} échouée. Nouvelle tentative dans ${delay}ms...`,
              'Nouvelle tentative'
            );
            
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
          }
        }
      }
      
      handleApiError(lastError, context);
      return null;
    },
    [handleApiError, handleWarning]
  );

  const withLoading = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      setLoading: (loading: boolean) => void,
      context?: string
    ): Promise<T | null> => {
      setLoading(true);
      try {
        const result = await apiCall();
        return result;
      } catch (error) {
        handleApiError(error, context);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleApiError]
  );

  return {
    withErrorHandling,
    withRetry,
    withLoading,
    handleApiError,
    handleSuccess,
    handleWarning,
    handleInfo,
  };
};