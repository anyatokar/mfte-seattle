import Filters from "./Filters";
import SearchInput from "./SearchInput";

import IBuilding from "../interfaces/IBuilding";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

type SearchAndFilterProps = {
  allBuildings: IBuilding[];
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setActiveFilters: React.Dispatch<React.SetStateAction<Set<IBuilding>>>;
  activeFilters: Set<IBuilding>;
};
const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  allBuildings,
  setSearchQuery,
  setActiveFilters,
  activeFilters,
}) => {

  // Currently processes on filter property at a time.
  // What if it was given an object of properties?
  function handleChangeFilter(changedFilterProperties) {
    const currentFilters = activeFilters;

    for (let obj of currentFilters) => {
      for ()
      if (currentFilters[property]) {

      }
       = changedFilterProperties[property]
 
   

    isChecked
    ? currentFilters[property] = true
    
    ([
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

    })
  }

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
              onChangeFilter={(changedFilterProperty, isChecked) => handleChangeFilter(changedFilterProperty, isChecked)}
            />
          }
        </Col>
      </Row>
    </Container>
  );
};

export default SearchAndFilter;
