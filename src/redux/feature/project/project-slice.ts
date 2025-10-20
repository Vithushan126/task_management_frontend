import { createSlice } from '@reduxjs/toolkit';
import { ProjectState } from '@/types/project';
import { 
  getAllProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  getProjectById,
  addProjectMember,
  removeProjectMember
} from './project-thunk';

const initialState: ProjectState = {
  projects: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearProjects: (state) => {
      state.projects = [];
      state.total = 0;
      state.page = 1;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all projects
      .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload || [];
        // Note: Backend doesn't return pagination info, so we'll handle it differently
        state.total = action.payload?.length || 0;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(project => project.id !== action.meta.arg);
        state.total -= 1;
      })
      // Add member
      .addCase(addProjectMember.fulfilled, (state, action) => {
        const projectIndex = state.projects.findIndex(p => p.id === action.meta.arg.id);
        if (projectIndex !== -1) {
          state.projects[projectIndex].members.push(action.payload);
          state.projects[projectIndex].memberCount += 1;
        }
      })
      // Remove member
      .addCase(removeProjectMember.fulfilled, (state, action) => {
        const { projectId, userId } = action.meta.arg;
        const projectIndex = state.projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          state.projects[projectIndex].members = state.projects[projectIndex].members.filter(
            m => m.userId !== userId
          );
          state.projects[projectIndex].memberCount -= 1;
        }
      });
  },
});

export const { clearProjects } = projectSlice.actions;
export default projectSlice.reducer;