import { useState } from "react";
import FilterCheckbox from "../checkboxes/FilterCheckbox";
import { ActiveFilters } from "../../utils/buildingsFilter";

import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";

type NeighborhoodFilterProps = {
  onNeighborhoodsChange: (checkbox?: string) => void;
  allNeighborhoods: Set<string>;
  activeFilters: ActiveFilters;
};

const NeighborhoodDropdown: React.FC<NeighborhoodFilterProps> = ({
  onNeighborhoodsChange,
  allNeighborhoods,
  activeFilters,
}) => {
  const [dropdownFilter, setDropdownFilter] = useState("");
  const filteredNeighborhoods = [...allNeighborhoods]
    .filter((neighborhood) =>
      neighborhood.toLowerCase().includes(dropdownFilter.toLowerCase())
    )
    .sort();
  return (
    <Dropdown>
      <Dropdown.Toggle
        className="diy-solid-info-button"
        id="neighborhood-filter-dropdown"
        size="sm"
      >
        District
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
          <Button variant="link" onClick={() => onNeighborhoodsChange()}>
            Remove Filter
          </Button>
          {[...filteredNeighborhoods].map((neighborhood) => (
            <FilterCheckbox
              key={neighborhood}
              checkboxKey={neighborhood}
              onCheckboxChange={onNeighborhoodsChange}
              isChecked={activeFilters.neighborhoods.has(neighborhood)}
            />
          ))}
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NeighborhoodDropdown;
