import { useState } from "react";
import Form from "react-bootstrap/Form";

type BedroomCheckboxProps = {
  checkboxKey: string;
  onCheckboxChange: (checkbox: string) => void;
};

const BedroomCheckbox: React.FC<BedroomCheckboxProps> = ({
  checkboxKey,
  onCheckboxChange,
}) => {
  const [isChecked, setIsChecked] = useState(false);

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

export default BedroomCheckbox;
