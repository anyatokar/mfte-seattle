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
            {buildings.map((building: any) => (
                <div key={building.id}>
                    <h2>{building.building_name}</h2>
                    <h2>{building.address}</h2>
                    <h2>{building.phone}</h2>
                    <h2>{building.residential_targeted_area}</h2>
                    <h2>{building.total_restricted_units}</h2>

                </div>
            ))}


        </div>
    );
}

export default Application;