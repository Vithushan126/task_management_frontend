import {
  createOrganizations,
  deleteOrganizations,
  getAllOrganizations,
  getAllOrganizationsById,
  updateOrganizations,
} from '@/service/org.api';
import { SuperAdminOrganizationListDto } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface GetAllOrgsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  plan?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const getAllOrganization = createAsyncThunk<
  SuperAdminOrganizationListDto,
  GetAllOrgsParams | undefined,
  { rejectValue: string }
>('organization/getAll', async (params, thunkAPI) => {
  try {
    const response = await getAllOrganizations(params);
    return response.data; // full paginated response
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch organization',
    );
  }
});

// export const getAllOrganization = createAsyncThunk<
//   SuperAdminOrganizationListDto,
//   void,
//   { rejectValue: string }
// >('organization/getAll', async (_, thunkAPI) => {
//   try {
//     const response = await getAllOrganizations();
//     return response.data; // full paginated response
//   } catch (error) {
//     return thunkAPI.rejectWithValue(
//       error instanceof Error ? error.message : 'Failed to fetch organization',
//     );
//   }
// });

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
