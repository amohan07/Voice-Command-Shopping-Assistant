import axios from 'axios';

// ✅ Base URL is relative since Flask serves both frontend + backend
const API_BASE_URL = '/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generate a simple user ID for demo purposes
const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export const apiService = {
  // Categories
  getCategories: () => api.get('/categories'),

  // Substitutes
  getSubstitutes: () => api.get('/substitutes'),

  // Seasonal suggestions
  getSeasonalSuggestions: () => api.get('/seasonal'),

  // Product search
  searchProducts: (query, filters) => api.post('/search', { query, filters }),

  // Shopping list operations
  getShoppingList: () => api.get(`/shopping-list/${getUserId()}`),

  updateShoppingList: (items) => api.post(`/shopping-list/${getUserId()}`, { items }),

  addItem: (name, qty) => api.post(`/shopping-list/${getUserId()}/add`, { name, qty }),

  removeItem: (name, qty) => api.post(`/shopping-list/${getUserId()}/remove`, { name, qty }),

  clearShoppingList: () => api.post(`/shopping-list/${getUserId()}/clear`),

  // History
  getHistory: () => api.get(`/history/${getUserId()}`),

  // Categorize item
  categorizeItem: (name) => api.post('/categorize', { name }),
};

export default apiService;
