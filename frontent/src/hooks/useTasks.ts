'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import type { Task, AxiosError } from '@/types';

interface TaskFilters {
  completed?: boolean | null;
  sortBy?: string;
  order?: string;
  limit?: number;
  offset?: number;
}

interface MutationContext {
  previousTasks?: Task[];
}

export function useTasks(filters: TaskFilters = {}) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Fetch tasks query
  const tasksQuery = useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const params = {
        ...filters,
        completed: filters.completed === null ? undefined : filters.completed,
      };
      const response = await taskAPI.getTasks(params);
      return response.tasks || [];
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (taskData: { title: string; description?: string }) =>
      taskAPI.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast('Task created successfully', 'success');
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError;
      let errorMessage = 'Failed to create task';

      if (axiosError?.response?.data?.detail) {
        const detail = axiosError.response.data.detail;

        // Handle validation errors (array of error objects)
        if (Array.isArray(detail)) {
          errorMessage = detail.map((err: any) => err.msg || err.message).join(', ');
        }
        // Handle string error messages
        else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      }

      showToast(errorMessage, 'error');
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      taskAPI.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast('Task updated successfully', 'success');
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError;
      let errorMessage = 'Failed to update task';

      if (axiosError?.response?.data?.detail) {
        const detail = axiosError.response.data.detail;

        if (Array.isArray(detail)) {
          errorMessage = detail.map((err: any) => err.msg || err.message).join(', ');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      }

      showToast(errorMessage, 'error');
    },
  });

  // Delete task mutation with optimistic update
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskAPI.deleteTask(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks', filters]);
      queryClient.setQueryData(['tasks', filters], (old: Task[] = []) =>
        old.filter((task) => task.id !== id)
      );
      return { previousTasks };
    },
    onSuccess: () => {
      showToast('Task deleted successfully', 'success');
    },
    onError: (error: unknown, _id: string, context: MutationContext | undefined) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters], context.previousTasks);
      }

      const axiosError = error as AxiosError;
      let errorMessage = 'Failed to delete task';

      if (axiosError?.response?.data?.detail) {
        const detail = axiosError.response.data.detail;

        if (Array.isArray(detail)) {
          errorMessage = detail.map((err: any) => err.msg || err.message).join(', ');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      }

      showToast(errorMessage, 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Toggle task completion with optimistic update
  const toggleTaskMutation = useMutation({
    mutationFn: (id: string) => taskAPI.toggleTaskCompletion(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks', filters]);
      queryClient.setQueryData(['tasks', filters], (old: Task[] = []) =>
        old.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      return { previousTasks };
    },
    onSuccess: () => {
      showToast('Task status updated', 'success');
    },
    onError: (error: unknown, _id: string, context: MutationContext | undefined) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters], context.previousTasks);
      }

      const axiosError = error as AxiosError;
      let errorMessage = 'Failed to update task';

      if (axiosError?.response?.data?.detail) {
        const detail = axiosError.response.data.detail;

        if (Array.isArray(detail)) {
          errorMessage = detail.map((err: any) => err.msg || err.message).join(', ');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      }

      showToast(errorMessage, 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    toggleTask: toggleTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isToggling: toggleTaskMutation.isPending,
  };
}
