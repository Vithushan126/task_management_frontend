import api from "./axios";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data } = await api.post("auth/login", { email, password });
  return data;
};

export const logout = async () => {
  const { data} = await api.post("auth/logout");
  return data;
};
