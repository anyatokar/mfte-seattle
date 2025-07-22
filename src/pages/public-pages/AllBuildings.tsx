import {
  useState,
  useMemo,
  useRef,
  useEffect,
  useReducer,
  useLayoutEffect,
} from "react";
import config from "../../config/config";

import { useAllBuildingsContext } from "../../contexts/AllBuildingsContext";
import { useSavedBuildings } from "../../hooks/useSavedBuildings";

import AllBuildingsList from "../../components/all-buildings/BuildingsList";
import SearchAndFilter from "../../components/search-and-filter/SearchAndFilter";
import ReactMap from "../../components/map/ReactMap";
import RenderProfiler from "../../components/utility/RenderProfiler";

import { genericSearch } from "../../utils/genericSearch";
import { buildingsFilter } from "../../utils/buildingsFilter";
import { filterReducer } from "../../reducers/filterReducer";

import { PercentAmi, SearchFields } from "../../interfaces/IBuilding";
import IPage from "../../interfaces/IPage";
import { BedroomsKeyEnum } from "../../types/enumTypes";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";

export type HandleCheckboxChange = (
  checkbox: BedroomsKeyEnum | string,
  category: "bedrooms" | "neighborhoods" | "ami"
) => void;

const AllBuildingsPage: React.FC<IPage> = ({ topNavRef }) => {
  const [allBuildings, isLoadingAllBuildings] = useAllBuildingsContext();
  const [savedBuildings] = useSavedBuildings();
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );

  // search, filter
  const allNeighborhoods = new Set(
    allBuildings.map((building) => building.address.neighborhood)
  );

  const allAmi = new Set(
    allBuildings.flatMap((building) => Object.values(building.amiData)).flat()
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilters, dispatch] = useReducer(filterReducer, {
    bedrooms: new Set<BedroomsKeyEnum>(),
    neighborhoods: new Set<string>(),
    ami: new Set<PercentAmi>(),
    isAvailOnly: false,
    isSavedOnly: false,
    isAgeRestrictedOnly: false,
  });

  const resultBuildingsUnsorted = useMemo(() => {
    let filterResult;

    filterResult = allBuildings
      .filter((building) =>
        genericSearch<SearchFields>(
          building.searchFields,
          ["buildingName", "neighborhood", "streetAddress", "zip"],
          searchQuery
        )
      )
      .filter((building) => buildingsFilter(building, activeFilters));

    // Additional filter for saved buildings.
    if (activeFilters.isSavedOnly) {
      filterResult = filterResult.filter((building) =>
        savedBuildings.some(
          (savedBuilding) => savedBuilding.buildingID === building.buildingID
        )
      );
    }
    return filterResult;
  }, [allBuildings, searchQuery, activeFilters, savedBuildings]);

  // Scroll to top when buildings change
  const buildingsListRef = useRef<HTMLDivElement | null>(null);
  /** If prev action is save, unsave, or note in list view (not map), don't scroll. */
  const shouldScroll = useRef<boolean>(true);

  useEffect(() => {
    if (buildingsListRef.current && shouldScroll.current) {
      buildingsListRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
    shouldScroll.current = true;
  }, [resultBuildingsUnsorted]);

  const [mapHeight, setMapHeight] = useState(0);

  const searchAndFilterRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const sideNavRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const updateMapHeight = () => {
      if (
        !topNavRef.current ||
        !searchAndFilterRef.current ||
        !mapContainerRef.current ||
        !sideNavRef.current
      )
        return;

      const topNavHeight = topNavRef.current.offsetHeight;
      const searchAndFilterHeight = searchAndFilterRef.current.offsetHeight;
      const sideNavHeight = sideNavRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // The 10px to account for minor margins etc.
      const newMapHeight =
        windowHeight -
        topNavHeight -
        searchAndFilterHeight -
        sideNavHeight -
        10;
      setMapHeight(newMapHeight);
    };

    // Initial calculation
    updateMapHeight();

    // Update on resize
    window.addEventListener("resize", updateMapHeight);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", updateMapHeight);
  }, [topNavRef, searchAndFilterRef, mapContainerRef, sideNavRef]);

  return (
    <RenderProfiler id="AllBuildings" isProfilerOn={config.debug.isProfilerOn}>
      <div className="all-buildings-page pt-2" ref={searchAndFilterRef}>
        <SearchAndFilter
          setSearchQuery={setSearchQuery}
          allNeighborhoods={allNeighborhoods}
          allAmi={allAmi}
          activeFilters={activeFilters}
          dispatch={dispatch}
        />
      </div>

      {/* Only visible on large screens */}
      <Container fluid className="d-none d-md-block map-and-list-container">
        <Row>
          <Col className="px-1" ref={mapContainerRef}>
            <ReactMap
              mapHeight={mapHeight}
              resultBuildingsUnsorted={resultBuildingsUnsorted}
              savedBuildings={savedBuildings}
              shouldScroll={shouldScroll}
              setSelectedBuildingId={setSelectedBuildingId}
              selectedBuildingId={selectedBuildingId}
            />
          </Col>
          <Col
            className="px-0"
            style={{
              height: `${mapHeight}px`,
              overflowY: "auto",
            }}
            // Ref to scroll to the top of the list on search input
            ref={buildingsListRef}
          >
            <AllBuildingsList
              isLoading={isLoadingAllBuildings}
              resultBuildingsUnsorted={resultBuildingsUnsorted}
              savedBuildings={savedBuildings}
              shouldScroll={shouldScroll}
              setSelectedBuildingId={setSelectedBuildingId}
              selectedBuildingId={selectedBuildingId}
            />
          </Col>
        </Row>
      </Container>

      {/* Only visible on small screens */}
      <Container
        fluid
        className="d-block d-md-none mt-1 map-and-list-container"
      >
        <Tab.Container id="sidebar" defaultActiveKey="map">
          <div ref={sideNavRef}>
            <Nav
              variant="pills"
              className="mb-1 small d-flex justify-content-end"
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="map"
                  className="tab small py-1 px-2 text-size-override"
                >
                  Map View
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="list"
                  className="tab small py-1 px-2 text-size-override"
                >
                  List View
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Tab.Content ref={mapContainerRef}>
            <Tab.Pane eventKey="map">
              <ReactMap
                resultBuildingsUnsorted={resultBuildingsUnsorted}
                savedBuildings={savedBuildings}
                mapHeight={mapHeight}
                shouldScroll={shouldScroll}
                setSelectedBuildingId={setSelectedBuildingId}
                selectedBuildingId={selectedBuildingId}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="list">
              <AllBuildingsList
                isLoading={isLoadingAllBuildings}
                resultBuildingsUnsorted={resultBuildingsUnsorted}
                savedBuildings={savedBuildings}
                shouldScroll={shouldScroll}
                setSelectedBuildingId={setSelectedBuildingId}
                selectedBuildingId={selectedBuildingId}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </RenderProfiler>
  );
};

export default AllBuildingsPage;
