import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeType = 'light' | 'dark';

type ThemeContextProps = {
  theme: ThemeType;
  toggleTheme: () => void;
};

const defaultValues: ThemeContextProps = {
  theme: 'light', // Default theme
  toggleTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextProps>(defaultValues);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  const toggleTheme = () => {
    console.log('toggleTheme');
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

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
