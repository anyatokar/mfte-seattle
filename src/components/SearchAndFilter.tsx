import Filters from "./Filters";
import SearchInput from "./SearchInput";

import IBuilding from "../interfaces/IBuilding";
import IFilter from "../interfaces/IFilter";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

type SearchAndFilterProps = {
  allBuildings: IBuilding[];
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setActiveFilters: React.Dispatch<React.SetStateAction<IFilter<IBuilding>[]>>;
  activeFilters: IFilter<IBuilding>[];
};
const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  allBuildings,
  setSearchQuery,
  setActiveFilters,
  activeFilters,
}) => {
  return (
    <Container fluid>
      <Row className="p-0 mt-0 mb-2">
        {/* search */}

        <Col sm={8} lg={4} className="mb-2 mb-sm-0">
          <SearchInput setSearchQuery={(query) => setSearchQuery(query)} />
        </Col>

        {/* filter */}
        <Col>
          {
            <Filters<IBuilding>
              object={allBuildings[0]}
              filters={activeFilters}
              onChangeFilter={(changedFilterProperty, isChecked) => {
                isChecked
                  ? setActiveFilters([
                      ...activeFilters.filter(
                        (filter) => filter.property !== changedFilterProperty
                      ),
                      { property: changedFilterProperty },
                    ])
                  : setActiveFilters(
                      activeFilters.filter(
                        (filter) => filter.property !== changedFilterProperty
                      )
                    );
              }}
            />
          }
        </Col>
      </Row>
    </Container>
  );
};

export default SearchAndFilter;
