import { useState } from "react";
import FilterCheckbox from "../checkboxes/FilterCheckbox";
import { ActiveFilters } from "../../utils/buildingsFilter";
import TextWithOverlay from "../TextWithOverlay";

import Badge from "react-bootstrap/Badge";

import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
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

  const overlayText = [...activeFilters.neighborhoods].join(", ");

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="diy-solid-info-button"
        id="neighborhood-filter-dropdown"
        size="sm"
      >
        District{" "}
        {activeFilters.neighborhoods.size > 0 && (
          <Badge>
            <TextWithOverlay
              text={String(activeFilters.neighborhoods.size)}
              overlay={overlayText}
            />
          </Badge>
        )}
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
