import React from 'react';
import { Settings } from 'lucide-react';
import { useSettingsContext } from '../context/SettingsContext';

interface HeaderProps {
  openSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ openSettings }) => {
  const { settings } = useSettingsContext();
  
  let themeClasses = 'transition-colors duration-300 ';
  
  switch (settings.theme) {
    case 'tomato':
      themeClasses += 'bg-red-600 text-white';
      break;
    case 'mint':
      themeClasses += 'bg-green-600 text-white';
      break;
    case 'midnight':
      themeClasses += 'bg-gray-900 text-white';
      break;
    default:
      themeClasses += 'bg-red-600 text-white';
  }

  return (
    <header className={`${themeClasses} p-4 shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2">🍅</span>
          PomodoroTodo
        </h1>
        
        <button 
          onClick={openSettings}
          className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Open Settings"
        >
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;