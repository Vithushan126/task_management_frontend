import { createSlice } from '@reduxjs/toolkit';
import {
  getOrganizationInvitations,
  getOrganizationMembers,
} from './organization-thunk';
import { Members } from '@/types';

interface MembersState {
  members: Members[];
  loading: boolean;
  error: string | null;
}

const initialState: MembersState = {
  members: [],
  loading: false,
  error: null,
};

const organizationMembersSlice = createSlice({
  name: 'organizationMembers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizationMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizationMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(getOrganizationMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrganizationInvitations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizationInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(getOrganizationInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default organizationMembersSlice.reducer;
