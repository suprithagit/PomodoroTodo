import React, { useState, useRef } from 'react';
import { Clock, Check, Trash, Edit, Save, X } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStartTimer: (id: string) => void;
  provided?: any;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onComplete, 
  onDelete, 
  onEdit, 
  onStartTimer,
  provided 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      onEdit({ ...task, title: editValue });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(task.title);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(task.title);
  };

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={`group p-4 mb-3 rounded-lg shadow-sm border-l-4 transition-all duration-300 
                 ${task.completed 
                     ? 'bg-gray-100 border-gray-400 opacity-70' 
                     : 'bg-white border-blue-500 hover:shadow-md'}`}
    >
      <div className="flex items-center justify-between">
        {isEditing ? (
          <div className="flex items-center flex-1 pr-2">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex ml-2">
              <button
                onClick={handleSaveEdit}
                className="p-1 text-green-600 hover:text-green-800"
                aria-label="Save task"
              >
                <Save size={18} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 text-red-600 hover:text-red-800 ml-1"
                aria-label="Cancel editing"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center flex-1">
              <button
                onClick={() => onComplete(task.id)}
                className={`p-1 mr-3 rounded-full border transition-colors duration-200
                           ${task.completed 
                               ? 'bg-green-100 border-green-500 text-green-600' 
                               : 'bg-white border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-600'}`}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                <Check size={16} className={task.completed ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} />
              </button>
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </span>
              {task.pomodorosCompleted > 0 && (
                <span className="ml-2 text-sm text-gray-500 flex items-center">
                  <Clock size={14} className="mr-1" /> {task.pomodorosCompleted}
                </span>
              )}
            </div>
            <div className="flex ml-2">
              {!task.completed && (
                <>
                  <button
                    onClick={handleEditClick}
                    className="p-1 text-gray-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Edit task"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onStartTimer(task.id)}
                    className="p-1 text-red-500 hover:text-red-700 ml-1"
                    aria-label="Start timer for this task"
                  >
                    <Clock size={18} />
                  </button>
                </>
              )}
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1"
                aria-label="Delete task"
              >
                <Trash size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;