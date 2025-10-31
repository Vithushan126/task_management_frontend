import { createAsyncThunk } from '@reduxjs/toolkit';
import * as SpaceAPI from '@/service/space.api';
import { CreateSpaceDto, GetSpacesParams } from '@/types/space';
import { getAllNested } from '../workspace/workspace-thunk';

export const getAllSpaces = createAsyncThunk<
  any,
  GetSpacesParams,
  { rejectValue: string }
>('space/getAll', async (params, thunkAPI) => {
  try {
    const response = await SpaceAPI.getAllSpaces(params);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch spaces',
    );
  }
});

export const getSpaceById = createAsyncThunk(
  'space/getById',
  async (id: string, thunkAPI) => {
    try {
      return await SpaceAPI.getSpaceById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch space',
      );
    }
  },
);

export const createSpace = createAsyncThunk(
  'space/create',
  async (payload: CreateSpaceDto, thunkAPI) => {
    try {
      const response = await SpaceAPI.createSpace(payload);
      thunkAPI.dispatch(getAllNested());
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create space',
      );
    }
  },
);

export const updateSpace = createAsyncThunk(
  'space/update',
  async (
    { id, payload }: { id: string; payload: Partial<CreateSpaceDto> },
    thunkAPI,
  ) => {
    try {
      return await SpaceAPI.updateSpace(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update space',
      );
    }
  },
);

export const deleteSpace = createAsyncThunk(
  'space/delete',
  async (id: string, thunkAPI) => {
    try {
      return await SpaceAPI.deleteSpace(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete space',
      );
    }
  },
);

export const archiveSpace = createAsyncThunk(
  'space/archive',
  async (id: string, thunkAPI) => {
    try {
      return await SpaceAPI.archiveSpace(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to archive space',
      );
    }
  },
);

export const unarchiveSpace = createAsyncThunk(
  'space/unarchive',
  async (id: string, thunkAPI) => {
    try {
      return await SpaceAPI.unarchiveSpace(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to unarchive space',
      );
    }
  },
);
