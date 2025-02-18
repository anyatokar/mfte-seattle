import { useState } from "react";
import Form from "react-bootstrap/Form";

type KnownAvailSwitchProps = {
  onCheckboxChange: () => void;
};

const KnownAvailSwitch: React.FC<KnownAvailSwitchProps> = ({
  onCheckboxChange,
}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  function handleCheck() {
    setIsSwitchOn((prevState) => !prevState);
    onCheckboxChange();
  }

  return (
    <Form.Check
      type="switch"
      id="custom-switch"
      label={"Known Availability"}
      checked={isSwitchOn}
      onChange={handleCheck}
    />
  );
};

export default KnownAvailSwitch;
