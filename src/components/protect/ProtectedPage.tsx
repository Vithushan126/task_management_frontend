'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/use-redux';
import Spinner from '@/components/ui/spinner/Spinner';
import {
  ownerPages,
  memberPages,
  NavItem,
  othersItems,
} from '@/constants/pages';

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth,
  );

  // Helper function to check if a pathname exists in NavItems
  const isPathAllowed = (pages: NavItem[], path: string): boolean => {
    for (const page of pages) {
      if (page.path === path) return true;
      if (page.subItems?.some((sub) => sub.path === path)) return true;
    }
    return false;
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }

    if (!loading && isAuthenticated && user) {
      const allowedPages =
        user.role === 'owner'
          ? [...ownerPages, ...othersItems]
          : [...memberPages, ...othersItems];

      if (!isPathAllowed(allowedPages, pathname)) {
        router.push('/unauthorized'); // Page not allowed
      }
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading) {
    return <Spinner />;
  }

  return <>{children}</>;
};

export default ProtectedPage;
