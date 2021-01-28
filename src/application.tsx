import React, { useEffect, useState } from 'react';
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

    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const googleMapScript = loadMapApi();
        googleMapScript.addEventListener('load', function () {
            setScriptLoaded(true);
        });
    }, []);



    const [buildings, setBuildings] = useState([] as any);
    const [loading, setLoading] = useState(false);

    const ref = firebase.firestore().collection("buildings");
    // const ref = firebase.database();

    console.log(ref)

    function getBuildings() {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items: Array<object> = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setBuildings(items)
            setLoading(false)

        });
    }

    useEffect(() => {
        getBuildings();
    }, []);

    if (loading) {
        return <h1>loading...</h1>;
    }

    // useEffect(() => {
    //     logging.info('Loading application.');
    // }, [])

    return (
        <div>
            <header>
                <h1>MFTE Simple</h1>
            </header>
            <BrowserRouter>
                <Navbar bg="dark" variant="dark">
                    <Nav className="mr-auto">
                        <LinkContainer to='/'>
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/about'>
                            <Nav.Link>About</Nav.Link>
                        </LinkContainer>
                        {/* <LinkContainer to='./pages/about'>
                            <Nav.Link>About</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='./pages/about'>
                            <Nav.Link>About</Nav.Link>
                        </LinkContainer> */}
                    </Nav>
                </Navbar>

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

            <h1>Buildings</h1>
            <div>
                <Table striped bordered hover variant="light">
                    <thead>
                        <tr>
                            <th>Building Name</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Residential Targeted Area</th>
                            <th>Total Restricted Units</th>
                            <th>Studio Units</th>
                            <th>One Bedroom Units</th>
                            <th>Two Bedroom Units</th>
                            <th>Three Bedroom+ Units</th>
                            <th>Website</th>
                        </tr>
                    </thead>

            {buildings.map((building: any) => (
                <tbody>
                    <tr key={building.id}>
                        <td>{building.buildingName}</td>
                        <td>{building.address}</td>
                        <td>{building.phone}</td>
                        <td>{building.residentialTargetedArea}</td>
                        <td>{building.totalRestrictedUnits}</td>
                        <td>{building.studioUnits}</td>
                        <td>{building.oneBedroomUnits}</td>
                        <td>{building.twoBedroomUnits}</td>
                        <td>{building.threePlusBedroomUnits}</td>
                        <td>{building.urlforBuilding}</td>
                    </tr>
                </tbody>
            ))}
            </Table>
            </div>



            <div>
                {scriptLoaded && (
                    <Map
                        mapType={google.maps.MapTypeId.ROADMAP}
                        mapTypeControl={true}
                    />
                )}
            </div>


        </div>
    );
}

export default Application;