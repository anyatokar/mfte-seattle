import { PercentAmi } from "../../interfaces/IBuilding";
import Form from "react-bootstrap/Form";

type FilterCheckboxProps<T extends string | PercentAmi> = {
  checkboxKey: T;
  onCheckboxChange: (checkbox: T) => void;
  isChecked: boolean;
  dropdownType?: string;
};

const FilterCheckbox = <T extends string | PercentAmi>({
  checkboxKey,
  onCheckboxChange,
  isChecked,
  dropdownType,
}: FilterCheckboxProps<T>) => {
  return (
    <Form.Check
      type={dropdownType === "household" ? "radio" : "checkbox"}
      label={dropdownType === "ami" ? checkboxKey + "%" : checkboxKey}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={() => onCheckboxChange(checkboxKey)}
    />
  );
};

export default FilterCheckbox;
