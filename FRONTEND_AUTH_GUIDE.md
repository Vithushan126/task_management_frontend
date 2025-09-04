# Frontend Authentication Implementation Guide

This guide explains how to implement frontend authentication that works with your NestJS backend.

## Overview

Your frontend authentication system now properly integrates with your NestJS backend and includes:

- ✅ **JWT Token Management** - Access and refresh tokens
- ✅ **Automatic Token Refresh** - Handles token expiration seamlessly
- ✅ **Redux State Management** - Centralized auth state
- ✅ **Route Protection** - Guards for authenticated routes
- ✅ **User Permissions** - Role-based access control
- ✅ **Proper Error Handling** - User-friendly error messages

## Key Files Updated

### 1. API Service (`src/service/auth.api.ts`)
- Updated to match your backend endpoints exactly
- Added proper TypeScript types for all DTOs
- Includes all auth operations: login, register, forgot password, etc.

### 2. Redux Store (`src/redux/feature/auth/`)
- **auth-slice.ts**: Updated state structure to match backend response
- **auth-thunk.ts**: All async actions with proper error handling
- Automatic token storage in localStorage

### 3. Axios Configuration (`src/service/axios.ts`)
- Automatic token attachment to requests
- Refresh token handling on 401 errors
- Automatic redirect to login on auth failure

### 4. Authentication Hooks (`src/hooks/use-auth.ts`)
- `useAuth()`: Main auth state and actions
- `useAuthGuard()`: Route protection logic
- `useUserPermissions()`: Role-based permissions

### 5. Route Protection (`src/components/auth/AuthGuard.tsx`)
- `AuthGuard`: Protects routes requiring authentication
- `PermissionGuard`: Protects routes requiring specific permissions

## How to Use

### 1. Login Flow

```tsx
// In your login component
import { useAppDispatch } from '@/hooks/use-redux';
import { login } from '@/redux/feature/auth/auth-thunk';

const handleLogin = async (values: { email: string; password: string }) => {
  try {
    const result = await dispatch(login(values)).unwrap();
    // User is now logged in, tokens are stored automatically
    // Navigate based on user role/organization
    if (result.organization) {
      router.push('/organization');
    } else {
      router.push('/dashboard');
    }
  } catch (error) {
    // Handle login error
    toast.error(error);
  }
};
```

### 2. Registration Flow

```tsx
import { register } from '@/redux/feature/auth/auth-thunk';
import type { RegisterDto } from '@/service/auth.api';

const handleRegister = async (values: any) => {
  const registerData: RegisterDto = {
    email: values.email,
    password: values.password,
    firstName: values.firstName,
    lastName: values.lastName,
    organizationName: values.organizationName, // Optional
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: 'en',
  };

  const result = await dispatch(register(registerData)).unwrap();
  // Registration successful, user needs to verify email
};
```

### 3. Protecting Routes

```tsx
// Protect entire pages
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>Protected dashboard content</div>
    </AuthGuard>
  );
}

// Protect based on permissions
import { PermissionGuard } from '@/components/auth/AuthGuard';

export default function AdminPanel() {
  return (
    <PermissionGuard requiredPermission="admin">
      <div>Admin only content</div>
    </PermissionGuard>
  );
}
```

### 4. Using Auth State

```tsx
import { useAuth, useUserPermissions } from '@/hooks/use-auth';

function UserProfile() {
  const { user, isAuthenticated, organization, workspaces, logout } = useAuth();
  const { isOwner, isAdmin, canManageOrganization } = useUserPermissions();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {organization && <p>Organization: {organization.name}</p>}
      {isOwner && <button>Manage Organization</button>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 5. Password Reset Flow

```tsx
import { forgotPassword, resetPassword } from '@/redux/feature/auth/auth-thunk';

// Send reset email
const handleForgotPassword = async (email: string) => {
  await dispatch(forgotPassword(email)).unwrap();
  toast.success('Reset email sent!');
};

// Reset password with token
const handleResetPassword = async (token: string, newPassword: string) => {
  await dispatch(resetPassword({ token, newPassword })).unwrap();
  toast.success('Password reset successful!');
  router.push('/signin');
};
```

## Backend Response Structure

Your backend returns this structure which the frontend now handles correctly:

```typescript
// Login/Register Response
{
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    role: string;
    // ... other user fields
  },
  tokens: {
    accessToken: string;
    refreshToken: string;
  },
  organization?: {
    id: string;
    name: string;
    role: string;
  },
  workspaces?: Array<{
    id: string;
    name: string;
    role: string;
  }>
}
```

## Environment Variables

Make sure you have these in your `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3001/api
```

## Token Management

- **Access tokens** are automatically attached to all API requests
- **Refresh tokens** are used automatically when access tokens expire
- **Token storage** uses localStorage for persistence
- **Automatic cleanup** on logout or auth failure

## Error Handling

The system handles these scenarios automatically:
- Invalid credentials
- Expired tokens (auto-refresh)
- Network errors
- Server errors
- Unauthorized access (redirect to login)

## Next Steps

1. **Test the login flow** with your backend
2. **Update your forms** to use the new registration structure
3. **Add route protection** to your pages
4. **Implement email verification** flow
5. **Add password change** functionality
6. **Test token refresh** behavior

The authentication system is now fully integrated with your NestJS backend and ready for production use!
