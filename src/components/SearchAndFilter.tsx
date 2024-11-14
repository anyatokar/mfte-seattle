import Filters from "./Filters";
import SearchInput from "./SearchInput";

import IBuilding from "../interfaces/IBuilding";
import IFilter from "../interfaces/IFilter";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

type SearchAndFilterProps = {
  allBuildings: IBuilding[];
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setActiveFilters: React.Dispatch<React.SetStateAction<IFilter<IBuilding>[]>>;
  activeFilters: IFilter<IBuilding>[];
  loading: boolean;
  resultBuildingsUnsorted: IBuilding[];
};
const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
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
          <Row className="p-0 mt-0 mb-3">
            <Col sm={6}>
              <SearchInput
                onChangeSearchQuery={(query) => setSearchQuery(query)}
              />
            </Col>

            {/* filter */}

            <Col sm={3}>
              {
                <Filters<IBuilding>
                  object={allBuildings[0]}
                  filters={activeFilters}
                  onChangeFilter={(changedFilterProperty, isChecked) => {
                    isChecked
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
        </Col>
      </Row>
    </Container>
  );
};

export default SearchAndFilter;
