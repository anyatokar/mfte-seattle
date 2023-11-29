import React, { useEffect, useState } from "react";
import { Header } from "./components/Navbar";
import { Footer } from "./components/Footer";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps,
} from "react-router-dom";
import logging from "./config/logging";
import routes from "./config/routes";
import { AuthProvider } from "./contexts/AuthContext";
import ManageProfile from "./pages/ManageProfile";
import PrivateRoute from "./auth_components/PrivateRoute";
import SavedBuildings from "./pages/SavedBuildings";
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
              <PrivateRoute
                exact
                path="/manage-profile"
                component={ManageProfile}
              />
              <PrivateRoute
                exact
                path="/saved-buildings"
                component={SavedBuildings}
              />
              {routes.map((route, index) => {
                return (
                  <Route
                    key={index}
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
