import { createSlice } from '@reduxjs/toolkit';
import { WorkspaceState } from '@/types/workspace';
import {
  getAllWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getAllNested,
} from './workspace-thunk';

const initialState: WorkspaceState = {
  workspaces: [],
  nested: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload.workspaces;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getAllNested.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNested.fulfilled, (state, action) => {
        state.loading = false;
        state.nested = action.payload;
      })
      .addCase(getAllNested.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default workspaceSlice.reducer;
