import { createAsyncThunk } from '@reduxjs/toolkit';
import * as ProjectAPI from '@/service/project.api';
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddProjectMemberDto,
  GetProjectsParams,
} from '@/types/project';
import { getAllNested } from '../workspace/workspace-thunk';

export const getAllProjects = createAsyncThunk<
  any,
  GetProjectsParams | undefined,
  { rejectValue: string }
>('project/getAll', async (params, thunkAPI) => {
  try {
    const response = await ProjectAPI.getAllProjects(params);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch projects',
    );
  }
});

export const getProjectById = createAsyncThunk(
  'project/getById',
  async (id: string, thunkAPI) => {
    try {
      return await ProjectAPI.getProjectById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch project',
      );
    }
  },
);

export const getProjectStats = createAsyncThunk(
  'project/getStats',
  async (id: string, thunkAPI) => {
    try {
      return await ProjectAPI.getProjectStats(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to fetch project stats',
      );
    }
  },
);

export const createProject = createAsyncThunk(
  'project/create',
  async (payload: CreateProjectDto, thunkAPI) => {
    try {
      const response = await ProjectAPI.createProject(payload);
      thunkAPI.dispatch(getAllNested());
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create project',
      );
    }
  },
);

export const updateProject = createAsyncThunk(
  'project/update',
  async (
    { id, payload }: { id: string; payload: UpdateProjectDto },
    thunkAPI,
  ) => {
    try {
      return await ProjectAPI.updateProject(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update project',
      );
    }
  },
);

export const deleteProject = createAsyncThunk(
  'project/delete',
  async (id: string, thunkAPI) => {
    try {
      return await ProjectAPI.deleteProject(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete project',
      );
    }
  },
);

export const addProjectMember = createAsyncThunk(
  'project/addMember',
  async (
    { id, payload }: { id: string; payload: AddProjectMemberDto },
    thunkAPI,
  ) => {
    try {
      return await ProjectAPI.addProjectMember(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to add member',
      );
    }
  },
);

export const removeProjectMember = createAsyncThunk(
  'project/removeMember',
  async (
    { projectId, userId }: { projectId: string; userId: string },
    thunkAPI,
  ) => {
    try {
      return await ProjectAPI.removeProjectMember(projectId, userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to remove member',
      );
    }
  },
);
