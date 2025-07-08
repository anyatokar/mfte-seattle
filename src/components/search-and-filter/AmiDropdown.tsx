import FilterCheckbox from "../checkboxes/FilterCheckbox";
import TooltipWrapper from "../utility/TooltipWrapper";
import { ActiveFilters } from "../../utils/buildingsFilter";
import { PercentAmi } from "../../interfaces/IBuilding";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

type AmiFilterProps = {
  onAmiChange: (checkbox?: PercentAmi) => void;
  allAmi: Set<PercentAmi>;
  activeFilters: ActiveFilters;
};

const AmiDropdown: React.FC<AmiFilterProps> = ({
  onAmiChange,
  allAmi,
  activeFilters,
}) => {
  const overlayText = [...activeFilters.ami]
    .map((value) => `${value}%`)
    .join(", ");

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="outline-primary"
        className="text-size-override"
        id="ami-filter-dropdown"
        size="sm"
      >
        <TooltipWrapper
          label={"AMI "}
          overlay={
            "Lower % AMI = lower rent and stricter income cap. Leave blank if unsure."
          }
          placement={"right"}
        />
        {activeFilters.ami.size > 0 && (
          <Badge>
            <TooltipWrapper
              label={String(activeFilters.ami.size)}
              overlay={overlayText}
              placement="right"
            />
          </Badge>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu
        style={{ maxHeight: "200px", overflowY: "auto" }}
        className="p-2"
        aria-labelledby="ami-filter-dropdown"
      >
        <Form>
          <Button variant="link" onClick={() => onAmiChange()}>
            Remove Filter
          </Button>
          {[...allAmi].sort().map((ami) => (
            <FilterCheckbox
              key={ami}
              checkboxKey={ami}
              onCheckboxChange={onAmiChange}
              isChecked={activeFilters.ami.has(ami)}
              dropdownType="ami"
            />
          ))}
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AmiDropdown;
