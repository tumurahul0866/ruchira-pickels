/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { resolveApiUrl } from '../services/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('vasuki_token');
      if (storedToken) {
        try {
          const resp = await fetch(resolveApiUrl('/auth/profile'), {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (resp.ok) {
            const profile = await resp.json();
            setUser(profile);
            setIsAdmin(Boolean(profile.isAdmin));
            localStorage.setItem('vasuki_user', JSON.stringify(profile));
          } else {
            localStorage.removeItem('vasuki_token');
            localStorage.removeItem('vasuki_user');
          }
        } catch {
          const storedUser = localStorage.getItem('vasuki_user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setIsAdmin(Boolean(parsed.isAdmin));
          }
        }
      }
      setAuthReady(true);
    };

    initializeAuth();

    const handleAuthExpired = () => {
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('vasuki_user');
      localStorage.removeItem('vasuki_token');
    };

    window.addEventListener('vasuki:auth-expired', handleAuthExpired);
    return () => window.removeEventListener('vasuki:auth-expired', handleAuthExpired);
  }, []);

  const setAuthState = (profile, token) => {
    setUser(profile);
    setIsAdmin(Boolean(profile?.isAdmin));
    localStorage.setItem('vasuki_user', JSON.stringify(profile));
    localStorage.setItem('vasuki_token', token);
  };

  const parseErrorMessage = async (resp) => {
    try {
      const body = await resp.json();
      if (body && (body.error || body.message)) return body.error || body.message;
      return JSON.stringify(body || {});
    } catch {
      try {
        const text = await resp.text();
        return text || resp.statusText || 'An unknown error occurred.';
      } catch {
        return resp.statusText || 'An unknown error occurred.';
      }
    }
  };

  const loginUser = async (email, password) => {
    try {
      const resp = await fetch(resolveApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!resp.ok) {
        const message = await parseErrorMessage(resp);
        return { ok: false, message: message || 'Invalid credentials' };
      }
      const data = await resp.json();
      setAuthState({ id: data.id, name: data.name, email: data.email, isAdmin: Boolean(data.isAdmin) }, data.token);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Unable to connect to the server.' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const resp = await fetch(resolveApiUrl('/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) {
        const message = await parseErrorMessage(resp);
        return { ok: false, message: message || 'Unable to process request' };
      }
      const data = await resp.json();
      return { ok: true, message: data.message };
    } catch {
      return { ok: false, message: 'Unable to connect to the server.' };
    }
  };

  const verifyResetOtp = async (email, otp) => {
    try {
      const resp = await fetch(resolveApiUrl('/auth/verify-reset-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (!resp.ok) {
        const message = await parseErrorMessage(resp);
        return { ok: false, message: message || 'Invalid verification code' };
      }
      const data = await resp.json();
      return { ok: true, resetToken: data.resetToken };
    } catch {
      return { ok: false, message: 'Unable to connect to the server.' };
    }
  };

  const resetPassword = async (email, resetToken, newPassword) => {
    try {
      const resp = await fetch(resolveApiUrl('/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetToken, newPassword }),
      });
      if (!resp.ok) {
        const message = await parseErrorMessage(resp);
        return { ok: false, message: message || 'Unable to reset password' };
      }
      const data = await resp.json();
      return { ok: true, message: data.message };
    } catch {
      return { ok: false, message: 'Unable to connect to the server.' };
    }
  };

  const registerUser = async (data) => {
    try {
      const resp = await fetch(resolveApiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!resp.ok) {
        const message = await parseErrorMessage(resp);
        return { ok: false, message: message || 'Unable to register' };
      }
      const body = await resp.json();
      setAuthState({ id: body.id, name: body.name, email: body.email, isAdmin: Boolean(body.isAdmin) }, body.token);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Unable to connect to the server.' };
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const resp = await fetch(resolveApiUrl('/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!resp.ok) {
        const error = await resp.json().catch(() => ({}));
        return { ok: false, message: error.error || 'Invalid admin credentials' };
      }
      const data = await resp.json();
      setAuthState({ id: 'admin', name: data.name || 'Administrator', email: data.email, isAdmin: true }, data.token);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Unable to connect to the server.' };
    }
  };

  const changeAdminPassword = async (currentPassword, newPassword) => {
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return false;
    }

    try {
      const token = localStorage.getItem('vasuki_token');
      if (!token) return false;
      const response = await fetch(resolveApiUrl('/admin-credentials/password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const changeAdminEmail = async (currentPassword, newEmail) => {
    if (!currentPassword || !newEmail || !newEmail.includes('@')) {
      return false;
    }

    try {
      const token = localStorage.getItem('vasuki_token');
      if (!token) return false;
      const response = await fetch(resolveApiUrl('/admin-credentials/email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newEmail }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      setUser((prev) => ({ ...prev, email: data.email }));
      localStorage.setItem('vasuki_user', JSON.stringify({ ...user, email: data.email }));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('vasuki_user');
    localStorage.removeItem('vasuki_token');
  };

  const getAdminEmail = () => user?.email || '';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        authReady,
        loginUser,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        registerUser,
        loginAdmin,
        changeAdminPassword,
        changeAdminEmail,
        getAdminEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
