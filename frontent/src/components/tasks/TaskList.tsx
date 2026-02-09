'use client';

import React, { useCallback } from 'react';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import type { Task, AxiosError } from '@/types';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onTaskUpdate: (id: string, data: Partial<Task>) => void;
  onTaskDelete: (id: string) => void;
  onTaskToggle: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isToggling?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  isError,
  error,
  onTaskUpdate,
  onTaskDelete,
  onTaskToggle,
  isUpdating,
  isDeleting,
  isToggling,
}) => {
  const handleUpdate = useCallback((id: string, data: Partial<Task>) => {
    onTaskUpdate(id, data);
  }, [onTaskUpdate]);

  const handleDelete = useCallback((id: string) => {
    onTaskDelete(id);
  }, [onTaskDelete]);

  const handleToggle = useCallback((id: string) => {
    onTaskToggle(id);
  }, [onTaskToggle]);
  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          {(error as AxiosError)?.message || 'Failed to load tasks. Please try again.'}
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={(data) => handleUpdate(task.id, data)}
          onDelete={() => handleDelete(task.id)}
          onToggle={() => handleToggle(task.id)}
          isLoading={isUpdating || isDeleting || isToggling}
        />
      ))}
    </div>
  );
};

export default TaskList;
