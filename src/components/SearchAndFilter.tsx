import Filters from "./Filters";
import SearchInput from "./SearchInput";

import IBuilding from "../interfaces/IBuilding";
import IFilter from "../interfaces/IFilter";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

type searchAndFilterPropsType = {
  allBuildings: IBuilding[];
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setActiveFilters: React.Dispatch<React.SetStateAction<IFilter<IBuilding>[]>>;
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
    <Container fluid>
      <Row>
        <Col sm={12} md={{ span: 11, offset: 1 }} lg={{ span: 10, offset: 2 }}>
          {/* search */}
          <Row className="p-0 my-0">
            <Col sm md={9} lg={8}>
              <SearchInput
                onChangeSearchQuery={(query) => setSearchQuery(query)}
              />
            </Col>
          </Row>

          {/* filter */}
          <Row className="p-0 mt-3">
            <Col>
              {
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
              }
            </Col>
          </Row>

          {/* result count */}
          <Row className="p-0 mt-3">
            <Col>
              <>
                {loading ? (
                  <Spinner animation="border" variant="secondary" size="sm" />
                ) : (
                  <p className="mb-0">
                    {resultBuildingsUnsorted.length > 0
                      ? `${resultBuildingsUnsorted.length} buildings found`
                      : "No buildings found"}
                  </p>
                )}
              </>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchAndFilter;
