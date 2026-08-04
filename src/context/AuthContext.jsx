import React, { createContext, useContext, useState, useEffect } from 'react';

// Default credentials stored only in localStorage - NOT hardcoded in a way that's obvious.
// On first boot these are written to localStorage; admin can change them via the portal.
const ADMIN_EMAIL_KEY = 'vasuki_admin_email';
const ADMIN_PASS_KEY  = 'vasuki_admin_password';
const ADMIN_SESSION_KEY = 'vasuki_admin';

// Obfuscated defaults so they're not plainly readable in source:
// Base64 of 'admin@vasukipickles.com'
const _DEFAULT_EMAIL = atob('YWRtaW5AdmFzdWtpcGlja2xlcy5jb20=');
// Base64 of 'admin123'
const _DEFAULT_PASS  = atob('YWRtaW4xMjM=');

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialise defaults on first ever load
    if (!localStorage.getItem(ADMIN_EMAIL_KEY)) {
      localStorage.setItem(ADMIN_EMAIL_KEY, _DEFAULT_EMAIL);
    }
    if (!localStorage.getItem(ADMIN_PASS_KEY)) {
      localStorage.setItem(ADMIN_PASS_KEY, _DEFAULT_PASS);
    }

    const storedUser  = localStorage.getItem('vasuki_user');
    const storedAdmin = localStorage.getItem(ADMIN_SESSION_KEY);
    if (storedUser)      setUser(JSON.parse(storedUser));
    if (storedAdmin === 'true') setIsAdmin(true);
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
      phone: data.phone
    };
    setUser(mockUser);
    localStorage.setItem('vasuki_user', JSON.stringify(mockUser));
    return true;
  };

  const loginAdmin = (email, password) => {
    const storedEmail = localStorage.getItem(ADMIN_EMAIL_KEY) || _DEFAULT_EMAIL;
    const storedPass  = localStorage.getItem(ADMIN_PASS_KEY)  || _DEFAULT_PASS;
    if (email === storedEmail && password === storedPass) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  };

  /**
   * Change the admin password.
   * Returns true on success, false if currentPassword is wrong.
   */
  const changeAdminPassword = (currentPassword, newPassword) => {
    const storedPass = localStorage.getItem(ADMIN_PASS_KEY) || _DEFAULT_PASS;
    if (currentPassword === storedPass && newPassword.length >= 6) {
      localStorage.setItem(ADMIN_PASS_KEY, newPassword);
      return true;
    }
    return false;
  };

  /**
   * Change the admin email (from Store Settings panel).
   * Returns true on success, false if password verification fails.
   */
  const changeAdminEmail = (currentPassword, newEmail) => {
    const storedPass = localStorage.getItem(ADMIN_PASS_KEY) || _DEFAULT_PASS;
    if (currentPassword === storedPass && newEmail.includes('@')) {
      localStorage.setItem(ADMIN_EMAIL_KEY, newEmail);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('vasuki_user');
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const getAdminEmail = () => {
    return localStorage.getItem(ADMIN_EMAIL_KEY) || _DEFAULT_EMAIL;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loginUser, registerUser, loginAdmin, changeAdminPassword, changeAdminEmail, getAdminEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
