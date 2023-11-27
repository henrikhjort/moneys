import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { loadTheme, saveTheme } from '../utils/storage';

export type ThemeType = 'light' | 'dark' | null;

type ThemeContextProps = {
  theme: ThemeType;
  toggleTheme: () => void;
};

const defaultValues: ThemeContextProps = {
  theme: null,
  toggleTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextProps>(defaultValues);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeType>(null);

  const toggleTheme = async () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const initTheme = async () => {
      const loadedTheme = await loadTheme();
      setTheme(loadedTheme);
    };
    initTheme();
  }, []);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  if (theme === null) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
