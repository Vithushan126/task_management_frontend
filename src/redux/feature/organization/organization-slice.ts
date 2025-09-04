import { createSlice } from '@reduxjs/toolkit';
import {
  createOrganization,
  deleteOrganizationById,
  getAllOrganization,
  getOrganizationWithId,
  updateOrganization,
} from './organization-thunk';
import { Organization } from '@/types';

type OrganizationState = {
  organization: Organization[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
};

const initialState: OrganizationState = {
  organization: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.organization = action.payload.organizations;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch organization';
      })

      .addCase(getOrganizationWithId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getOrganizationWithId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.organization = action.payload;
      })

      .addCase(getOrganizationWithId.rejected, (state, action) => {
        state.loading = false;
        if (action.payload instanceof Error) {
          state.error = action.payload.message;
        } else {
          state.error = action.payload as string;
        }
      })

      .addCase(createOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.organization.push(action.payload);
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        if (action.payload instanceof Error) {
          state.error = action.payload.message;
        } else {
          state.error = action.payload as string;
        }
      })

      .addCase(updateOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.organization.findIndex(
          (org) => org.id === action.payload.id,
        );
        if (index !== -1) {
          state.organization[index] = action.payload;
        }
      })

      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        if (action.payload instanceof Error) {
          state.error = action.payload.message;
        } else {
          state.error = action.payload as string;
        }
      })

      .addCase(deleteOrganizationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteOrganizationById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // state.visitors = state.visitors.filter(
        //   (visitor) => visitor.id !== action.payload.id
        // );
      })

      .addCase(deleteOrganizationById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload instanceof Error) {
          state.error = action.payload.message;
        } else {
          state.error = action.payload as string;
        }
      });
  },
});

export default organizationSlice.reducer;
