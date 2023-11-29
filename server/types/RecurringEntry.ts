export interface RecurringEntryInput {
  amount: number;
  category: string;
  interval: string;
  effectiveImmediately: boolean;
}

export interface RecurringEntry extends RecurringEntryInput {
  _id: string;
  userId: string;
  createdAt: string;
  status: boolean;
  nextDueDate: string;
}