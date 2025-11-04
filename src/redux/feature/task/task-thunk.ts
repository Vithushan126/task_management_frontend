import { TaskAPI } from '@/service';
import { CreateTaskDto, GetTasksParams, Task } from '@/types/tasks';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllTasks = createAsyncThunk<
  any,
  GetTasksParams | undefined,
  { rejectValue: string }
>('project/getAll', async (params, thunkAPI) => {
  try {
    const response = await TaskAPI.getAllTasks(params);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch tasks',
    );
  }
});

export const createTasks = createAsyncThunk(
  'project/create',
  async (payload: CreateTaskDto, thunkAPI) => {
    try {
      const response = await TaskAPI.createTasks(payload);
      console.log('response', response?.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch tasks',
      );
    }
  },
);
