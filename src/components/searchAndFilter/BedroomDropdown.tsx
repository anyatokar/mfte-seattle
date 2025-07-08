import { unitSizeLabelEnum, BedroomsKeyEnum } from "../../types/enumTypes";
import FilterCheckbox from "../checkboxes/FilterCheckbox";
import TooltipWrapper from "../TooltipWrapper";
import { ActiveFilters } from "../../utils/buildingsFilter";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

type BedroomFilterProps = {
  onBedroomsChange: (checkbox?: BedroomsKeyEnum) => void;
  activeFilters: ActiveFilters;
};

const BedroomDropdown: React.FC<BedroomFilterProps> = ({
  onBedroomsChange,
  activeFilters,
}) => {
  const checkboxKeys: BedroomsKeyEnum[] = [
    BedroomsKeyEnum.MICRO,
    BedroomsKeyEnum.STUDIO,
    BedroomsKeyEnum.ONE_BED,
    BedroomsKeyEnum.TWO_BED,
    BedroomsKeyEnum.THREE_PLUS,
  ];

  const overlayText = [...activeFilters.bedrooms]
    .map((bedroom) => unitSizeLabelEnum[bedroom])
    .join(", ");

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="outline-primary"
        className="text-size-override"
        id="bedroom-filter-dropdown"
        size="sm"
      >
        Bedrooms{" "}
        {activeFilters.bedrooms.size > 0 && (
          <Badge>
            <TooltipWrapper
              label={String(activeFilters.bedrooms.size)}
              overlay={overlayText}
              placement="right"
            />
          </Badge>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-2" aria-labelledby="bedroom-filter-dropdown">
        <Button variant="link" onClick={() => onBedroomsChange()}>
          Remove Filter
        </Button>
        {checkboxKeys.map((checkboxKey) => (
            <FilterCheckbox
              key={checkboxKey}
              checkboxKey={checkboxKey}
              onCheckboxChange={onBedroomsChange}
              isChecked={activeFilters.bedrooms.has(checkboxKey)}
              dropdownType="bedrooms"
            />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default BedroomDropdown;
