import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { Screen } from '../types/Screen';
import { Entry } from '../types/Entry';
import ViewPeriod from '../types/ViewPeriod';

import getEntries from '../api/getEntries';

interface UserContextProps {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  viewPeriod: ViewPeriod;
  setViewPeriod: (viewPeriod: ViewPeriod) => void;
  cumulativeAmount: number;
  fetchEntries: (viewPeriod: ViewPeriod) => void;
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

  const fetchEntries = async (viewPeriod: ViewPeriod) => {
    const entries = await getEntries(viewPeriod);
    setEntries(entries);
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
      fetchEntries
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
