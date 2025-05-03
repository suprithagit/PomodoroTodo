import React, { useState } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Theme } from '../types';
import { useSettingsContext } from '../context/SettingsContext';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings } = useSettingsContext();
  
  const [workDuration, setWorkDuration] = useState(settings.workDuration);
  const [breakDuration, setBreakDuration] = useState(settings.breakDuration);
  const [autoStartBreak, setAutoStartBreak] = useState(settings.autoStartBreak);
  const [theme, setTheme] = useState<Theme>(settings.theme);

  const handleSave = () => {
    updateSettings({
      workDuration,
      breakDuration,
      autoStartBreak,
      theme
    });
    onClose();
  };

  const incrementWork = () => {
    if (workDuration < 60) {
      setWorkDuration(workDuration + 1);
    }
  };

  const decrementWork = () => {
    if (workDuration > 1) {
      setWorkDuration(workDuration - 1);
    }
  };

  const incrementBreak = () => {
    if (breakDuration < 30) {
      setBreakDuration(breakDuration + 1);
    }
  };

  const decrementBreak = () => {
    if (breakDuration > 1) {
      setBreakDuration(breakDuration - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          aria-label="Close settings"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
        
        {/* Work Duration */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Work Duration</h3>
          <div className="flex items-center">
            <button 
              onClick={decrementWork}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 transition-colors duration-200"
              aria-label="Decrease work time"
            >
              <ChevronDown size={20} />
            </button>
            <div className="mx-4 text-2xl font-bold text-gray-800">{workDuration} min</div>
            <button 
              onClick={incrementWork}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 transition-colors duration-200"
              aria-label="Increase work time"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
        
        {/* Break Duration */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Break Duration</h3>
          <div className="flex items-center">
            <button 
              onClick={decrementBreak}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 transition-colors duration-200"
              aria-label="Decrease break time"
            >
              <ChevronDown size={20} />
            </button>
            <div className="mx-4 text-2xl font-bold text-gray-800">{breakDuration} min</div>
            <button 
              onClick={incrementBreak}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 transition-colors duration-200"
              aria-label="Increase break time"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
        
        {/* Auto Start Break */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Auto Start Break</h3>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={autoStartBreak}
                onChange={() => setAutoStartBreak(!autoStartBreak)}
              />
              <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                autoStartBreak ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                autoStartBreak ? 'transform translate-x-4' : ''
              }`}></div>
            </div>
            <span className="ml-3 text-gray-700">
              Automatically start break timer after work timer ends
            </span>
          </label>
        </div>
        
        {/* Theme Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('tomato')}
              className={`p-4 rounded-lg text-center transition-all duration-200 ${
                theme === 'tomato' 
                  ? 'bg-red-100 text-red-800 border-2 border-red-500' 
                  : 'bg-gray-100 text-gray-800 hover:bg-red-50'
              }`}
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-red-500 mb-2"></div>
              <span>Tomato</span>
            </button>
            <button
              onClick={() => setTheme('mint')}
              className={`p-4 rounded-lg text-center transition-all duration-200 ${
                theme === 'mint' 
                  ? 'bg-green-100 text-green-800 border-2 border-green-500' 
                  : 'bg-gray-100 text-gray-800 hover:bg-green-50'
              }`}
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-green-500 mb-2"></div>
              <span>Mint</span>
            </button>
            <button
              onClick={() => setTheme('midnight')}
              className={`p-4 rounded-lg text-center transition-all duration-200 ${
                theme === 'midnight' 
                  ? 'bg-gray-800 text-white border-2 border-gray-600' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-gray-900 mb-2"></div>
              <span>Midnight</span>
            </button>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;