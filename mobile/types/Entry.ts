export type Entry = {
  id?: string;
  createdAt: string;
  amount: number;
  category: string;
  recurring?: boolean;
};