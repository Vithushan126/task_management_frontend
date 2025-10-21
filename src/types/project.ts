export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProjectRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export type ProjectSettings = {
  features: {
    timeTracking: boolean;
    customFields: boolean;
    subtasks: boolean;
    dependencies: boolean;
    milestones: boolean;
    ganttChart: boolean;
  };
  permissions: {
    whoCanCreateTasks: string;
    whoCanEditTasks: string;
    whoCanDeleteTasks: string;
    whoCanInviteMembers: string;
  };
  taskStatuses: Array<{
    id: string;
    name: string;
    color: string;
    type: string;
    order: number;
  }>;
  taskPriorities: Array<{
    id: string;
    name: string;
    color: string;
    order: number;
  }>;
  customFields: any[];
};

export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  permissions?: string[];
  addedBy: string;
  addedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: string;
  endDate?: string;
  progress?: {
    percentage: number;
  };
  settings: ProjectSettings;
  spaceId: string;
  workspaceId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members: ProjectMember[];
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  memberCount: number;
  taskCount: number;
  completedTasks: number;
};

export type ProjectState = {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
};

export type CreateProjectDto = {
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: string;
  endDate?: string;
  spaceId: string;
  settings?: Partial<ProjectSettings>;
};

export type UpdateProjectDto = Partial<CreateProjectDto>;

export type AddProjectMemberDto = {
  userId: string;
  role?: ProjectRole;
  permissions?: string[];
};

export type GetProjectsParams = {
  workspaceId?: string;
  spaceId?: string;
  status?: ProjectStatus;
  search?: string;
  page?: number;
  limit?: number;
};
