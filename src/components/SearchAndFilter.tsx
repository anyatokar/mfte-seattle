import { Dispatch, useContext, useState } from "react";
import SearchInput from "./SearchInput";
import BedroomCheckbox from "./checkboxes/BedroomCheckbox";
import FilterCheckbox from "./checkboxes/FilterCheckbox";
import FilterSwitch from "./checkboxes/FilterSwitch";
import { ActiveFilters } from "../utils/buildingsFilter";
import { FilterAction } from "../reducers/filterReducer";
import { BedroomsKeyEnum } from "../types/enumTypes";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";

type SearchAndFilterProps = {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  allNeighborhoods: Set<string>;
  activeFilters: ActiveFilters;
  dispatch: Dispatch<FilterAction>;
};

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  setSearchQuery,
  allNeighborhoods: neighborhoods,
  activeFilters,
  dispatch,
}) => {
  // Handler for Avail Switch
  const handleAvailOnlyToggle = () => {
    dispatch({ type: "toggleSwitch", category: "isAvailOnly" });
  };

  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const { currentUser } = useAuth();
  // Handler for Saved Switch
  const handleSavedOnlyToggle = () => {
    if (!currentUser) return setModalState(ModalState.LOGIN);
    dispatch({ type: "toggleSwitch", category: "isSavedOnly" });
  };

  // Handler for Bedrooms
  const handleBedroomsChange = (checkbox: BedroomsKeyEnum): void => {
    if (activeFilters.bedrooms.has(checkbox)) {
      dispatch({ type: "unchecked", category: "bedrooms", checkbox });
    } else {
      dispatch({ type: "checked", category: "bedrooms", checkbox });
    }
  };

  // Handler for Neighborhoods
  const handleNeighborhoodsChange = (checkbox?: string): void => {
    if (!checkbox) {
      dispatch({ type: "clearAll", category: "neighborhoods" });
    } else if (activeFilters.neighborhoods.has(checkbox)) {
      dispatch({ type: "unchecked", category: "neighborhoods", checkbox });
    } else {
      dispatch({ type: "checked", category: "neighborhoods", checkbox });
    }
  };

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
                size="sm"
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
                      onCheckboxChange={handleBedroomsChange}
                    />
                  </Form>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle
                className="diy-solid-info-button"
                id="neighborhood-filter-dropdown"
                size="sm"
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
                    size="sm"
                  />
                  <Button
                    variant="link"
                    onClick={() => handleNeighborhoodsChange()}
                  >
                    Remove Filter
                  </Button>
                  {[...filteredNeighborhoods].map((neighborhood) => (
                    <FilterCheckbox
                      key={neighborhood}
                      checkboxKey={neighborhood}
                      onCheckboxChange={handleNeighborhoodsChange}
                      isChecked={activeFilters.neighborhoods.has(neighborhood)}
                    />
                  ))}
                </Form>
              </Dropdown.Menu>
            </Dropdown>

            <FilterSwitch
              onCheckboxChange={handleAvailOnlyToggle}
              type="knownOnly"
            />
            <FilterSwitch
              onCheckboxChange={handleSavedOnlyToggle}
              type="savedOnly"
            />
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchAndFilter;
