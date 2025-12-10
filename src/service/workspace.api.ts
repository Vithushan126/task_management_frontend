import api from './axios';
import { AddWorkspaceMemberDto, CreateWorkspaceDto } from '@/types/workspace';

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
export const getAllNested = async () => {
  return await api.get('/workspaces/nested');
};

export const getWorkspaceById = async (id: string) => {
  const { data } = await api.get(`/workspaces/${id}`);
  return data.data;
};

export const updateWorkspace = async (
  id: string,
  payload: Partial<CreateWorkspaceDto>,
) => {
  const { data } = await api.patch(`/workspaces/${id}`, payload);
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
  payload: AddWorkspaceMemberDto,
) => {
  return await api.post(`/workspaces/${id}/invite`, payload);
};

export const removeWorkspaceMember = async (
  workspaceId: string,
  memberId: string,
) => {
  return await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
};
