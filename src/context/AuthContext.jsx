// ─────────────────────────────────────────────
//  AuthContext.js  —  Global login state
//
//  WHY CONTEXT?
//  Without context, you'd pass "user" as a prop
//  to every single component. That gets messy fast.
//  Context = one place, available everywhere.
// ─────────────────────────────────────────────

import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser, registerUser } from "../api/api";

// 1. Create the context (like an empty box)
const AuthContext = createContext(null);

// 2. Provider wraps your whole app and fills the box
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // null = not logged in
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(username, password);
      setUser(data.user); // Spring Boot returns { user: {...} }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(username, email, password);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null); // clear user from state
  };

  // Everything in "value" is accessible anywhere in the app
  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook — makes using context clean
// Usage in any component: const { user, login } = useAuth();
export const useAuth = () => useContext(AuthContext);
