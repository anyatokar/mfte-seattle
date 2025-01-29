import { useState } from "react";
import Form from "react-bootstrap/Form";
import { BedroomLabelEnum, BedroomsKeyEnum } from "../types/enumTypes";

type BedroomCheckboxProps = {
  checkboxKey: BedroomsKeyEnum;
  handleCheckboxChange: (checkboxKey: BedroomsKeyEnum) => void;
};

const BedroomCheckbox: React.FC<BedroomCheckboxProps> = ({
  checkboxKey,
  handleCheckboxChange,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  function handleClick(e: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked(e.target.checked);
    handleCheckboxChange(checkboxKey);
  }

  return (
    <Form.Check
      type="checkbox"
      label={BedroomLabelEnum[checkboxKey]}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={(e) => handleClick(e)}
    />
  );
};

export default BedroomCheckbox;
