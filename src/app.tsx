import React, { useEffect } from 'react';

import { Header } from './components/header';
import { Footer } from './components/footer';
import { BrowserRouter as Router, Route, Switch, RouteComponentProps, useLocation } from 'react-router-dom';
import logging from './config/logging';
import routes from './config/routes';

import Signup from "./auth_components/Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "./contexts/AuthContext"
import Dashboard from "./auth_components/Dashboard"
import Login from "./auth_components/Login"
import PrivateRoute from "./auth_components/PrivateRoute"
import ForgotPassword from "./auth_components/ForgotPassword"
import UpdateProfile from "./auth_components/UpdateProfile"
import { useAuth } from "./contexts/AuthContext"




import { Component, FunctionComponent, useState } from "react";
import { render } from "react-dom";
import { useModal } from './useModal';
import savedHomes from './pages/saved-homes';
import savedSearches from './pages/saved-searches';


const Application: React.FunctionComponent<{}> = props => {

  


  useEffect(() => {
    logging.info('Loading application.');
  }, [])



  return (
    <div>

      {/* <Router>
      <Header />

        <Switch>
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
      </Router> */}


      <div>
        <Router>
        
      
          <AuthProvider>
          <Header />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <PrivateRoute path="/saved-homes" component={savedHomes} />
              <PrivateRoute path="/saved-searches" component={savedSearches} />
              {/* <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} /> */}
              
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
          </AuthProvider>
        </Router>
      </div>

      <Footer />
    </div>
  );
}

export default Application;