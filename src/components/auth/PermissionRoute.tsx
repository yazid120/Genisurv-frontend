import { Navigate } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";

interface PermissionRouteProps {
  permission: string;
  children: React.ReactNode;
}

export default function PermissionRoute({ permission, children }: PermissionRouteProps) {
  const permissions = usePermissions();

  if (!permissions.includes(permission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}