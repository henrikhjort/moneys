import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { Screen } from '../types/Screen';
import { Entry } from '../types/Entry';
import ViewPeriod from '../types/ViewPeriod';

import getEntries from '../api/getEntries';
import deleteEntry from '../api/deleteEntry';

interface UserContextProps {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  viewPeriod: ViewPeriod;
  setViewPeriod: (viewPeriod: ViewPeriod) => void;
  cumulativeAmount: number;
  fetchEntries: (viewPeriod: ViewPeriod) => void;
  handleDeleteEntry: (id: string) => void;
  isLoading: boolean;
}

export const AppContext = createContext<UserContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.INPUT);
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>(ViewPeriod.Today);
  const [cumulativeAmount, setCumulativeAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchEntries = async (viewPeriod: ViewPeriod) => {
    const entries = await getEntries(viewPeriod);
    setEntries(entries);
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteEntry(id);
      const newEntries = entries.filter((entry) => entry.id !== id);
      setEntries(newEntries);
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetch = async () => {
      await fetchEntries(viewPeriod);
    }
    fetch();
  }, [viewPeriod]);

  useEffect(() => {
    const cumulativeAmount = getCumulativeAmount(entries);
    setCumulativeAmount(cumulativeAmount);
  }, [entries]);

  const getCumulativeAmount = (entries: Entry[]) => {
    return entries.reduce((acc, entry) => acc + entry.amount, 0);
  };

  return (
    <AppContext.Provider value={{ 
      entries,
      setEntries,
      currentScreen,
      setCurrentScreen,
      viewPeriod,
      setViewPeriod,
      cumulativeAmount,
      fetchEntries,
      handleDeleteEntry,
      isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
