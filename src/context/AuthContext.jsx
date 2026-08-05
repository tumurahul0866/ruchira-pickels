import React, { createContext, useContext, useState, useEffect } from 'react';

const ADMIN_EMAIL_KEY = 'vasuki_admin_email';
const ADMIN_PASS_KEY = 'vasuki_admin_password';
const ADMIN_SESSION_KEY = 'vasuki_admin';
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL?.trim().replace(/\/$/, '') || '';
const ADMIN_CREDENTIALS_API = BACKEND_BASE ? `${BACKEND_BASE}/api/admin-credentials` : '/api/admin-credentials';

// Obfuscated defaults so they're not plainly readable in source:
// Base64 of 'admin@vasukipickles.com'
const _DEFAULT_EMAIL = atob('YWRtaW5AdmFzdWtpcGlja2xlcy5jb20=');
// Base64 of 'Admin@123'
const _DEFAULT_PASS = atob('QWRtaW5AMTIz');

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    email: _DEFAULT_EMAIL,
    password: _DEFAULT_PASS,
  });

  useEffect(() => {
    const initialiseAdminAuth = async () => {
      const legacyEmail = (localStorage.getItem(ADMIN_EMAIL_KEY) || _DEFAULT_EMAIL).trim().toLowerCase();
      const legacyPass = (localStorage.getItem(ADMIN_PASS_KEY) || _DEFAULT_PASS).trim();

      if (!localStorage.getItem(ADMIN_EMAIL_KEY)) {
        localStorage.setItem(ADMIN_EMAIL_KEY, legacyEmail);
      }
      if (!localStorage.getItem(ADMIN_PASS_KEY)) {
        localStorage.setItem(ADMIN_PASS_KEY, legacyPass);
      }

      try {
        const response = await fetch(ADMIN_CREDENTIALS_API);
        if (response.ok) {
          const remoteCredentials = await response.json();
          const syncedEmail = (remoteCredentials.email || legacyEmail).trim().toLowerCase();
          const syncedPass = (remoteCredentials.password || legacyPass).trim();
          setAdminCredentials({ email: syncedEmail, password: syncedPass });
          localStorage.setItem(ADMIN_EMAIL_KEY, syncedEmail);
          localStorage.setItem(ADMIN_PASS_KEY, syncedPass);
        } else {
          setAdminCredentials({ email: legacyEmail, password: legacyPass });
        }
      } catch {
        setAdminCredentials({ email: legacyEmail, password: legacyPass });
      }

      const storedUser = localStorage.getItem('vasuki_user');
      const storedAdmin = localStorage.getItem(ADMIN_SESSION_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedAdmin === 'true') setIsAdmin(true);
    };

    initialiseAdminAuth();
  }, []);

  const loginUser = (email, password) => {
    const mockUser = { id: '1', name: 'Customer', email };
    setUser(mockUser);
    localStorage.setItem('vasuki_user', JSON.stringify(mockUser));
    return true;
  };

  const registerUser = (data) => {
    const mockUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    setUser(mockUser);
    localStorage.setItem('vasuki_user', JSON.stringify(mockUser));
    return true;
  };

  const loginAdmin = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const response = await fetch(ADMIN_CREDENTIALS_API);
      if (response.ok) {
        const remoteCredentials = await response.json();
        const storedEmail = (remoteCredentials.email || adminCredentials.email).trim().toLowerCase();
        const storedPass = (remoteCredentials.password || adminCredentials.password).trim();

        if (cleanEmail === storedEmail && cleanPassword === storedPass) {
          setAdminCredentials({ email: storedEmail, password: storedPass });
          setIsAdmin(true);
          localStorage.setItem(ADMIN_SESSION_KEY, 'true');
          localStorage.setItem(ADMIN_EMAIL_KEY, storedEmail);
          localStorage.setItem(ADMIN_PASS_KEY, storedPass);
          return true;
        }
      }
    } catch {
      // Fall back to the last locally cached values if the server is unavailable.
    }

    const storedEmail = (adminCredentials.email || _DEFAULT_EMAIL).trim().toLowerCase();
    const storedPass = (adminCredentials.password || _DEFAULT_PASS).trim();
    if (cleanEmail === storedEmail && cleanPassword === storedPass) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  };

  const changeAdminPassword = async (currentPassword, newPassword) => {
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return false;
    }

    try {
      const response = await fetch(`${ADMIN_CREDENTIALS_API}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        return false;
      }

      const updatedCredentials = await response.json();
      setAdminCredentials((prev) => ({ ...prev, password: updatedCredentials.password }));
      localStorage.setItem(ADMIN_PASS_KEY, updatedCredentials.password);
      return true;
    } catch {
      return false;
    }
  };

  const changeAdminEmail = async (currentPassword, newEmail) => {
    if (!currentPassword || !newEmail || !newEmail.includes('@')) {
      return false;
    }

    try {
      const response = await fetch(`${ADMIN_CREDENTIALS_API}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newEmail }),
      });

      if (!response.ok) {
        return false;
      }

      const updatedCredentials = await response.json();
      setAdminCredentials((prev) => ({ ...prev, email: updatedCredentials.email }));
      localStorage.setItem(ADMIN_EMAIL_KEY, updatedCredentials.email);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('vasuki_user');
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const getAdminEmail = () => adminCredentials.email;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loginUser,
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
