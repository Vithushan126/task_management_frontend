import api from './axios';
import { CreateProjectDto, UpdateProjectDto, AddProjectMemberDto, GetProjectsParams } from '@/types/project';

export const getAllProjects = async (params?: GetProjectsParams) => {
  return await api.get('/projects', { params });
};

export const getProjectById = async (id: string) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const getProjectStats = async (id: string) => {
  const { data } = await api.get(`/projects/${id}/stats`);
  return data;
};

export const createProject = async (payload: CreateProjectDto) => {
  const { data } = await api.post('/projects', payload);
  return data;
};

export const updateProject = async (id: string, payload: UpdateProjectDto) => {
  const { data } = await api.patch(`/projects/${id}`, payload);
  return data;
};

export const deleteProject = async (id: string) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

export const addProjectMember = async (id: string, payload: AddProjectMemberDto) => {
  const { data } = await api.post(`/projects/${id}/members`, payload);
  return data;
};

export const removeProjectMember = async (projectId: string, userId: string) => {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`);
  return data;
};