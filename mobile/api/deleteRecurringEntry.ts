import config from "../config";

const deleteRecurringEntry = async (id: string, userId: string) => {
  let status = 500;
  try {
    const { API_URL, API_KEY } = config;

    const response = await fetch(`${API_URL}/api/recurring_entries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
    });
    status = response.status;
    if (!response.ok) {
      return null;
    }

    const resData = await response.json();
    return resData.entry;
  } catch (error) {
    return null;
  }
};


export default deleteRecurringEntry;
