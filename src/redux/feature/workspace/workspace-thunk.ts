import { createAsyncThunk } from '@reduxjs/toolkit';
import * as WorkspaceAPI from '@/service/workspace.api';
import { CreateWorkspaceDto, Workspace } from '@/types/workspace';

export const getAllWorkspaces = createAsyncThunk<
  any,
  | {
      organizationId: any;
      page?: number;
      limit?: number;
      sortField?: string;
      direction?: 'ASC' | 'DESC';
    }
  | undefined,
  { rejectValue: string }
>('workspace/getAll', async (params, thunkAPI) => {
  try {
    const response = await WorkspaceAPI.getAllWorkspaces(params);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch workspaces',
    );
  }
});

export const createWorkspace = createAsyncThunk(
  'workspace/create',
  async (payload: CreateWorkspaceDto, thunkAPI) => {
    try {
      console.log('payload', payload);

      return await WorkspaceAPI.createWorkspace(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create workspace',
      );
    }
  },
);

export const updateWorkspace = createAsyncThunk(
  'workspace/update',
  async (
    { id, payload }: { id: string; payload: Partial<CreateWorkspaceDto> },
    thunkAPI,
  ) => {
    try {
      return await WorkspaceAPI.updateWorkspace(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update workspace',
      );
    }
  },
);

export const deleteWorkspace = createAsyncThunk(
  'workspace/delete',
  async (id: string, thunkAPI) => {
    try {
      return await WorkspaceAPI.deleteWorkspace(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete workspace',
      );
    }
  },
);
