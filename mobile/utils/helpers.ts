import Category from "../types/Category";
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

export const getEmojiForCategory = (category: Category | null): string => {
  if (!category) return '';
  switch (category) {
    case Category.CAR:
      return '🚗'; // Emoji for CAR
    case Category.FOOD:
      return '🍔'; // Emoji for FOOD
    case Category.DRINK:
      return '🍹'; // Emoji for DRINK
    case Category.ALCOHOL:
      return '🍷'; // Emoji for ALCOHOL
    case Category.GAMES:
      return '🎮'; // Emoji for GAMES
    case Category.ELECTRONICS:
      return '💻'; // Emoji for ELECTRONICS
    case Category.NICOTINE:
      return '🚬'; // Emoji for NICOTINE
    case Category.TRAVEL:
      return '✈️'; // Emoji for TRAVEL
    default:
      return '❓'; // Default emoji if no match is found
  }
};

export const sortEntriesByDate = (entries: Entry[]) => {
  return entries.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}
