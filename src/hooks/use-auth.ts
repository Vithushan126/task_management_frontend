import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './use-redux';
import { checkAuth } from '@/redux/feature/auth/auth-thunk';
import { logouts } from '@/redux/feature/auth/auth-slice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error, tokens, organization, workspaces } = useAppSelector(
    (state) => state.auth
  );

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  const logout = () => {
    dispatch(logouts());
  };

  const isLoading = loading;
  const isLoggedIn = isAuthenticated && !!user;
  const hasOrganization = !!organization;
  const hasWorkspaces = workspaces && workspaces.length > 0;

  return {
    user,
    isAuthenticated: isLoggedIn,
    isLoading,
    error,
    tokens,
    organization,
    workspaces,
    hasOrganization,
    hasWorkspaces,
    logout,
  };
};

// Hook for protecting routes
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && !isAuthenticated,
  };
};

// Hook for getting user permissions
export const useUserPermissions = () => {
  const { user, organization, workspaces } = useAuth();
  
  const isOwner = user?.role === 'owner' || organization?.role === 'OWNER';
  const isAdmin = user?.role === 'admin' || organization?.role === 'ADMIN' || 
                  workspaces?.some(w => w.role === 'ADMIN');
  const isMember = workspaces?.some(w => w.role === 'MEMBER');
  
  return {
    isOwner,
    isAdmin,
    isMember,
    canManageOrganization: isOwner,
    canManageWorkspace: isOwner || isAdmin,
    canViewDashboard: isOwner || isAdmin || isMember,
  };
};
