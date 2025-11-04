import { createSlice } from '@reduxjs/toolkit';
import { getAllTasks } from './task-thunk';
import { TaskState } from '@/types/tasks';

const initialState: TaskState = {
  tasksValue: [],
  //   total: 0,
  //   page: 1,
  //   limit: 10,
  //   totalPages: 0,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasksValue = action.payload;
        // state.total = action.payload.total;
        // state.page = action.payload.page;
        // state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;
