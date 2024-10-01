import { useState, useMemo, Profiler } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { areListingsOn } from "../config/config";

import { useAllBuildings } from "../hooks/useAllBuildings";
import { useSavedBuildings } from "../hooks/useSavedBuildings";
import { useAllListings } from "../hooks/useAllListings";

import AllBuildingsList from "../components/BuildingsList";
import MapTab from "../components/MapTab";
import SearchAndFilter from "../components/SearchAndFilter";

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
  const { allBuildings, loading } = useAllBuildings();

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
        {(loading || loadingSavedBuildings || loadingAllListings) && (
          <Spinner animation="border" variant="warning" />
        )}
        <SearchAndFilter 
          allBuildings={allBuildings}
          setSearchQuery={setSearchQuery}
          setActiveFilters={setActiveFilters}
          activeFilters={activeFilters}
          loading={loading}
          resultBuildingsUnsorted={resultBuildingsUnsorted}
        />

        <hr className="my-3 break-line-light" />

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
