// 192.168.1.244
import type { Entry } from "../types/Entry";
import ViewPeriod from "../types/ViewPeriod";

const fetchEntries = async (viewPeriod: ViewPeriod = ViewPeriod.Today) => {
  try {
    const response = await fetch(`http://192.168.1.244:8000/api/entries/${viewPeriod}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Convert data to type entry.
    const entries: Entry[] = data.map((entry: any) => ({
      createdAt: entry.createdAt,
      amount: entry.amount,
      category: entry.category,
    }));

    return entries;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export default fetchEntries;
