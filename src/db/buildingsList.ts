
import { Form, FormControl, Button, Image, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import firebase from './firebase';
import 'firebase/firestore';
// import Map from "../Map/Map";
// import { loadMapApi } from "../utils/GoogleMapsUtils";

export const BuildingsList = () => {

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
      return ('loading...');
  }

console.log(buildings)
}