import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { Role } from "../../types";

interface PrivateRouteProps {
  readonly allowedRole: Role;
}

export function PrivateRoute({ allowedRole }: PrivateRouteProps) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    // Autenticado pero con el rol equivocado → lo mandamos a su propio dashboard
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Outlet />;
}