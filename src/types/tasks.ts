export type TaskState = {
  tasksValue: Task[];
  //   total: number;
  //   page: number;
  //   limit: number;
  //   totalPages: number;
  loading: boolean;
  error: string | null;
};
export type GetTasksParams = {
  projectId?: any;
  workspaceId?: string;
  spaceId?: string;
  search?: string;
  page?: number;
  limit?: number;
};
export type Task = {
  id?: any;
  title: string;
  description?: string;
  projectId?: any;
  assignees: User[];
  status: string;
  dueDate: string | null;
  priority: string;
  subtasks?: Task[];
  isNew?: boolean;
  parentTaskId?: string | null;
  assigneeId?: any;
};

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: any;
  assigneeId?: string;
  parentTaskId?: string | null;
  projectId: string;
}

export type User = {
  id: number;
  name: string;
  avatar: string;
};
