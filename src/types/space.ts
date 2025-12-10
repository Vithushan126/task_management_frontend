export type SpaceSettings = {
  views: {
    defaultView: string;
    enabledViews: string[];
  };
  features: {
    goals: boolean;
    milestones: boolean;
    automations: boolean;
    customFields: boolean;
    dependencies: boolean;
    timeTracking: boolean;
  };
  permissions: {
    whoCanEditSpace: string;
    whoCanDeleteTasks: string;
    whoCanCreateFolders: string;
    whoCanInviteMembers: string;
  };
  customFields: Array<{
    id: string;
    name: string;
    type: string;
    options?: string[];
    required: boolean;
    defaultValue?: string;
  }>;
  notifications: {
    webhookUrl: string | null;
    emailDigest: boolean;
    slackIntegration: boolean;
  };
};

export enum SpaceRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export type SpaceMember = {
  id: string;
  projectId: string;
  userId: string;
  role: SpaceRole;
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

export type Space = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  avatar: string | null;
  visibility: 'private' | 'internal' | 'public';
  status: 'active' | 'inactive';
  settings: SpaceSettings;
  isActive: boolean;
  isArchived: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  members: SpaceMember[];
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
  folderCount: number;
  taskCount: number;
};

export type SpaceState = {
  spaces: Space[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
};

export type CreateSpaceDto = {
  name: string;
  description?: string;
  color: string;
  icon: string;
  visibility: 'private' | 'internal' | 'public';
  workspaceId: string;
  settings?: Partial<SpaceSettings>;
};

export type GetSpacesParams = {
  workspaceId: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
};
