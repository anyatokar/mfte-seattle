import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ component: Component, ...rest }: any) {
  const { currentUser } = useAuth();

  return (
    <Route
      render={() => {
        return currentUser ? <Component {...rest} /> : <Redirect to="#" />;
      }}
    ></Route>
  );
}
