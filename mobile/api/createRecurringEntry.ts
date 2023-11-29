import config from "../config";
import type { RecurringEntryInput, RecurringEntry } from "../types/RecurringEntry";

const createRecurringEntry = async (data: RecurringEntryInput, userId: string) => {
  try {
    const formatCategory = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
    const dataToSend = {
      ...data,
      category: formatCategory(data.category),
    }
    const { API_URL, API_KEY } = config;
    const response = await fetch(`${API_URL}/api/recurring_entries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify(dataToSend),
    });
    if (!response.ok) {
      return null;
    }

    const resData = await response.json();
    const entry = {}
    return resData.recurringEntry;
  } catch (error) {
    return null;
  }
}

export default createRecurringEntry;
