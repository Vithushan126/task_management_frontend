import { createSlice } from '@reduxjs/toolkit';
import { SpaceState } from '@/types/space';
import { 
  getAllSpaces, 
  createSpace, 
  updateSpace, 
  deleteSpace, 
  archiveSpace, 
  unarchiveSpace 
} from './space-thunk';

const initialState: SpaceState = {
  spaces: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

const spaceSlice = createSlice({
  name: 'space',
  initialState,
  reducers: {
    clearSpaces: (state) => {
      state.spaces = [];
      state.total = 0;
      state.page = 1;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all spaces
      .addCase(getAllSpaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSpaces.fulfilled, (state, action) => {
        state.loading = false;
        state.spaces = action.payload.spaces;
        state.total = action.payload.total;
        state.page = parseInt(action.payload.page);
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllSpaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create space
      .addCase(createSpace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSpace.fulfilled, (state, action) => {
        state.loading = false;
        state.spaces.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createSpace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update space
      .addCase(updateSpace.fulfilled, (state, action) => {
        const index = state.spaces.findIndex(space => space.id === action.payload.id);
        if (index !== -1) {
          state.spaces[index] = action.payload;
        }
      })
      // Delete space
      .addCase(deleteSpace.fulfilled, (state, action) => {
        state.spaces = state.spaces.filter(space => space.id !== action.meta.arg);
        state.total -= 1;
      })
      // Archive/Unarchive space
      .addCase(archiveSpace.fulfilled, (state, action) => {
        const index = state.spaces.findIndex(space => space.id === action.payload.id);
        if (index !== -1) {
          state.spaces[index] = action.payload;
        }
      })
      .addCase(unarchiveSpace.fulfilled, (state, action) => {
        const index = state.spaces.findIndex(space => space.id === action.payload.id);
        if (index !== -1) {
          state.spaces[index] = action.payload;
        }
      });
  },
});

export const { clearSpaces } = spaceSlice.actions;
export default spaceSlice.reducer;