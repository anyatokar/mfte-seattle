import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactNode } from "react";
import { accountTypeEnum } from "../types/enumTypes";

type PrivateRouteProps = {
  children: ReactNode;
  name: string;
};

export default function PrivateRoute({ children, name }: PrivateRouteProps) {
  const { currentUser, accountType } = useAuth();
  const location = useLocation();

  const isAuthorized =
    currentUser &&
    ((name === "Manage Listings Page" &&
      accountType === accountTypeEnum.MANAGER) ||
      (name === "Saved Buildings Page" &&
        accountType === accountTypeEnum.RENTER) ||
      name === "Manage Profile Page");

  // Redirect unauthorized users
  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authorized
  return <>{children}</>;
}
