import React, { useEffect, useState } from 'react';
import { Header } from './header';
import { Properties } from './properties';
// import { Main } from './components/main';
// import { Footer } from './components/footer';


import { BrowserRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import logging from './config/logging';
import routes from './config/routes';
import firebase from './firebase';
import 'firebase/firestore';
import Map from './Map/';
import {loadMapApi} from "./utils/GoogleMapsUtils";
import { Navbar, Nav, NavLink,Form, FormControl, Button, Image, Table } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'

const Application: React.FunctionComponent<{}> = props => {







    // useEffect(() => {
    //     logging.info('Loading application.');
    // }, [])

    return (
        <div>

            <BrowserRouter>
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
            </BrowserRouter>

            





        </div>
    );
}

export default Application;