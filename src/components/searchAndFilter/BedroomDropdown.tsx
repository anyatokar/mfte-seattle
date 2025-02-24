import { BedroomsKeyEnum } from "../../types/enumTypes";
import BedroomCheckbox from "../checkboxes/BedroomCheckbox";
import TextWithOverlay from "../TextWithOverlay";
import { ActiveFilters } from "../../utils/buildingsFilter";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

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

  const overlayText = [...activeFilters.bedrooms].join(", ");

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="diy-solid-info-button "
        id="bedroom-filter-dropdown"
        size="sm"
      >
        Size{" "}
        {activeFilters.bedrooms.size > 0 && (
          <Badge>
            <TextWithOverlay
              text={String(activeFilters.bedrooms.size)}
              overlay={overlayText}
            />
          </Badge>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-2" aria-labelledby="bedroom-filter-dropdown">
        <Button variant="link" onClick={() => onBedroomsChange()}>
          Remove Filter
        </Button>
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
  );
};

export default BedroomDropdown;
