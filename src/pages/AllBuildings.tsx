import { useState, useMemo, Profiler, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { areListingsOn } from "../config/config";
import { isProfilerOn } from "../config/config";

import { useAllBuildingsContext } from "../contexts/AllBuildingsContext";
import { useSavedBuildings } from "../hooks/useSavedBuildings";
import { useAllListings } from "../hooks/useListings";

import AllBuildingsList from "../components/BuildingsList";
import ReactMap from "../map/ReactMap";
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

const AllBuildingsPage: React.FC<IPage> = () => {
  const [allBuildings, isLoadingAllBuildings] = useAllBuildingsContext();
  const [savedBuildings] = useSavedBuildings();
  let [allListings] = useAllListings(true);

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

  // listings
  if (!areListingsOn) {
    allListings = [];
  }

  return (
    <Profiler
      id={"AllBuildings"}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        if (isProfilerOn) {
          console.log({
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
          });
        }
      }}
    >
      <div className="all-pages">
        <SearchAndFilter
          allBuildings={allBuildings}
          setSearchQuery={setSearchQuery}
          setActiveFilters={setActiveFilters}
          activeFilters={activeFilters}
          loading={isLoadingAllBuildings}
          resultBuildingsUnsorted={resultBuildingsUnsorted}
        />

        <hr className="mt-2 mb-3 break-line-light" />

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
                    <ReactMap
                      resultBuildingsUnsorted={resultBuildingsUnsorted}
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

export default AllBuildingsPage;
