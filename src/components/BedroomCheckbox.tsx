import { useState } from "react";
import Form from "react-bootstrap/Form";
import { BedroomLabelEnum, BedroomsKeyEnum } from "../types/enumTypes";

type BedroomCheckboxProps = {
  checkboxKey: BedroomsKeyEnum;
  // handleChangeFilter: () => void;
};

const BedroomCheckbox: React.FC<BedroomCheckboxProps> = ({ checkboxKey }) => {
  const [isChecked, setIsChecked] = useState(false);

  function handleClick(e: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked(e.target.checked);
  }

  return (
    <Form.Check
      type="checkbox"
      label={BedroomLabelEnum[checkboxKey]}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={handleClick}
    />
  );
};

export default BedroomCheckbox;
