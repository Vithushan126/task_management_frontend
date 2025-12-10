import { SuperAdminOrganizationListDto } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { OrgAPI } from '@/service';

interface GetAllOrgsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  plan?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AcceptInvitationDto {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const getAllOrganization = createAsyncThunk<
  SuperAdminOrganizationListDto,
  GetAllOrgsParams | undefined,
  { rejectValue: string }
>('organization/getAll', async (params, thunkAPI) => {
  try {
    const response = await OrgAPI.getAllOrganizations(params);
    return response.data; // full paginated response
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch organization',
    );
  }
});

export const getOrganizationWithId = createAsyncThunk(
  'organization/getById',
  async (id: number, thunkAPI) => {
    try {
      return await OrgAPI.getAllOrganizationsById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch organization',
      );
    }
  },
);

export const createOrganization = createAsyncThunk(
  'organization/create',
  async (org: FormData, thunkAPI) => {
    try {
      return await OrgAPI.createOrganizations(org);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to create organization',
      );
    }
  },
);

export const updateOrganization = createAsyncThunk(
  'organization/update',
  async ({ id, payload }: { id: number; payload: FormData }, thunkAPI) => {
    try {
      const res = await OrgAPI.updateOrganizations(id, payload);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to update organization',
      );
    }
  },
);

export const deleteOrganizationById = createAsyncThunk(
  'organization/delete',
  async (id: number, thunkAPI) => {
    try {
      return await OrgAPI.deleteOrganizations(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to delete organization',
      );
    }
  },
);

export const acceptInvitation = createAsyncThunk(
  'organization/acceptInvitation',
  async (acceptInvitationDto: AcceptInvitationDto, thunkAPI) => {
    try {
      const data = await OrgAPI.acceptInvitations(acceptInvitationDto);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to verify email',
      );
    }
  },
);

export const getOrganizationMembers = createAsyncThunk(
  'organization/members',
  async (id: any, thunkAPI) => {
    console.log(id);

    try {
      const data = await OrgAPI.getOrganizationMembers(id);
      return data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to verify email',
      );
    }
  },
);

export const getOrganizationInvitations = createAsyncThunk(
  'organization/invitations',
  async (id: any, thunkAPI) => {
    try {
      const data = await OrgAPI.getOrganizationInvitations(id);
      return data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to verify email',
      );
    }
  },
);

export const createOrganizationMultipleMember = createAsyncThunk(
  'organization/createMultipleMember',
  async ({ orgId, payload }: { orgId: any; payload: any }, thunkAPI) => {
    try {
      const { data } = await OrgAPI.createOrganizationMultipleMember(
        orgId,
        payload,
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to invite members',
      );
    }
  },
);
