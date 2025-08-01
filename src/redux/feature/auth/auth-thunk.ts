import { AuthAPI } from '@/service';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface LoginCredentials {
  email: string;
  password: string;
}

interface ResetCredentials {
  token: string;
  newPassword: string;
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginCredentials, thunkAPI) => {
    try {
      const { data } = await AuthAPI.login({ email, password });
      console.log(data);

      const accessToken = data?.accessToken;
      //   if (accessToken) {
      //     api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      //   }

      //   const userDetailsResponse = await getUsers();
      //   const user = userDetailsResponse.data;
      // await thunkAPI.dispatch(getUsersThunk());
      return data;
      //   return {
      //     accessToken,
      //     // user,
      //   };
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Failed to login');
    }
  },
);

export const forgot = createAsyncThunk(
  'auth/forgot',
  async (email: string, thunkAPI) => {
    try {
      const { data } = await AuthAPI.forgot(email);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Failed to reset password');
    }
  },
);

export const reSetPassword = createAsyncThunk(
  'auth/forgot',
  async ({ token, newPassword }: ResetCredentials, thunkAPI) => {
    try {
      const { data } = await AuthAPI.reSetPassword({ token, newPassword });
      console.log(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Failed to reset password');
    }
  },
);
