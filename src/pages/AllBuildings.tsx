import { useEffect, useState, useCallback, useMemo, Profiler } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import "firebase/firestore";
import { useSavedBuildings } from "../hooks/useSavedBuildings";

import AllBuildingsList from "../components/AllBuildingsList";
import { Filters } from "../components/Filters";
import MapTab from "../components/MapTab";
import SearchInput from "../components/SearchInput";

import { genericSearch } from "../utils/genericSearch";
import { genericFilter } from "../utils/genericFilter";
import { getAllBuildingsRef } from "../utils/firestoreUtils";

import IBuilding from "../interfaces/IBuilding";
import IFilter from "../interfaces/IFilter";
import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Spinner from "react-bootstrap/Spinner";

const ref = getAllBuildingsRef();

const AllBuildingsPage: React.FunctionComponent<
  IPage & RouteComponentProps<any>
> = (props) => {
  const [allBuildings, setAllBuildings] = useState([] as Array<IBuilding>);
  const [loading, setLoading] = useState(false);

  const getAllBuildings = useCallback(() => {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as IBuilding);
      });
      setAllBuildings(items);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getAllBuildings();
  }, [getAllBuildings]);

  const [query, setQuery] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<Array<IFilter<IBuilding>>>(
    []
  );
  const resultBuildingsUnsorted = useMemo(() => {
    return allBuildings
      .filter((building) =>
        genericSearch<IBuilding>(
          building,
          [
            "buildingName",
            "residentialTargetedArea",
            "streetNum",
            "street",
            "zip",
          ],
          query
        )
      )
      .filter((building) => genericFilter<IBuilding>(building, activeFilters));
  }, [allBuildings, query, activeFilters]);

  const [savedBuildings, loadingSavedBuildings] = useSavedBuildings();

  return (
    <Profiler
      id={props.name}
      onRender={(id, phase, actualDuration) => {
        console.log({ id, phase, actualDuration });
      }}
    >
      <div className="all-pages">
        {loading || loadingSavedBuildings ? (
          <Spinner animation="border" variant="warning" />
        ) : (
          <></>
        )}
        {/* search filter container */}
        <Container fluid>
          {/* search */}
          <Row>
            <Col
              sm={12}
              md={{ span: 11, offset: 1 }}
              lg={{ span: 10, offset: 2 }}
            >
              <Row>
                <Col sm md={9} lg={8}>
                  <SearchInput
                    onChangeSearchQuery={(query) => setQuery(query)}
                  />
                </Col>
              </Row>
              {/* filter */}
              <Row>
                <Col>
                  {allBuildings.length > 0 && (
                    <Filters<IBuilding>
                      object={allBuildings[0]}
                      filters={activeFilters}
                      onChangeFilter={(changedFilterProperty, checked) => {
                        checked
                          ? setActiveFilters([
                              ...activeFilters.filter(
                                (filter) =>
                                  filter.property !== changedFilterProperty
                              ),
                              { property: changedFilterProperty },
                            ])
                          : setActiveFilters(
                              activeFilters.filter(
                                (filter) =>
                                  filter.property !== changedFilterProperty
                              )
                            );
                      }}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  {!loading && (
                    <p>
                      <strong>Results: </strong>
                      {`${resultBuildingsUnsorted.length} buildings found`}
                      {resultBuildingsUnsorted.length === 0 &&
                        ". Try expanding your search criteria!"}
                    </p>
                  )}
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
                    <Nav.Link eventKey="map" className="tab">
                      Map
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="saved" className="tab">
                      List
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={12} lg={10}>
                <Tab.Content>
                  <Tab.Pane eventKey="map">
                    <MapTab
                      buildingsToMap={resultBuildingsUnsorted}
                      savedBuildings={savedBuildings}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="saved">
                    <AllBuildingsList
                      resultBuildingsUnsorted={resultBuildingsUnsorted}
                      savedBuildings={savedBuildings}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </div>
    </Profiler>
  );
};

export default withRouter(AllBuildingsPage);
