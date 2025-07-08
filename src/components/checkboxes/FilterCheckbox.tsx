import { PercentAmi } from "../../interfaces/IBuilding";
import Form from "react-bootstrap/Form";
import { BedroomsKeyEnum, unitSizeLabelEnum } from "../../types/enumTypes";

type FilterCheckboxProps<T extends string | PercentAmi> = {
  checkboxKey: T;
  onCheckboxChange: (checkbox: T) => void;
  isChecked: boolean;
  dropdownType: "ami" | "bedrooms" | "household" | "neighborhood";
};

const FilterCheckbox = <T extends string | PercentAmi>({
  checkboxKey,
  onCheckboxChange,
  isChecked,
  dropdownType,
}: FilterCheckboxProps<T>) => {
  function getLabel() {
    if (dropdownType === "ami") {
      return checkboxKey + "%";
    } else if (dropdownType === "bedrooms") {
      return unitSizeLabelEnum[checkboxKey as BedroomsKeyEnum];
    } else {
      return checkboxKey;
    }
  }

  return (
    <Form.Check
      type={dropdownType === "household" ? "radio" : "checkbox"}
      label={getLabel()}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={() => onCheckboxChange(checkboxKey)}
    />
  );
};

export default FilterCheckbox;
