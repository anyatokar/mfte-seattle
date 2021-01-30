
import { Form, FormControl, Button, Image, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import firebase from '../db/firebase';
import 'firebase/firestore';
import Map from "../api/Map/Map";
import { loadMapApi } from "../utils/GoogleMapsUtils";

export const BuildingsTable = () => {

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

// console.log(buildings)

  return (
    <div>

      <div>
        {scriptLoaded && (
          <Map
            mapType={google.maps.MapTypeId.ROADMAP}
            mapTypeControl={true}
          />
        )}
      </div>

      <h1>All Buildings</h1>
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

          <tbody>
            {buildings.map((building: any) => (
              <tr key={building.Name}>
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
            ))}
          </tbody>
      </Table>
    </div>
  )
}