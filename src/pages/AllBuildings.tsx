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
import { useSavedBuildings } from "../hooks/useSavedBuildings";

import AllBuildingsList from "../components/BuildingsList";
import ReactMap from "../map/ReactMap";
import SearchAndFilter from "../components/SearchAndFilter";

import { genericSearch } from "../utils/genericSearch";
import { ActiveFilters, buildingsFilter } from "../utils/buildingsFilter";

import IBuilding from "../interfaces/IBuilding";
import IPage from "../interfaces/IPage";
import { BedroomsKeyEnum, pageTypeEnum } from "../types/enumTypes";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

function filterReducer(
  state: ActiveFilters,
  action: {
    type: "checked" | "unchecked";
    category: "bedrooms" | "neighborhoods";
    checkbox: BedroomsKeyEnum | string;
  }
): ActiveFilters {
  switch (action.type) {
    case "checked": {
      return {
        ...state,
        [action.category]: new Set(state[action.category]).add(action.checkbox),
      };
    }
    case "unchecked": {
      const newState = new Set(state[action.category]);
      newState.delete(action.checkbox);
      return {
        ...state,
        [action.category]: newState,
      };
    }
    default:
      return state;
  }
}

export type HandleCheckboxChange = (
  checkbox: BedroomsKeyEnum | string, // Allow either type for checkbox
  category: "bedrooms" | "neighborhoods"
) => void;

const AllBuildingsPage: React.FC<IPage> = () => {
  const [allBuildings, isLoadingAllBuildings] = useAllBuildingsContext();
  const [savedBuildings] = useSavedBuildings();

  // search, filter
  const neighborhoods = new Set(
    allBuildings.map((building) => building.residentialTargetedArea)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, dispatch] = useReducer(filterReducer, {
    bedrooms: new Set<BedroomsKeyEnum>(),
    neighborhoods: new Set<string>(),
  });

  // Handler for Bedrooms
  const handleBedroomsChange = (checkbox: BedroomsKeyEnum): void => {
    if (activeFilters.bedrooms.has(checkbox)) {
      dispatch({ type: "unchecked", category: "bedrooms", checkbox });
    } else {
      dispatch({ type: "checked", category: "bedrooms", checkbox });
    }
  };

  // Handler for Neighborhoods
  const handleNeighborhoodsChange = (checkbox: string): void => {
    if (activeFilters.neighborhoods.has(checkbox)) {
      dispatch({ type: "unchecked", category: "neighborhoods", checkbox });
    } else {
      dispatch({ type: "checked", category: "neighborhoods", checkbox });
    }
  };

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
          onBedroomsChange={handleBedroomsChange}
          onNeighborhoodsChange={handleNeighborhoodsChange}
          neighborhoods={neighborhoods}
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
