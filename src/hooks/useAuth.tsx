import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Role } from "../types";

interface AuthContextValue {
  role: Role | null;
  isAuthenticated: boolean;
  login: (selectedRole: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  const login = useCallback(
    (selectedRole: Role) => {
      setRole(selectedRole);
      navigate(`/${selectedRole}/dashboard`);
    },
    [navigate],
  );

  const logout = useCallback(() => {
    setRole(null);
    navigate("/");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ role, isAuthenticated: role !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}