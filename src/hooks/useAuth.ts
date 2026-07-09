import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Role } from "../types";

export function useAuth() {
  const [role, setRole] = useState<Role>("estudiante");
  const navigate = useNavigate();

  const login = useCallback(
    (selectedRole: Role) => {
      setRole(selectedRole);
      navigate(`/${selectedRole}/dashboard`);
    },
    [navigate],
  );

  const logout = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return { role, setRole, login, logout };
}
