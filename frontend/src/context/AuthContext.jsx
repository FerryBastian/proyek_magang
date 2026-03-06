import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const { data } = await authApi.me();
        if (active) setUser(data.user ?? data);
      } catch (_) {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => { active = false; };
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password, tokenMode: true });
    const { user } = res.data;
    setUser(user);
    return user;
  };

  const register = async (name, email, password, password_confirmation) => {
    const res = await authApi.register({ name, email, password, password_confirmation });
    const { user } = res.data;
    setUser(user);
    return user;
  };

  const loginWithGoogle = async (id_token) => {
    const res = await authApi.loginWithGoogle({ id_token });
    const { user } = res.data;
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (_) {
      // tetap logout meski request gagal
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  const value = useMemo(
    () => ({ user, loading, login, register, loginWithGoogle, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}