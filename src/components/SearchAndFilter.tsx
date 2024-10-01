import { Container, Row, Col } from "react-bootstrap";
import IBuilding from "../interfaces/IBuilding";
import Filters from "./Filters";
import SearchInput from "./SearchInput";
import IFilter from "../interfaces/IFilter";

type searchAndFilterPropsType = {
  allBuildings: IBuilding[];
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setActiveFilters:  React.Dispatch<React.SetStateAction<IFilter<IBuilding>[]>>;
  activeFilters: IFilter<IBuilding>[];
  loading: boolean;
  resultBuildingsUnsorted: IBuilding[];
};
const SearchAndFilter: React.FC<searchAndFilterPropsType> = ({
  allBuildings,
  setSearchQuery,
  setActiveFilters,
  activeFilters,
  loading,
  resultBuildingsUnsorted,
}) => {
  return (
    /* search filter container */
    <Container fluid>
      {/* search */}
      <Row>
        <Col sm={12} md={{ span: 11, offset: 1 }} lg={{ span: 10, offset: 2 }}>
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
                <p className="my-0">
                  {resultBuildingsUnsorted.length > 0
                    ? `${resultBuildingsUnsorted.length} buildings found`
                    : "No buildings found"}
                </p>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchAndFilter;
