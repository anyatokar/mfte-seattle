import { useEffect, useState, useCallback, useMemo, Profiler } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";

import { areListingsOn } from "../config/config";

import { useSavedBuildings } from "../hooks/useSavedBuildings";
import { useAllListings } from "../hooks/useAllListings";

import AllBuildingsList from "../components/BuildingsList";
import Filters from "../components/Filters";
import MapTab from "../components/MapTab";
import SearchInput from "../components/SearchInput";

import { genericSearch } from "../utils/genericSearch";
import { genericFilter } from "../utils/genericFilter";

import IBuilding from "../interfaces/IBuilding";
import IFilter from "../interfaces/IFilter";
import IPage from "../interfaces/IPage";
import { pageTypeEnum } from "../types/enumTypes";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Spinner from "react-bootstrap/Spinner";

const AllBuildingsPage: React.FC<IPage & RouteComponentProps<any>> = ({
  name,
}) => {
  // get all buildings
  const [allBuildings, setAllBuildings] = useState([] as Array<IBuilding>);
  const [loading, setLoading] = useState(false);

  const q = query(collection(db, "buildings"));

  const getAllBuildings = useCallback(() => {
    console.log("Getting all buildings.");
    setLoading(true);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const buildings: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        buildings.push(doc.data() as IBuilding);
      });
      setAllBuildings(buildings);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllBuildings();
  }, [getAllBuildings]);

  // search, filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<Array<IFilter<IBuilding>>>(
    []
  );
  const resultBuildingsUnsorted = useMemo(() => {
    return allBuildings
      .filter((building) =>
        genericSearch<IBuilding>(
          building,
          ["buildingName", "residentialTargetedArea", "streetAddress", "zip"],
          searchQuery
        )
      )
      .filter((building) => genericFilter<IBuilding>(building, activeFilters));
  }, [allBuildings, searchQuery, activeFilters]);

  const [savedBuildings, loadingSavedBuildings] = useSavedBuildings();

  // listings
  let [allListings, loadingAllListings] = useAllListings();

  if (!areListingsOn) {
    allListings = [];
    loadingAllListings = false;
  }

  return (
    <Profiler
      id={name}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        console.log({
          id,
          phase,
          actualDuration,
          baseDuration,
          startTime,
          commitTime,
        });
      }}
    >
      <div className="all-pages">
        {loading || loadingSavedBuildings || loadingAllListings ? (
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
                    onChangeSearchQuery={(query) => setSearchQuery(query)}
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
                      {resultBuildingsUnsorted.length > 0
                        ? `${resultBuildingsUnsorted.length} buildings found`
                        : "No buildings found with this search criteria."}
                    </p>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>

        <hr className="my-4 break-line-light" />

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
                      allListings={allListings}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="saved">
                    <AllBuildingsList
                      resultBuildingsUnsorted={resultBuildingsUnsorted}
                      savedBuildings={savedBuildings}
                      allListings={allListings}
                      pageType={pageTypeEnum.allBuildings}
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
