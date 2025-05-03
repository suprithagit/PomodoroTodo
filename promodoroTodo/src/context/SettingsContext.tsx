import React, { createContext, useContext } from 'react';
import { Settings, Theme } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  themes: { [key in Theme]: string };
}

const defaultSettings: Settings = {
  workDuration: 25,
  breakDuration: 5,
  autoStartBreak: true,
  theme: 'tomato'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>('pomodoroTodo-settings', defaultSettings);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(current => ({ ...current, ...newSettings }));
  };

  // Theme color definitions
  const themes = {
    tomato: 'bg-red-50 text-red-900',
    mint: 'bg-green-50 text-green-900',
    midnight: 'bg-gray-900 text-gray-50'
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, themes }}>
      {children}
    </SettingsContext.Provider>
  );
};