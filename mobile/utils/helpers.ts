import { Entry } from "../types/Entry";

export const getHelsinkiTimeString = () => {
  // Create a new date object for the current time
  const now = new Date();

  // Format the date to Helsinki time zone
  const helsinkiTime = now.toLocaleString('en-US', {
    timeZone: 'Europe/Helsinki',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return helsinkiTime;
};

export const formatToHelsinkiTime = (isoDateTimeString: string) => {
  // Parse the ISO string to a Date object
  const date = new Date(isoDateTimeString);

  // Format the date to Helsinki time zone
  const helsinkiTime = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Helsinki',
    hour12: false,
  }).format(date);

  // Extract the date parts and reformat
  const dateParts = helsinkiTime.match(/(\d+).(\d+).(\d+), (\d+):(\d+)/);
  if (!dateParts) throw new Error('Invalid date');

  // Reformat to "dd.mm.yyyy hh:mm"
  return `${dateParts[1]}.${dateParts[2]}.${dateParts[3]} ${dateParts[4]}:${dateParts[5]}`;
};

export const sortEntriesByDate = (entries: Entry[]) => {
  return entries.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
};

export const getDefaultCategories = (): string[] => {
  return [
    'Food 🍔',
    'Drink 🍹',
    'Travel 🚀',
    'Car 🚗',
    'Electronics 📱',
    'Other ❓',
  ];
};