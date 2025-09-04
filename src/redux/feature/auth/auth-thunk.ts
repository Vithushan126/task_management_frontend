import { AuthAPI } from '@/service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { logouts } from './auth-slice';

// Import types from the API service
import type {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ChangePasswordDto,
  RefreshTokenDto,
} from '@/service/auth.api';

export const register = createAsyncThunk(
  'auth/register',
  async (registerDto: RegisterDto, thunkAPI) => {
    try {
      const { data } = await AuthAPI.register(registerDto);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to register',
      );
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (loginDto: LoginDto, thunkAPI) => {
    try {
      const { data } = await AuthAPI.login(loginDto);
      console.log('Login response:', data);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to login',
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (forgotPasswordDto: { email: string }, thunkAPI) => {
    try {
      const { data } = await AuthAPI.forgotPassword(forgotPasswordDto);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to send reset email',
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetPasswordDto: ResetPasswordDto, thunkAPI) => {
    try {
      const { data } = await AuthAPI.resetPassword(resetPasswordDto);
      console.log('Reset password response:', data);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to reset password',
      );
    }
  },
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verifyEmailDto: VerifyEmailDto, thunkAPI) => {
    try {
      const { data } = await AuthAPI.verifyEmail(verifyEmailDto);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to verify email',
      );
    }
  },
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshTokenDto: RefreshTokenDto, thunkAPI) => {
    try {
      const { data } = await AuthAPI.refreshToken(refreshTokenDto);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to refresh token',
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (changePasswordDto: ChangePasswordDto, thunkAPI) => {
    try {
      const { data } = await AuthAPI.changePassword(changePasswordDto);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to change password',
      );
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const { data } = await AuthAPI.logout();
    thunkAPI.dispatch(logouts());
    return data;
  } catch (error: any) {
    // Even if logout fails on server, clear local state
    thunkAPI.dispatch(logouts());
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || error?.message || 'Failed to logout',
    );
  }
});

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, thunkAPI) => {
    try {
      const { data } = await AuthAPI.getProfile();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to get profile',
      );
    }
  },
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, thunkAPI) => {
    try {
      const { data } = await AuthAPI.checkAuth();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Authentication check failed',
      );
    }
  },
);

// ✅ Delete user thunk
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (id: number, thunkAPI) => {
    try {
      const { data } = await AuthAPI.deleteUser(id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Failed to delete user',
      );
    }
  },
);

// Legacy exports for backward compatibility
export const reSetPassword = resetPassword;
