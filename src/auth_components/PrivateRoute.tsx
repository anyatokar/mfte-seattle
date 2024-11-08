import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ComponentType } from "react";
import { accountTypeEnum } from "../types/enumTypes";

type PrivateRoutes = {
  path: string;
  exact: boolean;
  component: ComponentType<any>;
  name: string;
};

export default function PrivateRoute({
  component: Component,
  name,
  ...rest
}: PrivateRoutes) {
  const { currentUser, accountType } = useAuth();

  const isAuthorized =
    currentUser &&
    ((name === "Manage Listings Page" &&
      accountType === accountTypeEnum.MANAGER) ||
      (name === "Saved Buildings Page" &&
        accountType === accountTypeEnum.RENTER) ||
      name === "Manage Profile Page");

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthorized ? (
          <Component {...props} name={name} />
        ) : (
          <Redirect to="#" />
        )
      }
    />
  );
}
