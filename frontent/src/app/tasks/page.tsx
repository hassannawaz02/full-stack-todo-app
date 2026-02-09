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

const TasksPage = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'updated_at' | 'title'>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

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
    sortBy,
    order,
  });

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks efficiently
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Show</label>
                <Select value={filter} onValueChange={(value: 'all' | 'active' | 'completed') => setFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="active">Active Tasks</SelectItem>
                    <SelectItem value="completed">Completed Tasks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={(value: 'created_at' | 'updated_at' | 'title') => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Created</SelectItem>
                    <SelectItem value="updated_at">Date Updated</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Select value={order} onValueChange={(value: 'asc' | 'desc') => setOrder(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Task Form */}
          <div className="lg:col-span-1">
            <TaskForm onSubmit={createTask} isLoading={isCreating} />
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {filter === 'all' ? 'All Tasks' : filter === 'completed' ? 'Completed Tasks' : 'Active Tasks'}
                </CardTitle>
                <CardDescription>
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </CardDescription>
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
};

export default TasksPage;
