import config from "../config";

const deleteCategory = async (category: string, userId: string) => {
  let status = 500;
  try {
    const { API_URL, API_KEY } = config;

    // Function to format the category string
    const formatCategory = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const formattedCategory = formatCategory(category);

    const response = await fetch(`${API_URL}/api/categories/${category}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ category: formattedCategory }),
    });
    status = response.status;
    if (!response.ok) {
      return null;
    }

    const resData = await response.json();
    return resData.category;
  } catch (error) {
    return null;
  }
};


export default deleteCategory;
