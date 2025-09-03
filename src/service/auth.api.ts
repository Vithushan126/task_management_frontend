import api from './axios';

export const register = async ({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role?: string;
}) => {
  return await api.post('auth/register', { email, password, role });
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await api.post('auth/login', { email, password });
};

export const logout = async () => {
  return await api.post('auth/logout');
};

export const forgot = async (email: string) => {
  return await api.post('auth/forgot-password', email);
};

export const reSetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  return await api.post('auth/reset-password', { token, newPassword });
};

export const deleteUser = async (id: number) => {
  return await api.delete(`auth/${id}`);
};
