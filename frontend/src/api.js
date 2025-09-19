import axios from 'axios';
import { toast } from "sonner"; // For notifications

// Use VITE_API_BASE_URL for deployed backend, or localhost for local dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // Not typically needed for JWT authentication in header
});

// Interceptor to attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (e.g., token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to prevent infinite loops
      // Unauthorized. Could be token expired or invalid.
      // Log out user and redirect to login
      localStorage.removeItem('user');
      toast.error("Session expired or unauthorized. Please log in again.");
      setTimeout(() => {
        window.location.reload(); // Reloads the page, Layout will prompt login
      }, 1500);
    }
    return Promise.reject(error);
  }
);

// --- User Entity Replacement ---
export const User = {
  me: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      try {
        const response = await api.get('/auth/me');
        // Update user in localStorage with fresh data from backend, keep token
        localStorage.setItem('user', JSON.stringify({ ...response.data, token: user.token }));
        return response.data;
      } catch (error) {
        // If /me fails, token might be expired. Let interceptor handle 401.
        throw new Error("User not authenticated or session expired.");
      }
    }
    throw new Error("User not authenticated.");
  },
  login: async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('user', JSON.stringify(response.data)); // Store user data including token
    return response.data;
  },
  register: async ({ email, password, fullName }) => {
    const response = await api.post('/auth/register', { email, password, fullName });
    localStorage.setItem('user', JSON.stringify(response.data)); // Store user data including token
    return response.data;
  },
  logout: async () => {
    localStorage.removeItem('user');
    window.location.reload(); // Reload to reflect logout state
  },
  // Removed updateMyUserData as it's not in the simplified backend controller
};

// --- Entity Factories (CRUD operations) ---
const createCrudApi = (entityPath) => ({
  list: async (orderBy = 'createdAt', orderDirection = 'desc', limit = 100, filters = {}) => {
    const response = await api.get(`/${entityPath}`, {
      params: { orderBy, orderDirection, limit, ...filters },
    });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post(`/${entityPath}`, data);
    return response.data;
  },
  update: async (id, data) => {
    // Note: Update is not supported for SearchHistory in this simplified backend
    // but included for consistency if other entities were here.
    console.warn(`Update not supported for ${entityPath}`);
    const response = await api.put(`/${entityPath}/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    // Note: Delete is not supported for SearchHistory in this simplified backend
    console.warn(`Delete not supported for ${entityPath}`);
    await api.delete(`/${entityPath}/${id}`);
    return { id };
  },
});

export const SearchHistory = createCrudApi('search-histories');


// --- LLM Integration Replacement ---
export const InvokeLLM = async (payload) => {
  const response = await api.post('/llm/invoke', payload);
  return response.data;
};

// --- Other Integrations (Removed/Placeholders) ---
// These are not implemented in the backend, so they will log warnings
export const UploadFile = async ({ file }) => {
  console.warn("UploadFile not implemented on backend.");
  toast.info("File upload is not yet implemented on the backend.");
  return { file_url: `https://placeholder.com/${file.name}` };
};
export const SendEmail = async (payload) => {
  console.warn("SendEmail not implemented on backend.");
  toast.info("Email sending is not yet implemented on the backend.");
  return { status: "mock_success" };
};
export const GenerateImage = async (payload) => {
  console.warn("GenerateImage not implemented on backend.");
  toast.info("Image generation is not yet implemented on the backend.");
  return { url: "https://via.placeholder.com/400x300?text=Image+Mock" };
};
// Removed ExtractDataFromUploadedFile, CreateFileSignedUrl, UploadPrivateFile as they are Base44 specific integrations
