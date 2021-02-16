import React, { useEffect } from 'react';

import { Header } from './components/navbar';
import { Footer } from './components/footer';
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from 'react-router-dom';
import logging from './config/logging';
import routes from './config/routes';
import { AuthProvider } from "./contexts/AuthContext"
import Dashboard from "./auth_components/Dashboard"
import PrivateRoute from "./auth_components/PrivateRoute"
import savedHomes from './pages/saved-homes';
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
              {/* <PrivateRoute path="/update-profile" component={UpdateProfile} /> */}
              <PrivateRoute path="/saved-homes" component={savedHomes} />
              {/* <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={PasswordReset} /> */}
              
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