const API_BASE_URL = 'http://localhost:5000/api'; // Backend adresi

export const fetchBooks = async () => {
  const response = await fetch(`${API_BASE_URL}/books`);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return await response.json();
};
