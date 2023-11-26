import config from "../config";
import type { Entry } from '../types/Entry';

const createEntry = async (data: Entry, userId: string) => {
  try {
    const { API_URL, API_KEY } = config;
    const response = await fetch(`${API_URL}/api/entries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();
    return resData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export default createEntry;
