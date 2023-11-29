import config from "../config";
import type { RecurringEntry } from "../types/RecurringEntry";

const fetchRecurringEntries = async (userId: string) => {
  try {
    const { API_URL, API_KEY } = config;
    const response = await fetch(`${API_URL}/api/recurring_entries`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-User-Id': userId,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Convert data to type entry.
    const entries: RecurringEntry[] = data.map((entry: any) => ({
      _id: entry._id,
      createdAt: entry.createdAt,
      nextDueDate: entry.nextDueDate,
      amount: entry.amount,
      category: entry.category,
      interval: entry.interval,
      status: entry.status,
    }));

    return entries;
  } catch (error) {
    return [];
  }
}

export default fetchRecurringEntries;
