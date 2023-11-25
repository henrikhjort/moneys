import Category from './Category';

export type Entry = {
  id?: string;
  createdAt: string;
  amount: number;
  category: Category;
};