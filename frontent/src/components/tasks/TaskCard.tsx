import React from 'react';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
  };
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onEdit, onDelete, isLoading = false }) => {
  return (
    <div className={`border rounded-lg p-4 mb-3 shadow-sm ${task.is_completed ? 'bg-green-50' : 'bg-white'} md:flex md:items-start md:space-x-3`}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={onToggleComplete}
          disabled={isLoading}
          className="mt-1 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-medium ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'} md:text-lg`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm ${task.is_completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            Created: {new Date(task.created_at).toLocaleString()}
            {task.updated_at !== task.created_at && (
              <span className="hidden md:inline">, Updated: {new Date(task.updated_at).toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex space-x-2 mt-3 md:mt-0 md:ml-auto">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          disabled={isLoading}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;