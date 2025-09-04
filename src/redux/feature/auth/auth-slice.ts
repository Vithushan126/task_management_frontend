import { createSlice } from '@reduxjs/toolkit';
import { login, register } from './auth-thunk';

// Types matching your backend response
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  timezone: string;
  locale: string;
  preferences: any;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
};

export type Organization = {
  id: string;
  name: string;
  role: string;
};

export type Workspace = {
  id: string;
  name: string;
  role: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  tokens: Tokens | null;
  organization: Organization | null;
  workspaces: Workspace[];
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  tokens: null,
  organization: null,
  workspaces: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logouts: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.tokens = null;
      state.organization = null;
      state.workspaces = [];

      // Clear tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    },
    setTokens: (state, action) => {
      state.tokens = action.payload;

      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', action.payload.accessToken);
        localStorage.setItem('refresh_token', action.payload.refreshToken);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user;
        state.isAuthenticated = true;
        state.tokens = action.payload?.tokens;
        state.organization = action.payload?.organization;
        state.workspaces = action.payload?.workspaces || [];

        // Store tokens in localStorage
        if (typeof window !== 'undefined' && action.payload?.tokens) {
          localStorage.setItem(
            'access_token',
            action.payload.tokens.accessToken,
          );
          localStorage.setItem(
            'refresh_token',
            action.payload.tokens.refreshToken,
          );
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        if (action.payload instanceof Error) {
          state.error = action.payload.message;
        } else {
          state.error = action.payload as string;
        }
      });
    // // Register
    // .addCase(register.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(register.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.error = null;
    //   state.user = action.payload?.user;
    //   state.isAuthenticated = true;
    //   state.tokens = action.payload?.tokens;
    //   state.organization = action.payload?.organization;
    //   state.workspaces = action.payload?.workspaces || [];

    //   // Store tokens in localStorage
    //   if (typeof window !== 'undefined' && action.payload?.tokens) {
    //     localStorage.setItem(
    //       'access_token',
    //       action.payload.tokens.accessToken,
    //     );
    //     localStorage.setItem(
    //       'refresh_token',
    //       action.payload.tokens.refreshToken,
    //     );
    //   }
    // })
    // .addCase(register.rejected, (state, action) => {
    //   state.loading = false;
    //   if (action.payload instanceof Error) {
    //     state.error = action.payload.message;
    //   } else {
    //     state.error = action.payload as string;
    //   }
    // });
  },
});

export const { logouts, setTokens, clearError } = authSlice.actions;
export default authSlice.reducer;
