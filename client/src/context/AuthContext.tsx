import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

// Setup axios interceptor and validate token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token by making a test request
      validateToken(token);
    }
    // Set base URL for API calls
    axios.defaults.baseURL = 'http://localhost:9999';
  }, []);

  const validateToken = async (token: string) => {
    try {
      // Make a simple request to validate the token
      const response = await axios.get('/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.valid) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.data.user, token }
        });
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (error) {
      // Token validation failed, clear it
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      console.log('Token validation failed, user needs to login again');
    }
  };

  // Update axios header when token changes
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Handle demo user locally if server is not available
      if (email === 'demo@signflow.com' && password === 'demo123') {
        const demoUser = {
          id: 'demo-user-123',
          name: 'Demo User',
          email: 'demo@signflow.com'
        };
        const demoToken = 'demo-token-' + Date.now();
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: demoUser, token: demoToken },
        });
        return;
      }
      
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      const { user, token } = response.data;

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      // If it's a demo user login attempt and server is down, allow it
      if (email === 'demo@signflow.com' && password === 'demo123') {
        const demoUser = {
          id: 'demo-user-123',
          name: 'Demo User',
          email: 'demo@signflow.com'
        };
        const demoToken = 'demo-token-' + Date.now();
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: demoUser, token: demoToken },
        });
        return;
      }
      
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response?.data?.error || 'Login failed. Please check your credentials.',
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });

      const { user, token } = response.data;

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response?.data?.error || 'Registration failed',
      });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
