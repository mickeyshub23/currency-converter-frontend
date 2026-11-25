import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import api, { getToken, setToken, clearToken, setUser } from '../api';

const AuthContext = createContext(null);

const TEMP_TOKEN_KEY = 'temp_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [accessToken, setAccessToken] = useState(getToken());

  const isAuthenticated = Boolean(accessToken);
  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  const loginStep1 = useCallback(async (email, password) => {
    const { data } = await api.post('/api/login', { email, password });
    if (!data.tempToken) throw new Error('Unexpected server response');
    localStorage.setItem(TEMP_TOKEN_KEY, data.tempToken);
    return data.tempToken;
  }, []);

  const registerStep1 = useCallback(async (name, email, password) => {
    const { data } = await api.post('/api/register', { name, email, password });
    if (!data.tempToken) throw new Error('Unexpected server response');
    localStorage.setItem(TEMP_TOKEN_KEY, data.tempToken);
    return data.tempToken;
  }, []);

  const registerVerify = useCallback(async (otp) => {
    const tempToken = localStorage.getItem(TEMP_TOKEN_KEY);
    if (!tempToken) throw new Error('Session expired. Please register again.');
    const { data } = await api.post('/api/register/verify', { tempToken, otp });
    if (data.redirectUrl) {
      localStorage.removeItem(TEMP_TOKEN_KEY);
    }
    return data;
  }, []);

  const adminLoginStep1 = useCallback(async (email, password) => {
    const { data } = await api.post('/api/admin/login', { email, password });
    if (!data.tempToken) throw new Error('Unexpected server response');
    localStorage.setItem(TEMP_TOKEN_KEY, data.tempToken);
    return data.tempToken;
  }, []);

  const verifyOtp = useCallback(async (otp, isAdminLogin) => {
    const tempToken = localStorage.getItem(TEMP_TOKEN_KEY);
    if (!tempToken) throw new Error('Session expired. Please log in again.');
    const endpoint = isAdminLogin ? '/api/admin/verify-otp' : '/api/verify-otp';
    const { data } = await api.post(endpoint, { tempToken, otp });
    const token = data.accessToken;
    if (!token) throw new Error('Unexpected server response');
    localStorage.removeItem(TEMP_TOKEN_KEY);
    setToken(token);
    setAccessToken(token);
    setUser(data.user || null);
    return data;
  }, []);

  const resendOtp = useCallback(async () => {
    const tempToken = localStorage.getItem(TEMP_TOKEN_KEY);
    if (!tempToken) throw new Error('Session expired. Please log in again.');
    const { data } = await api.post('/api/resend-otp', { tempToken });
    return data;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TEMP_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isAdmin,
    loginStep1,
    adminLoginStep1,
    registerStep1,
    verifyOtp,
    registerVerify,
    resendOtp,
    logout,
  }), [user, isAuthenticated, isAdmin, loginStep1, adminLoginStep1, registerStep1, verifyOtp, registerVerify, resendOtp, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;