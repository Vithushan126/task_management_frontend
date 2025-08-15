import {
  createOrganizations,
  deleteOrganizations,
  getAllOrganizations,
  getAllOrganizationsById,
  updateOrganizations,
} from '@/service/org.api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllOrganization = createAsyncThunk(
  'organization/getAll',
  async (_, thunkAPI) => {
    try {
      const { data } = await getAllOrganizations();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch organization',
      );
    }
  },
);

export const getOrganizationWithId = createAsyncThunk(
  'organization/getById',
  async (id: number, thunkAPI) => {
    try {
      return await getAllOrganizationsById(id);
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
      return await createOrganizations(org);
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
      const res = await updateOrganizations(id, payload);
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
      return await deleteOrganizations(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to delete organization',
      );
    }
  },
);
