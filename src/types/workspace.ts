import { ProjectRole } from './project';

export type Workspace = {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  ownerId: string;
  visibility: 'private' | 'internal' | 'public';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  members?: any[];
  projectCount?: number;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
  };
};

export type WorkspaceState = {
  workspaces: Workspace[];
  nested?: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
};

export type CreateWorkspaceDto = {
  name: string;
  description?: string;
  visibility: 'private' | 'internal' | 'public';
  organizationId: string;
  userId?: string;
};
export type AddWorkspaceMemberDto = {
  email: string;
  role?: ProjectRole;
};
