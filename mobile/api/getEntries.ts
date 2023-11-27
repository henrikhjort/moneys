import config from "../config";
import type { Entry } from "../types/Entry";
import ViewPeriod from "../types/ViewPeriod";
import { formatToHelsinkiTime } from "../utils/helpers";

const fetchEntries = async (viewPeriod: ViewPeriod = ViewPeriod.Today, userId: string) => {
  try {
    const { API_URL, API_KEY } = config;
    const response = await fetch(`${API_URL}/api/entries/${viewPeriod}`, {
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
    const entries: Entry[] = data.map((entry: any) => ({
      id: entry._id,
      createdAt: entry.createdAt,
      amount: entry.amount,
      category: entry.category,
    }));

    return entries;
  } catch (error) {
    return [];
  }
}

export default fetchEntries;
