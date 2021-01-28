
import { Navbar, Nav, NavLink,Form, FormControl, Button, Image, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import firebase from '../db/firebase';
import 'firebase/firestore';



export const Properties = () => {
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
  
  return (
    <div>

<h1>All Properties</h1>
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
            </div>
  )
            }