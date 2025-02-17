import { useState } from "react";
import Form from "react-bootstrap/Form";

type FilterCheckboxProps = {
  checkboxKey: string;
  onCheckboxChange: (checkbox: string) => void;
  isChecked: boolean;
};

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  checkboxKey,
  onCheckboxChange,
  isChecked: isPreviouslyChecked,
}) => {
  const [isChecked, setIsChecked] = useState(isPreviouslyChecked);

  function handleCheck() {
    setIsChecked((prevState) => !prevState);
    onCheckboxChange(checkboxKey);
  }

  return (
    <Form.Check
      type="checkbox"
      label={checkboxKey}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={() => handleCheck()}
    />
  );
};

export default FilterCheckbox;
