import { useState } from "react";
import Form from "react-bootstrap/Form";
import { CheckboxKey, CheckboxUILabel } from "./Filters";

type BedroomCheckboxProps = {
  label: CheckboxUILabel;
  checkboxKey: CheckboxKey;
};

const BedroomCheckbox: React.FC<BedroomCheckboxProps> = ({
  label,
  checkboxKey,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  function handleClick(e: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked(e.target.checked);
  }

  return (
    <Form.Check
      type="checkbox"
      label={label}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={handleClick}
    />
  );
};

export default BedroomCheckbox;
