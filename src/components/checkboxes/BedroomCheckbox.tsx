import { useState } from "react";
import Form from "react-bootstrap/Form";
import { unitSizeLabelEnum, BedroomsKeyEnum } from "../../types/enumTypes";

type BedroomCheckboxProps = {
  checkboxKey: BedroomsKeyEnum;
  onCheckboxChange: (checkbox: BedroomsKeyEnum) => void;
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
      label={unitSizeLabelEnum[checkboxKey]}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={handleCheck}
    />
  );
};

export default BedroomCheckbox;
