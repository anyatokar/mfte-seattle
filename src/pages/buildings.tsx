import React, { useEffect, useState, useCallback } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Map from "../Map/Map";
import firebase from '../db/firebase';
import 'firebase/firestore';
import { Spinner } from "react-bootstrap"

import SearchInput from "../components/SearchInput";
import IBuilding from "../interfaces/IBuilding";
import { genericSearch } from "../utils/genericSearch";
import { genericFilter } from "../utils/genericFilter";
import { Filters } from "../components/Filters";
import IFilter from "../interfaces/IFilter";
import { Nav, Tab, Row, Col, Container } from "react-bootstrap";
import MapTab from "../components/MapTab";
import AllBuildingsList from '../components/AllBuildingsList';
import Login from "../auth_components/Login";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const ref = firebase.firestore().collection("buildings"); 

const BuildingsPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth() as any
  const history = useHistory()

  const [allBuildings, setAllBuildings] = useState([] as Array<IBuilding>);
  const [loading, setLoading] = useState(false);

  const getAllBuildings = useCallback(() => {
    setLoading(true) 
    ref.onSnapshot((querySnapshot) => {
    const items: Array<IBuilding> = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as IBuilding);
    });
    setAllBuildings(items)
    setLoading(false)
    });
  }, []);

  useEffect(() => {getAllBuildings()}, [getAllBuildings]); 

  const [query, setQuery] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<Array<IFilter<IBuilding>>>(
    []
  );
  const resultBuildingsUnsorted = allBuildings
  .filter((building) =>
    genericSearch<IBuilding>(building, 
      ["buildingName", "residentialTargetedArea", "streetNum", "street", "zip"],
      query
    )
  )
  .filter((building) => genericFilter<IBuilding>(building, activeFilters))
  return (
    <>
      {loading ? (
        <Spinner animation="border" variant="warning" />
        ) : (<></>)
      }
      {/* search filter container */}
      <Container>
        {/* search */}
        <Row  className="justify-content-center">
          <Col sm={8}>
            <SearchInput onChangeSearchQuery={(query) => setQuery(query)} />
          </Col>
        </Row >
        {/* filter */}
        <Row className="justify-content-center">
          <Col sm={8}>
            {allBuildings.length > 0 && <Filters<IBuilding>
              object={allBuildings[0]}
              filters={activeFilters}
              onChangeFilter={(changedFilterProperty, checked, isTruthyPicked) => {
                checked
                  ? setActiveFilters([
                    ...activeFilters.filter(
                      (filter) => filter.property !== changedFilterProperty
                    ),
                    { property: changedFilterProperty, isTruthyPicked },
                  ])
                  : setActiveFilters(
                    activeFilters.filter(
                      (filter) => filter.property !== changedFilterProperty
                    )
                  );
                }}
              />}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={8}>
            { loading ? '' : 
              `${resultBuildingsUnsorted.length} buildings found`}
          </Col>
        </Row>
        <hr className="my-4"></hr>
      </Container>

      <Tab.Container id="sidebar" defaultActiveKey="map">
        <Row>
          <Col sm={2}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="map" className="tab">Map</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="saved-homes" className="tab">List</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={10}>
            <Tab.Content>
              <Tab.Pane eventKey="map">
                <MapTab savedBuildings={resultBuildingsUnsorted}/>
              </Tab.Pane>
              <Tab.Pane eventKey="saved-homes">
                <AllBuildingsList resultBuildingsUnsorted={resultBuildingsUnsorted}/>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  )
}

export default withRouter(BuildingsPage);