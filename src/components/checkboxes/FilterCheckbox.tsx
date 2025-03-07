import { PercentAmi } from "../../interfaces/IBuilding";
import Form from "react-bootstrap/Form";

type FilterCheckboxProps<T extends string | PercentAmi> = {
  checkboxKey: T;
  onCheckboxChange: (checkbox: T) => void;
  isChecked: boolean;
};

const FilterCheckbox = <T extends string | PercentAmi>({
  checkboxKey,
  onCheckboxChange,
  isChecked,
}: FilterCheckboxProps<T>) => {
  return (
    <Form.Check
      type="checkbox"
      label={checkboxKey}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={() => onCheckboxChange(checkboxKey)}
    />
  );
};

export default FilterCheckbox;
