import { useState, useMemo, Profiler, useRef, useEffect } from "react";
import { isProfilerOn } from "../config/config";

import { useAllBuildingsContext } from "../contexts/AllBuildingsContext";
import { useSavedBuildings } from "../hooks/useSavedBuildings";

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
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

const AllBuildingsPage: React.FC<IPage> = () => {
  const [allBuildings, isLoadingAllBuildings] = useAllBuildingsContext();
  const [savedBuildings] = useSavedBuildings();

  // search, filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<IFilter<IBuilding>[]>([]);

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

  const buildingsListRef = useRef<HTMLDivElement | null>(null);

  // Scroll to top when buildings change
  useEffect(() => {
    if (buildingsListRef.current) {
      buildingsListRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [resultBuildingsUnsorted]);

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
      <div className="pt-2">
        <SearchAndFilter
          allBuildings={allBuildings}
          setSearchQuery={setSearchQuery}
          setActiveFilters={setActiveFilters}
          activeFilters={activeFilters}
        />

        {/* Only visible on large screens */}
        <Container fluid className="d-none d-md-block">
          <Row>
            <Col className="pl-0">
              <ReactMap
                resultBuildingsUnsorted={resultBuildingsUnsorted}
                savedBuildings={savedBuildings}
              />
            </Col>
            <Col
              className="p-0 map-and-list-container"
              style={{
                overflowY: "auto",
              }}
              // Ref to scroll to the top of the list on search input
              ref={buildingsListRef}
            >
              <AllBuildingsList
                isLoading={isLoadingAllBuildings}
                resultBuildingsUnsorted={resultBuildingsUnsorted}
                savedBuildings={savedBuildings}
                pageType={pageTypeEnum.allBuildings}
              />
            </Col>
          </Row>
        </Container>

        {/* Only visible on small screens */}
        <Container fluid className="d-block d-md-none">
          <Tab.Container id="sidebar" defaultActiveKey="map">
            <Nav variant="pills" className="mb-2">
              <Nav.Item>
                <Nav.Link eventKey="map" className="tab">
                  Map View
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="list" className="tab">
                  List View
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="map">
                <ReactMap
                  resultBuildingsUnsorted={resultBuildingsUnsorted}
                  savedBuildings={savedBuildings}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="list">
                <AllBuildingsList
                  isLoading={isLoadingAllBuildings}
                  resultBuildingsUnsorted={resultBuildingsUnsorted}
                  savedBuildings={savedBuildings}
                  pageType={pageTypeEnum.allBuildings}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>
    </Profiler>
  );
};

export default AllBuildingsPage;
