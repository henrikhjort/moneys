import type { Entry } from '../types/Entry';

// 192.168.1.244
const createEntry = async (data: Entry) => {
  try {
    const response = await fetch('http://192.168.1.244:8000/api/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    return null; // Or handle the error as you see fit
  }
}

export default createEntry;
