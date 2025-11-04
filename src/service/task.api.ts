import { CreateTaskDto, GetTasksParams, Task } from '@/types/tasks';
import api from './axios';

export const getAllTasks = async (params?: GetTasksParams) => {
  return await api.get('/tasks', { params });
};

export const createTasks = async (payload: CreateTaskDto) => {
  return await api.post('/tasks', payload);
};
