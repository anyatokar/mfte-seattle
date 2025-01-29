import SearchInput from "./SearchInput";

import IBuilding from "../interfaces/IBuilding";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Dropdown from "react-bootstrap/esm/Dropdown";
import Form from "react-bootstrap/esm/Form";
import BedroomCheckbox from "./BedroomCheckbox";
import { BedroomsKeyEnum } from "../types/enumTypes";

type SearchAndFilterProps = {
  allBuildings: IBuilding[];
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setActiveFilters: any;
  activeFilters: any;
};
const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  allBuildings,
  setSearchQuery,
  setActiveFilters,
  activeFilters,
}) => {
  // Currently processes on filter property at a time.
  // What if it was given an object of properties?

  // overwrite old filters with new filters.
  // do this after enough new filters are collected - debounce.
  function handleChangeFilter(updatedFilters: Set<IBuilding>) {
    setActiveFilters(updatedFilters);
  }

  const checkboxKeys: BedroomsKeyEnum[] = [
    BedroomsKeyEnum.SEDU,
    BedroomsKeyEnum.STUDIO,
    BedroomsKeyEnum.ONE_BED,
    BedroomsKeyEnum.TWO_BED,
    BedroomsKeyEnum.THREE_PLUS,
  ];

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
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="bedroom-filter-dropdown"
              >
                Bedrooms
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="p-2"
                aria-labelledby="bedroom-filter-dropdown"
              >
                {checkboxKeys.map((checkboxKey) => (
                  <Form key={checkboxKey}>
                    <BedroomCheckbox
                      checkboxKey={checkboxKey}
                      //  handleChangeFilter={(updatedFilters) => handleChangeFilter}
                    />
                  </Form>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          }
        </Col>
      </Row>
    </Container>
  );
};

export default SearchAndFilter;
