import FilterCheckbox from "../checkboxes/FilterCheckbox";
import TooltipWrapper from "../utility/TooltipWrapper";
import { useHousehold } from "../../contexts/HouseholdContext";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

export type Household = "1" | "2" | "3" | "4" | "5" | "6";

const HouseholdDropdown: React.FC = () => {
  const { selectedHousehold, setSelectedHousehold } = useHousehold();

  const householdOptions: Household[] = ["1", "2", "3", "4", "5", "6"];

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
          overlay={"Determines max income"}
          placement={"right"}
        />
        {!!selectedHousehold && <Badge>{selectedHousehold}</Badge>}
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
