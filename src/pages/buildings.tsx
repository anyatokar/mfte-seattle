import React, { useEffect, useState, useCallback, useMemo } from 'react';
import IPage from '../interfaces/IPage';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import firebase from '../db/firebase';
import 'firebase/firestore';
import { Spinner } from "react-bootstrap";

import SearchInput from "../components/SearchInput";
import IBuilding from "../interfaces/IBuilding";
import { genericSearch } from "../utils/genericSearch";
import { genericFilter } from "../utils/genericFilter";
import { Filters } from "../components/Filters";
import IFilter from "../interfaces/IFilter";
import { Nav, Tab, Row, Col, Container } from "react-bootstrap";
import MapTab from "../components/MapTab";
import AllBuildingsList from '../components/AllBuildingsList';
import { useSavedBuildings } from '../hooks/useSavedBuildings';

const ref = firebase.firestore().collection("buildings");

const BuildingsPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

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
  const resultBuildingsUnsorted = useMemo(
    () => {
      return allBuildings
        .filter((building) =>
          genericSearch<IBuilding>(
            building,
            ["buildingName", "residentialTargetedArea", "streetNum", "street", "zip"],
            query
          )
        )
        .filter((building) => genericFilter<IBuilding>(building, activeFilters));
    },
    [allBuildings, query, activeFilters]
  );

  const [ savedBuildings, loadingSavedBuildings ] = useSavedBuildings();

  return (
    <div className='all-pages'>
      {loading || loadingSavedBuildings ? (
        <Spinner animation="border" variant="warning" />
        ) : (<></>)
      }
      {/* search filter container */}
      <Container fluid>
        {/* search */}
        <Row>
          <Col sm={12} lg={{ span: 10, offset: 2 }}>
            <Row>
              <Col sm md={9} lg={8}>
                <SearchInput onChangeSearchQuery={(query) => setQuery(query)} />
              </Col>
            </Row >
            {/* filter */}
            <Row>
              <Col>
                {allBuildings.length > 0 && <Filters<IBuilding>
                  object={allBuildings[0]}
                  filters={activeFilters}
                  onChangeFilter={(changedFilterProperty, checked) => {
                    checked
                      ? setActiveFilters([
                        ...activeFilters.filter(
                          (filter) => filter.property !== changedFilterProperty
                        ),
                        { property: changedFilterProperty },
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
            <Row>
              <Col>
                { !loading &&
                  <p>
                    <strong>Results: </strong>
                    {`${resultBuildingsUnsorted.length} buildings found`}
                    { !loading && resultBuildingsUnsorted.length === 0 && '. Try expanding your search criteria!'}
                  </p>
                }
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <hr className="my-4"></hr>

      <Container fluid>
        <Tab.Container id="sidebar" defaultActiveKey="map">
          <Row>
            <Col sm={12} lg={2}>
              <Nav variant="pills" className="flex-column side-nav">
                <Nav.Item>
                  <Nav.Link eventKey="map" className="tab">Map</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="saved-homes" className="tab">List</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={12} lg={10}>
              <Tab.Content>
                <Tab.Pane eventKey="map">
                  <MapTab buildingsToMap={resultBuildingsUnsorted} savedBuildings={savedBuildings} />
                </Tab.Pane>
                <Tab.Pane eventKey="saved-homes">
                  <AllBuildingsList resultBuildingsUnsorted={resultBuildingsUnsorted} savedBuildings={savedBuildings} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  )
}

export default withRouter(BuildingsPage);
