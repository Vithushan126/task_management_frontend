import api from './axios';

// Types matching your backend DTOs
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  organizationName?: string;
  timezone?: string;
  locale?: string;
  role?: 'USER' | 'admin';
}

export interface LoginDto {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

// API functions matching your backend endpoints
export const register = async (registerDto: RegisterDto) => {
  return await api.post('/auth/register', registerDto);
};

export const login = async (loginDto: LoginDto) => {
  return await api.post('/auth/login', loginDto);
};

export const logout = async () => {
  return await api.post('/auth/logout');
};

export const forgotPassword = async (forgotPasswordDto: ForgotPasswordDto) => {
  return await api.post('/auth/forgot-password', forgotPasswordDto);
};

export const resetPassword = async (resetPasswordDto: ResetPasswordDto) => {
  return await api.post('/auth/reset-password', resetPasswordDto);
};

export const verifyEmail = async (verifyEmailDto: VerifyEmailDto) => {
  return await api.post('/auth/verify-email', verifyEmailDto);
};

export const refreshToken = async (refreshTokenDto: RefreshTokenDto) => {
  return await api.post('/auth/refresh-token', refreshTokenDto);
};

export const changePassword = async (changePasswordDto: ChangePasswordDto) => {
  return await api.post('/auth/change-password', changePasswordDto);
};

export const getProfile = async () => {
  return await api.get('/auth/me');
};

export const checkAuth = async () => {
  return await api.get('/auth/check');
};

// Legacy function names for backward compatibility
export const reSetPassword = resetPassword;

export const deleteUser = async (id: number) => {
  return await api.delete(`auth/${id}`);
};
