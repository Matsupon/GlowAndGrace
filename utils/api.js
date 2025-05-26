import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.API_URL ||
  process.env.API_URL ||
  'http://localhost:8000/'; // fallback for dev

export const fetchSkincareSubtypesWithProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/skincare/subtypes-products`, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      // Try to get error text for debugging
      const text = await response.text();
      throw new Error(`API error: ${response.status} - ${text}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error: ${response.status} - ${text}`);
  }
  return await response.json();
};

export const bulkDeleteProducts = async (ids) => {
  const response = await fetch(`${API_URL}/api/products/bulk-delete`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error: ${response.status} - ${text}`);
  }
  return await response.json();
};
