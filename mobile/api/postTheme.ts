import config from "../config";

const postTheme = async (theme: string, userId: string) => {
  try {
    const { API_URL, API_KEY } = config;

    const response = await fetch(`${API_URL}/api/theme`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ theme: theme }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();
    return resData;
  } catch (error) {
    return null;
  }
};


export default postTheme;
