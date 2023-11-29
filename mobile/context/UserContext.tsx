import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import type { RecurringEntry, RecurringEntryInput } from '../types/RecurringEntry';

import { generateId, getId, setId } from '../utils/storage';
import createRecurringEntry from '../api/createRecurringEntry';
import fetchRecurringEntries from '../api/getRecurringEntries';
import deleteRecurringEntry from '../api/deleteRecurringEntry';
import getCategories from '../api/getCategories';

type UserContextProps = {
  userId: string | null;
  setUserId: (userId: string) => void;
  customCategories: string[];
  setCustomCategories: (customCategories: string[]) => void;
  recurringEntries: RecurringEntry[];
  setRecurringEntries: (recurringEntries: RecurringEntry[]) => void;
  saveRecurringEntry: (data: RecurringEntryInput) => void;
  removeRecurringEntry: (id: string) => void;
};

const defaultValues: UserContextProps = {
  userId: null,
  setUserId: () => {},
  customCategories: [],
  setCustomCategories: () => {},
  recurringEntries: [],
  setRecurringEntries: () => {},
  saveRecurringEntry: () => {},
  removeRecurringEntry: () => {},
};

export const UserContext = createContext<UserContextProps>(defaultValues);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [recurringEntries, setRecurringEntries] = useState<RecurringEntry[]>([]);
  console.log(recurringEntries);

  const saveRecurringEntry = async (data: RecurringEntryInput) => {
    if (!userId) return;
    const res = await createRecurringEntry(data, userId);
    if (res === null) {
      throw new Error('Could not save recurring entry');
    }
    const recurringEntry: RecurringEntry = {
      _id: res._id,
      amount: res.amount,
      category: res.category,
      interval: res.interval,
      createdAt: new Date(res.createdAt).toISOString(),
      status: res.status,
      nextDueDate: new Date(res.nextDueDate).toISOString(),
    };
    setRecurringEntries([recurringEntry, ...recurringEntries]);
  };

  const removeRecurringEntry = async (id: string) => {
    if (!userId) return;
    const deleted = await deleteRecurringEntry(id, userId);
    if (!deleted) {
      throw new Error('Could not delete recurring entry');
    }
    setRecurringEntries(recurringEntries.filter((entry) => entry._id !== id));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userId) return;
      try {
        const categories = await getCategories(userId);
        setCustomCategories(categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
    const fetchRecurring = async () => {
      if (!userId) return;
      try {
        const entries = await fetchRecurringEntries(userId);
        setRecurringEntries(entries);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRecurring();
  }, [userId]);

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

  return (
    <UserContext.Provider value={{
      userId,
      setUserId,
      customCategories,
      setCustomCategories,
      recurringEntries,
      setRecurringEntries,
      saveRecurringEntry,
      removeRecurringEntry,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
