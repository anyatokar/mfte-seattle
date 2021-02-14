import React, { useEffect } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { useState, useCallback } from 'react';
// import IPage from '../interfaces/page';
// import logging from '../config/logging';
// import { RouteComponentProps, withRouter } from 'react-router-dom';
import Map from "../Map/Map";
import { loadMapApi } from "../utils/GoogleMapsUtils";
import firebase from '../db/firebase';
import 'firebase/firestore';


import Sorters from "./Sorters";
import SearchInput from "./SearchInput";
import { SavedHomesCard } from "./SavedHomesCard";
import IBuilding from "../interfaces/IBuilding";
// import buildings from "../db/buildings";
import { genericSort } from "../utils/genericSort";
import { genericSearch } from "../utils/genericSearch";
import { genericFilter } from "../utils/genericFilter";
import { Filters } from "./Filters";
import IFilter from "../interfaces/IFilter";
import ISorter from "../interfaces/ISorter";
import { useAuth } from "../contexts/AuthContext"

import { Container, Row, Col, CardDeck, Card, ListGroup, ListGroupItem, Navbar, Nav, ButtonGroup, Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';

// import { Geocoder } from "./Geocoder"



export default function SavedHomesList() {
  const { currentUser } = useAuth() as any
  const ref = firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes")
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [savedBuildings, setSavedBuildings] = useState([] as Array<IBuilding>);
  const [loading, setLoading] = useState(false);

  const getSavedBuildings = useCallback(() => {
    setLoading(true) 
    ref.onSnapshot((querySnapshot) => {
    const items: Array<IBuilding> = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as IBuilding);
    });
    setSavedBuildings(items)
    setLoading(false)
    });
  }, []);

  useEffect(() => {getSavedBuildings()}, [getSavedBuildings]); 

  return (
    <>
      <Container>
        <Row className="show-grid">
          <Col lg={12}>
            <Row className="show-grid">
                {savedBuildings.length > 0 && (
                  <>
                    {savedBuildings.map((building) => (
                      <>
                      <Col md={4}  className="building-row">
                        <SavedHomesCard key={building.buildingName} {...building} />
                      </Col>
                      </>
                    ))}
                  </>
                )}
                {savedBuildings.length === 0 && <p>No results found!</p>}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}