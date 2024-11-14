import { useState, useMemo, Profiler } from "react";

import { allBuildingsMaxHeight, areListingsOn } from "../config/config";
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

        <Container fluid>
          <Row>
            <Col className="pl-0">
              <ReactMap
                resultBuildingsUnsorted={resultBuildingsUnsorted}
                savedBuildings={savedBuildings}
                allListings={allListings}
              />
            </Col>
            <Col
              className="p-0"
              style={{
                maxHeight: allBuildingsMaxHeight,
                overflowY: "auto",
              }}
            >
              <AllBuildingsList
                isLoading={isLoadingAllBuildings}
                resultBuildingsUnsorted={resultBuildingsUnsorted}
                savedBuildings={savedBuildings}
                allListings={allListings}
                pageType={pageTypeEnum.allBuildings}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </Profiler>
  );
};

export default AllBuildingsPage;
