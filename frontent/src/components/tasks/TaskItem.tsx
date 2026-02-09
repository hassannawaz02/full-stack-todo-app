'use client';

import React, { useState, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import type { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onUpdate: (data: Partial<Task>) => void;
  onDelete: () => void;
  onToggle: () => void;
  isLoading?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = memo(({
  task,
  onUpdate,
  onDelete,
  onToggle,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete();
    }
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task title"
              required
              disabled={isLoading}
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={3}
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isLoading}>
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEditCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={task.completed ? 'opacity-60' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={onToggle}
            disabled={isLoading}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium ${
                task.completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`text-sm mt-1 ${
                  task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                }`}
              >
                {task.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              aria-label="Edit task"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isLoading}
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;
