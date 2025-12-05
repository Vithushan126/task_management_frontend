import api from './axios';
import { CreateSpaceDto, GetSpacesParams } from '@/types/space';

export const getAllSpaces = async (params: GetSpacesParams) => {
  return await api.get('/spaces', { params });
};

export const getSpaceById = async (id: string) => {
  const { data } = await api.get(`/spaces/${id}`);
  return data.data;
};

export const createSpace = async (payload: CreateSpaceDto) => {
  const { data } = await api.post('/spaces', payload);
  return data.data;
};

export const updateSpace = async (
  id: string,
  payload: Partial<CreateSpaceDto>,
) => {
  const res = await api.patch(`/spaces/${id}`, payload);
  return res;
};

export const deleteSpace = async (id: string) => {
  const { data } = await api.delete(`/spaces/${id}`);
  return data.data;
};

export const archiveSpace = async (id: string) => {
  const { data } = await api.patch(`/spaces/${id}/archive`);
  return data.data;
};

export const unarchiveSpace = async (id: string) => {
  const { data } = await api.patch(`/spaces/${id}/unarchive`);
  return data.data;
};

export const getSpaceMembers = async (id: string) => {
  return await api.get(`/spaces/${id}/members`);
};

export const inviteSpaceMembers = async (
  id: string,
  payload: { emails: string[]; role: string },
) => {
  return await api.post(`/spaces/${id}/invite`, payload);
};
