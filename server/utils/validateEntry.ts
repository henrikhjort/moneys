import type { Entry } from '../types/Entry';

const validateEntry = (entry: Entry): boolean => {
  const { createdAt, amount, category } = entry;

  if (!category) {
    return false;
  }

  // Parse createdAt to a Date object
  const parsedDate = new Date(createdAt);

  // Check if parsedDate is a valid Date
  if (!(parsedDate instanceof Date && !isNaN(parsedDate.valueOf()))) {
    return false;
  }

  // Check if amount is a number
  if (typeof amount !== 'number' || isNaN(amount)) {
    return false;
  }

  return true;
};

export default validateEntry;
