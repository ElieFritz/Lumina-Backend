'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCallback, useEffect } from 'react';

export function useAdminNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const navigateToAdmin = useCallback((path: string) => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    
    router.push(path);
  }, [user, router]);

  const isAdminRoute = useCallback((path: string) => {
    return path.startsWith('/admin');
  }, []);

  const isCurrentRoute = useCallback((path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  }, [pathname]);

  // Vérifier l'authentification à chaque navigation
  useEffect(() => {
    if (!isLoading && isAdminRoute(pathname)) {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      
      if (user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, isLoading, pathname, router, isAdminRoute]);

  return {
    navigateToAdmin,
    isAdminRoute,
    isCurrentRoute,
    user,
    isLoading,
  };
}
