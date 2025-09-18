import api from './axios';

export interface AcceptInvitationDto {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const createOrganizations = async (payload: FormData) => {
  const { data } = await api.post('/organizations/create', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.data;
};

export const getAllOrganizations = async (params?: Record<string, any>) => {
  return await api.get('/organizations/admin/all', { params });
};

export const getAllOrganizationsById = async (id: number) => {
  const { data } = await api.get(`/auth/user-details/${id}`);
  return data.data;
};

export const updateOrganizations = async (
  id: number | undefined,
  payload: FormData,
) => {
  const { data } = await api.put(`/organizations/update/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteOrganizations = async (id: number) => {
  const { data } = await api.delete(`/auth/user-details/${id}`);
  return data.data;
};

export const acceptInvitations = async (
  acceptInvitationDto: AcceptInvitationDto,
) => {
  const response = await api.post(
    '/organizations/accept-invitation-with-account',
    acceptInvitationDto,
  );

  return response.data;
};

export const getOrganizationMembers = async (id: string) => {
  return await api.get(`/organizations/${id}/members`);
};

export const getOrganizationInvitations = async (id: string) => {
  return await api.get(`/organizations/${id}/invitations`);
};

export const createOrganizationMultipleMember = async (
  id: string,
  payload: any,
) => {
  return await api.post(`/organizations/${id}/invite-multiple`, payload);
};
