import api from './axios';
import { CreateWorkspaceDto } from '@/types/workspace';

export const createWorkspace = async (payload: CreateWorkspaceDto) => {
  const { data } = await api.post(
    `/workspaces?organizationId=${payload?.organizationId}`,
    payload,
  );
  return data.data;
};

export const getAllWorkspaces = async (params?: Record<string, any>) => {
  return await api.get('/workspaces/my-workspaces', { params });
};

export const getWorkspaceById = async (id: string) => {
  const { data } = await api.get(`/workspaces/${id}`);
  return data.data;
};

export const updateWorkspace = async (
  id: string,
  payload: Partial<CreateWorkspaceDto>,
) => {
  const { data } = await api.put(`/workspaces/${id}`, payload);
  return data.data;
};

export const deleteWorkspace = async (id: string) => {
  const { data } = await api.delete(`/workspaces/${id}`);
  return data.data;
};

export const getWorkspaceMembers = async (id: string) => {
  return await api.get(`/workspaces/${id}/members`);
};

export const inviteWorkspaceMembers = async (
  id: string,
  payload: { emails: string[]; role: string },
) => {
  return await api.post(`/workspaces/${id}/invite`, payload);
};
