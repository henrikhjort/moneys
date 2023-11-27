import config from "../config";

const getThemeStats = async (userId: string) => {
  try {
    const { API_URL, API_KEY } = config;
    const response = await fetch(`${API_URL}/api/theme`, {
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
    return data;
  } catch (error) {
    return [];
  }
}

export default getThemeStats;
