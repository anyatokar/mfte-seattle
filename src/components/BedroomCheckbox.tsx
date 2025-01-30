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

  function handleClick() {
    setIsChecked(prevState => !prevState);
    handleCheckboxChange(checkboxKey);
  }

  return (
    <Form.Check
      type="checkbox"
      label={BedroomLabelEnum[checkboxKey]}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={() => handleClick()}
    />
  );
};

export default BedroomCheckbox;
