'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { OwnerSidebar } from '@/components/owner/OwnerSidebar';
import { OwnerHeader } from '@/components/owner/OwnerHeader';
import { OwnerNavigation } from '@/components/owner/OwnerNavigation';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      
      // Vérifier si l'utilisateur est propriétaire ou manager d'établissement
      if (user.role !== 'owner' && user.role !== 'manager') {
        // Ne rediriger que si on n'est pas déjà en train de naviguer
        if (window.location.pathname.startsWith('/owner')) {
          router.push('/dashboard');
        }
        return;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || (user.role !== 'owner' && user.role !== 'manager')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerHeader />
      <OwnerNavigation />
      <div className="flex">
        <OwnerSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
