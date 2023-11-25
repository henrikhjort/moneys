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

export const getStartOfTodayUTC = () => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now.toISOString();
};

export const getEndOfTodayUTC = () => {
  const now = new Date();
  now.setUTCHours(23, 59, 59, 999);
  return now.toISOString();
};

export const getStartOfWeekUTC = () => {
  const now = new Date();
  const dayOfWeek = now.getUTCDay() || 7; // Get day of the week, convert Sunday (0) to 7
  if (dayOfWeek !== 1) {
    now.setUTCDate(now.getUTCDate() - dayOfWeek + 1); // Adjust to previous Monday
  }
  now.setUTCHours(0, 0, 0, 0);
  return now.toISOString();
};

export const getStartOfMonthUTC = () => {
  const now = new Date();
  now.setUTCDate(1); // Set to the first day of the current month
  now.setUTCHours(0, 0, 0, 0);
  return now.toISOString();
};

