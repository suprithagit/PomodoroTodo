import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskItem from './TaskItem';
import { useTaskContext } from '../context/TaskContext';
import { useTimerContext } from '../context/TimerContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskList: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    completeTask, 
    reorderTasks 
  } = useTaskContext();
  
  const { startTimer } = useTimerContext();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    reorderTasks(result.source.index, result.destination.index);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {/* Task Input Form */}
      <form onSubmit={handleAddTask} className="mb-6">
        <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-3 focus:outline-none"
            aria-label="Add a new task"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className={`p-3 text-white transition-colors duration-200 flex items-center
                       ${newTaskTitle.trim() 
                           ? 'bg-blue-500 hover:bg-blue-600' 
                           : 'bg-gray-300 cursor-not-allowed'}`}
            aria-label="Add task"
          >
            <Plus size={20} />
            <span className="ml-1 hidden sm:inline">Add Task</span>
          </button>
        </div>
      </form>

      {/* Active Tasks */}
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Tasks</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="active-tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mb-6"
            >
              {activeTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No active tasks. Add one above!</p>
              ) : (
                activeTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <TaskItem
                        task={task}
                        onComplete={completeTask}
                        onDelete={deleteTask}
                        onEdit={updateTask}
                        onStartTimer={startTimer}
                        provided={provided}
                      />
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3 text-gray-700 mt-8">Completed</h2>
          <div>
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
                onEdit={updateTask}
                onStartTimer={startTimer}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskList;