import { useState } from "react";
import FilterCheckbox from "../checkboxes/FilterCheckbox";
import TooltipWrapper from "../TooltipWrapper";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

export type Household = "1" | "2" | "3" | "4" | "5" | "6";

const HouseholdDropdown: React.FC = () => {
  const householdOptions: Household[] = ["1", "2", "3", "4", "5", "6"];

  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(
    null
  );

  function handleHouseholdChange(value: Household) {
    setSelectedHousehold(value);
  }

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="outline-primary"
        className="text-size-override"
        id="household-filter-dropdown"
        size="sm"
      >
        {" "}
        <TooltipWrapper
          label={"Household Size "}
          overlay={"Only for max income"}
          placement={"bottom"}
        ></TooltipWrapper>
        {!!selectedHousehold && (
          <Badge>
            <TooltipWrapper
              label={selectedHousehold}
              overlay={selectedHousehold || ""}
              placement="right"
            />
          </Badge>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu
        style={{ maxHeight: "200px", overflowY: "auto" }}
        className="p-2"
        aria-labelledby="household-filter-dropdown"
      >
        <Form>
          <Button variant="link" onClick={() => setSelectedHousehold(null)}>
            Unselect
          </Button>
          {householdOptions.map((householdSize) => (
            <FilterCheckbox
              key={householdSize}
              checkboxKey={householdSize}
              onCheckboxChange={handleHouseholdChange}
              isChecked={selectedHousehold === householdSize}
              dropdownType="household"
            />
          ))}
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default HouseholdDropdown;
