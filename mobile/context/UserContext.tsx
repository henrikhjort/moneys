import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { generateId, getId, setId } from '../utils/storage';
import getCategories from '../api/getCategories';

type UserContextProps = {
  userId: string | null;
  setUserId: (userId: string) => void;
  customCategories: string[];
  setCustomCategories: (customCategories: string[]) => void;
};

const defaultValues: UserContextProps = {
  userId: null,
  setUserId: () => {},
  customCategories: [],
  setCustomCategories: () => {},
};

export const UserContext = createContext<UserContextProps>(defaultValues);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);

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
    <UserContext.Provider value={{ userId, setUserId, customCategories, setCustomCategories }}>
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
