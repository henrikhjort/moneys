import RecurringEntryModel from "../db/models/RecurringEntry";
import type { RecurringEntry, RecurringEntryInput } from "../types/RecurringEntry";
import EntryModel from "../db/models/Entry";

export const createRecurringEntry = async (entry: RecurringEntryInput, userId: string) => {
  try {
    const nextDueDate = getNextDueDate(entry.interval);
    if (!nextDueDate) return null;
    const data = {
      userId: userId,
      createdAt: new Date().toISOString(),
      amount: entry.amount,
      category: entry.category,
      status: true,
      interval: entry.interval,
      nextDueDate: nextDueDate,
    }
    const newEntry = new RecurringEntryModel(data);
    const saved = await newEntry.save();
    return saved;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUsersRecurringEntries = async (userId: string) => {
  try {
    const recurringEntries = await RecurringEntryModel.find({
      userId,
      status: true,
    }).sort({ createdAt: -1 });
    console.log('recurringEntries', recurringEntries);
    return recurringEntries;
  } catch (error) {
    return null;
  }

};

export const getRecurringEntries = async (start: string, end: string) => {  
  try {
    const recurringEntriesDueToday = await RecurringEntryModel.find({
      nextDueDate: {
        $gte: start,
        $lte: end
      }
    }).sort({ createdAt: -1 });
    return recurringEntriesDueToday;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteRecurringEntry = async (id: string, userId: string) => {
  try {
    const deleted = await RecurringEntryModel.deleteOne({
      _id: id,
      userId,
    });
    return deleted;
  } catch (error) {
    return null;
  }
};

const getNextDueDate = (interval: string) => {
  const today = new Date();
  let nextDueDate;

  switch (interval) {
    case 'daily':
      nextDueDate = new Date(today.setDate(today.getDate() + 1));
      break;
    case 'weekly':
      // Set to next Monday
      nextDueDate = new Date(today.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7)));
      break;
    case 'monthly':
      // Set to the first day of the next month
      nextDueDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      break;
    case 'yearly':
      // Set to the first day of the next year
      nextDueDate = new Date(today.getFullYear() + 1, 0, 1);
      break;
    default:
      return null;
  }

  nextDueDate.setHours(1, 0, 0, 0);

  return nextDueDate.toISOString();
};


export const processRecurringEntries = async (entries: any) => {
  try {
    entries.forEach(async (entry: any) => {
      // These entries should be processed today.
      // 1. Create a new entry in the entries collection.
      // 2. Update the nextDueDate of the recurring entry.
      const entryData = {
        userId: entry.userId,
        createdAt: new Date().toISOString(),
        amount: entry.amount,
        category: entry.category,
        recurring: entry.recurring,
      };
      const newEntry = new EntryModel(entryData);
      const created = await newEntry.save();
      if (!created) {
        console.log('Failed to create entry');
      }
      // Update the nextDueDate of the recurring entry.
      const nextDueDate = getNextDueDate(entry.interval);
      if (!nextDueDate) return;
      const updated = await RecurringEntryModel.findByIdAndUpdate(entry._id, {
        nextDueDate: nextDueDate,
      });
      if (!updated) {
        console.log('Failed to update recurring entry');
      }
    });
  } catch (error) {
    console.log(error);
  }
};