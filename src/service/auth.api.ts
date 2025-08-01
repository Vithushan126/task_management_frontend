import api from './axios';

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
  const { data } = await api.post('auth/logout');
  return data;
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
