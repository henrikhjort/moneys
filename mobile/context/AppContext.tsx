import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { Screen } from '../types/Screen';
import { Entry } from '../types/Entry';
import ViewPeriod from '../types/ViewPeriod';

import getEntries from '../api/getEntries';
import deleteEntry from '../api/deleteEntry';

import { generateId, getId, setId } from '../utils/storage';

interface UserContextProps {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  viewPeriod: ViewPeriod;
  setViewPeriod: (viewPeriod: ViewPeriod) => void;
  cumulativeAmount: number;
  fetchEntries: (viewPeriod: ViewPeriod) => void;
  handleDeleteEntry: (id: string) => Promise<void>;
  isRefreshing: boolean;
  setIsRefreshing: (isRefreshing: boolean) => void;
  eurosSpentToday: number;
  userId: string;
  entryDeleted: boolean;
  isBrowsingCategories: boolean;
  setIsBrowsingCategories: (isBrowsingCategories: boolean) => void;
}

export const AppContext = createContext<UserContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [userId, setUserId] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.INPUT);
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>(ViewPeriod.Today);
  const [cumulativeAmount, setCumulativeAmount] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [eurosSpentToday, setEurosSpentToday] = useState<number>(0);
  const [entryDeleted, setEntryDeleted] = useState<boolean>(false);
  const [isBrowsingCategories, setIsBrowsingCategories] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getId();
      if (!id) {
        const newId = generateId();
        await setId(newId);
        setUserId(newId);
      } else {
        setUserId(id);
      }
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    if (entryDeleted) {
      setTimeout(() => {
        setEntryDeleted(false);
      }, 1000);
    }
  }, [entryDeleted])

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const entriesToday = entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startDate && entryDate < endDate;
    });

    const eurosSpentToday = entriesToday.reduce((acc, entry) => acc + entry.amount, 0);
    setEurosSpentToday(eurosSpentToday);
  }, [entries]);


  const fetchEntries = async (viewPeriod: ViewPeriod) => {
    setIsRefreshing(true);
    const entries = await getEntries(viewPeriod, userId);
    setEntries(entries);
    setIsRefreshing(false);
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteEntry(id, userId);
      const newEntries = entries.filter((entry) => entry.id !== id);
      setEntries(newEntries);
      setEntryDeleted(true);
    } catch (error) {
      // Do nothing.
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
      isRefreshing,
      setIsRefreshing,
      eurosSpentToday,
      userId,
      entryDeleted,
      isBrowsingCategories,
      setIsBrowsingCategories,
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
