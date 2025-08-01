import { createSlice } from '@reduxjs/toolkit';
import { login } from './auth-thunk';

export type User = {
  id: number;
  name: string;
  email: string;
  roleId: number;
  orgId: number;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  credentials: any | null;
  accessToken: any | null;
  encryptedAdminSecretKey: string | null;
  adminSecretKeyNonce: string | null;
  adminSecretKeySalt: string | null;
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: null,
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logouts: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.credentials = null;
      state.accessToken = null;
      state.encryptedAdminSecretKey = null;
      state.adminSecretKeyNonce = null;
      state.adminSecretKeySalt = null;
    },
  },
  extraReducers(builder) {
    builder
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
        state.accessToken = action.payload?.access_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        if (action.payload instanceof Error) {
          state.error = action.payload.message;
        } else {
          state.error = action.payload as string;
        }
      });
  },
});

export const { logouts } = authSlice.actions;
export default authSlice.reducer;
