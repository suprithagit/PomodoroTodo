import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

const ProgressDashboard: React.FC = () => {
  const { 
    tasksToday, 
    completedTasksToday, 
    totalPomodorosToday 
  } = useTaskContext();
  
  const completionPercentage = tasksToday > 0 
    ? Math.round((completedTasksToday / tasksToday) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Today's Progress</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tasks Stats */}
        <div className="bg-blue-50 rounded-lg p-3 flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <CheckCircle2 className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-blue-700">Tasks Completed</p>
            <p className="text-xl font-bold text-blue-800">
              {completedTasksToday} / {tasksToday}
            </p>
          </div>
        </div>
        
        {/* Pomodoros Stats */}
        <div className="bg-red-50 rounded-lg p-3 flex items-center">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <Clock className="text-red-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-red-700">Pomodoros</p>
            <p className="text-xl font-bold text-red-800">{totalPomodorosToday}</p>
          </div>
        </div>
        
        {/* Completion Percentage */}
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-sm text-green-700 mb-1">Completion Rate</p>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-right text-sm font-medium text-green-800 mt-1">
            {completionPercentage}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;