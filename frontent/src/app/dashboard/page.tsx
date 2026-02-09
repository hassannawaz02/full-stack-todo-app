'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TaskList from '@/components/tasks/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Lazy load TaskForm component
const TaskForm = dynamic(() => import('@/components/tasks/TaskForm'), {
  loading: () => (
    <Card>
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
        <CardDescription>Loading form...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  ),
  ssr: false,
});

export default function DashboardPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const {
    tasks,
    isLoading,
    isError,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,
  } = useTasks({
    completed: filter === 'all' ? null : filter === 'completed',
    sortBy: 'created_at',
    order: 'desc',
  });

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your tasks and stay organized
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Task Form - Left Column */}
          <div className="lg:col-span-1">
            <TaskForm onSubmit={createTask} isLoading={isCreating} />
          </div>

          {/* Task List - Right Column */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Tasks</CardTitle>
                    <CardDescription>
                      {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </CardDescription>
                  </div>
                  <Select value={filter} onValueChange={(value: 'all' | 'active' | 'completed') => setFilter(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <TaskList
                  tasks={tasks}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  onTaskUpdate={(id, data) => updateTask({ id, data })}
                  onTaskDelete={deleteTask}
                  onTaskToggle={toggleTask}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                  isToggling={isToggling}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
