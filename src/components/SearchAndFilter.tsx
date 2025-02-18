import { useState } from "react";
import SearchInput from "./SearchInput";
import BedroomCheckbox from "./BedroomCheckbox";
import FilterCheckbox from "./FilterCheckbox";
import KnownAvailSwitch from "./KnownAvailSwitch";
import { ActiveFilters } from "../utils/buildingsFilter";
import { BedroomsKeyEnum } from "../types/enumTypes";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";

type SearchAndFilterProps = {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onBedroomsChange: (checkbox: BedroomsKeyEnum) => void;
  onNeighborhoodsChange: (checkbox?: string) => void;
  onAvailOnlyToggle: () => void;
  allNeighborhoods: Set<string>;
  activeNeighborhoodFilters: ActiveFilters["neighborhoods"];
};

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  setSearchQuery,
  onBedroomsChange,
  onNeighborhoodsChange,
  onAvailOnlyToggle,
  allNeighborhoods: neighborhoods,
  activeNeighborhoodFilters,
}) => {
  const [dropdownFilter, setDropdownFilter] = useState("");

  const filteredNeighborhoods = [...neighborhoods]
    .filter((neighborhood) =>
      neighborhood.toLowerCase().includes(dropdownFilter.toLowerCase())
    )
    .sort();

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
          <Stack direction="horizontal" gap={2}>
            <Dropdown>
              <Dropdown.Toggle
                className="diy-solid-info-button "
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
                      onCheckboxChange={onBedroomsChange}
                    />
                  </Form>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle
                className="diy-solid-info-button "
                id="neighborhood-filter-dropdown"
              >
                Neighborhood
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{ maxHeight: "200px", overflowY: "auto" }}
                className="p-2"
                aria-labelledby="neighborhood-filter-dropdown"
              >
                <Form>
                  <Form.Control
                    type="search"
                    aria-label="Filter neighborhoods"
                    placeholder="Filter list"
                    onChange={(e) => setDropdownFilter(e.target.value)}
                    value={dropdownFilter}
                  />
                  <Button
                    variant="link"
                    onClick={() => onNeighborhoodsChange()}
                  >
                    Deselect All
                  </Button>
                  {[...filteredNeighborhoods].map((neighborhood) => (
                    <FilterCheckbox
                      key={neighborhood}
                      checkboxKey={neighborhood}
                      onCheckboxChange={onNeighborhoodsChange}
                      isChecked={activeNeighborhoodFilters.has(neighborhood)}
                    />
                  ))}
                </Form>
              </Dropdown.Menu>
            </Dropdown>
            <Form>
              <KnownAvailSwitch onCheckboxChange={onAvailOnlyToggle} />
            </Form>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchAndFilter;
