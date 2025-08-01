import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type {
    LoginCredentials,
    RegisterData,
    AuthResponse,
    User,
    RootResponse,
    HomeResponse,
    LoginPageResponse
} from '../types';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

//Add request interceptor to include token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

//Auth API calls
export const authAPI = {
    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await api.post('/api/auth/register', userData);
        return response.data;
    },

     // Login user
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await api.post('/api/auth/login', credentials);
        return response.data;
    },

    // Get current user info
    getCurrentUser: async (): Promise<{ user: User }> => {
        const response: AxiosResponse<{ user: User }> = await api.get('/api/auth/me');
        return response.data;
    },
}

// Main routes API calls
export const mainAPI = {
    // Check root endpoint
    checkRoot: async (): Promise<RootResponse> => {
        const response: AxiosResponse<RootResponse> = await api.get('/');
        return response.data;
    },

    // Get home page data
    getHome: async (): Promise<HomeResponse> => {
        const response: AxiosResponse<HomeResponse> = await api.get('/home');
        return response.data;
    },

    // Get login page data
    getLogin: async (): Promise<LoginPageResponse> => {
        const response: AxiosResponse<LoginPageResponse> = await api.get('/login');
        return response.data;
    },
};

// Utility functions
export const tokenUtils = {
    setToken: (token: string): void => {
        localStorage.setItem('token', token);
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    removeToken: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    setUser: (user: User): void => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser: (): User | null => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('token');
        return !!token;
    },
};

export default api;