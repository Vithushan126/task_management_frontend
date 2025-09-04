'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard, useUserPermissions } from '@/hooks/use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  fallback = <div>Loading...</div>,
  redirectTo = '/signin',
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, shouldRedirect } = useAuthGuard();

  useEffect(() => {
    if (shouldRedirect) {
      router.push(redirectTo);
    }
  }, [shouldRedirect, router, redirectTo]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

// Component for protecting specific routes based on permissions
interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: 'owner' | 'admin' | 'member';
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  requiredPermission,
  fallback = <div>Access denied</div>,
}: PermissionGuardProps) {
  const { isOwner, isAdmin, isMember } = useUserPermissions();

  const hasPermission = () => {
    switch (requiredPermission) {
      case 'owner':
        return isOwner;
      case 'admin':
        return isOwner || isAdmin;
      case 'member':
        return isOwner || isAdmin || isMember;
      default:
        return false;
    }
  };

  if (!hasPermission()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
