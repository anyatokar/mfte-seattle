import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import logging from './config/logging';
import routes from './config/routes';
import firebase from './firebase';
import 'firebase/firestore';
import { Table } from 'react-bootstrap';

const Application: React.FunctionComponent<{}> = props => {

    const [buildings, setBuildings] = useState([] as any);
    const [loading, setLoading] = useState(false);

    const ref = firebase.firestore().collection("buildings");

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
    console.log(buildings)

    return (
        <div>
            <BrowserRouter>
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
                        </tr>
                    </thead>

            {buildings.map((building: any) => (
                <tbody>
                    <tr key={building.id}>
                        <td>{building.building_name}</td>
                        <td>{building.address}</td>
                        <td>{building.phone}</td>
                        <td>{building.residential_targeted_area}</td>
                        <td>{building.total_restricted_units}</td>
                    </tr>
                </tbody>
            ))}
            </Table>
            </div>


        </div>
    );
}

export default Application;