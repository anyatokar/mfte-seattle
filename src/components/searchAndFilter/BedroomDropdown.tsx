import { BedroomsKeyEnum } from "../../types/enumTypes";
import BedroomCheckbox from "../checkboxes/BedroomCheckbox";

import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

type BedroomFilterProps = {
  onBedroomsChange: (checkbox: BedroomsKeyEnum) => void;
};

const BedroomDropdown: React.FC<BedroomFilterProps> = ({
  onBedroomsChange,
}) => {
  const checkboxKeys: BedroomsKeyEnum[] = [
    BedroomsKeyEnum.MICRO,
    BedroomsKeyEnum.STUDIO,
    BedroomsKeyEnum.ONE_BED,
    BedroomsKeyEnum.TWO_BED,
    BedroomsKeyEnum.THREE_PLUS,
  ];

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="diy-solid-info-button "
        id="bedroom-filter-dropdown"
        size="sm"
      >
        Bedrooms
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-2" aria-labelledby="bedroom-filter-dropdown">
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
