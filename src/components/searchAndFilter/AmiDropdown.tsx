import FilterCheckbox from "../checkboxes/FilterCheckbox";
import { ActiveFilters } from "../../utils/buildingsFilter";

import TooltipWrapper from "../TooltipWrapper";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

type AmiFilterProps = {
  onAmiChange: (checkbox?: string) => void;
  allAmi: Set<string>;
  activeFilters: ActiveFilters;
};

const AmiDropdown: React.FC<AmiFilterProps> = ({
  onAmiChange,
  allAmi,
  activeFilters,
}) => {
  const overlayText = [...activeFilters.ami].join(", ");

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="diy-solid-info-button"
        id="ami-filter-dropdown"
        size="sm"
      >
        % AMI{" "}
        {activeFilters.ami.size > 0 && (
          <Badge>
            <TooltipWrapper
              label={String(activeFilters.ami.size)}
              overlay={overlayText}
              placement={"right"}
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
            />
          ))}
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AmiDropdown;
