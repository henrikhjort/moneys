import config from "../config";

type CreateCategoryRes = {
  status: number;
  category?: string;
}

const createCategory = async (category: string, userId: string): Promise<CreateCategoryRes> => {
  let status = 500;
  try {
    const { API_URL, API_KEY } = config;

    // Function to format the category string
    const formatCategory = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const formattedCategory = formatCategory(category);

    const response = await fetch(`${API_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ category: formattedCategory }),
    });
    status = response.status;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();
    return { status, category: resData.category };
  } catch (error) {
    return { status };
  }
};


export default createCategory;
