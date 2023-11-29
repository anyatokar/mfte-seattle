import { useEffect, useState } from "react";
import PrivateRoute from "./auth_components/PrivateRoute";
import logging from "./config/logging";

import privateRoutes from "./config/privateRoutes";
import publicRoutes from "./config/publicRoutes";

import { Header } from "./components/Navbar";
import { Footer } from "./components/Footer";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ModalContext, ModalState } from "./contexts/ModalContext";

const Application: React.FunctionComponent<{}> = (props) => {
  useEffect(() => {
    logging.info("Loading application.");
  }, []);

  const modalStateHook = useState(ModalState.HIDDEN);

  return (
    <div className="main">
      <Router>
        <AuthProvider>
          <ModalContext.Provider value={modalStateHook}>
            <Header />
            <Switch>
              {privateRoutes.map((route) => {
                return (
                  <PrivateRoute
                    key={route.name}
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                    name={route.name}
                  />
                );
              })}

              {publicRoutes.map((route) => {
                return (
                  <Route
                    key={route.name}
                    path={route.path}
                    exact={route.exact}
                    render={(props: RouteComponentProps<any>) => (
                      <route.component
                        name={route.name}
                        {...props}
                        {...route.props}
                      />
                    )}
                  />
                );
              })}
            </Switch>
          </ModalContext.Provider>
        </AuthProvider>
      </Router>
      <Footer />
    </div>
  );
};

export default Application;
