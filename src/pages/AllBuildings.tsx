import {
  useState,
  useMemo,
  Profiler,
  useRef,
  useEffect,
  useReducer,
} from "react";
import { isProfilerOn } from "../config/config";

import { useAllBuildingsContext } from "../contexts/AllBuildingsContext";

import AllBuildingsList from "../components/BuildingsList";
import SearchAndFilter from "../components/SearchAndFilter";
import ReactMap from "../map/ReactMap";

import { genericSearch } from "../utils/genericSearch";
import { buildingsFilter } from "../utils/buildingsFilter";
import { filterReducer } from "../reducers/filterReducer";

import IBuilding from "../interfaces/IBuilding";
import IPage from "../interfaces/IPage";
import { BedroomsKeyEnum } from "../types/enumTypes";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

export type HandleCheckboxChange = (
  checkbox: BedroomsKeyEnum | string,
  category: "bedrooms" | "neighborhoods"
) => void;

const AllBuildingsPage: React.FC<IPage> = () => {
  const [allBuildings, isLoadingAllBuildings] = useAllBuildingsContext();

  // search, filter
  const allNeighborhoods = new Set(
    allBuildings.map((building) => building.residentialTargetedArea)
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilters, dispatch] = useReducer(filterReducer, {
    bedrooms: new Set<BedroomsKeyEnum>(),
    neighborhoods: new Set<string>(),
    isAvailOnly: false,
    isSavedOnly: false,
  });

  const resultBuildingsUnsorted = useMemo(() => {
    return allBuildings
      .filter((building) =>
        genericSearch<IBuilding>(
          building,
          ["buildingName", "residentialTargetedArea", "streetAddress", "zip"],
          searchQuery
        )
      )
      .filter((building) => buildingsFilter(building, activeFilters));
  }, [allBuildings, searchQuery, activeFilters]);

  // Scroll to top when buildings change
  const buildingsListRef = useRef<HTMLDivElement | null>(null);

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
          setSearchQuery={setSearchQuery}
          allNeighborhoods={allNeighborhoods}
          activeFilters={activeFilters}
          dispatch={dispatch}
        />

        {/* Only visible on large screens */}
        <Container fluid className="d-none d-md-block">
          <Row>
            <Col className="px-1">
              <ReactMap resultBuildingsUnsorted={resultBuildingsUnsorted} />
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
              />
            </Col>
          </Row>
        </Container>

        {/* Only visible on small screens */}
        <Container fluid className="d-block d-md-none">
          <Tab.Container id="sidebar" defaultActiveKey="map">
            <Nav variant="pills" className="mb-2 small">
              <Nav.Item>
                <Nav.Link eventKey="map" className="tab small py-1 px-2">
                  Map View
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="list" className="tab small py-1 px-2">
                  List View
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="map">
                <ReactMap resultBuildingsUnsorted={resultBuildingsUnsorted} />
              </Tab.Pane>
              <Tab.Pane eventKey="list">
                <AllBuildingsList
                  isLoading={isLoadingAllBuildings}
                  resultBuildingsUnsorted={resultBuildingsUnsorted}
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
