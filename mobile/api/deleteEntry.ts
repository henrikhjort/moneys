import config from "../config";

const deleteEntry = async (id: string, userId: string) => {
  try {
    const { API_URL, API_KEY } = config;
    const response = await fetch(`${API_URL}/api/entries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();
    return resData;
  } catch (error) {
    return null;
  }
}

export default deleteEntry;
