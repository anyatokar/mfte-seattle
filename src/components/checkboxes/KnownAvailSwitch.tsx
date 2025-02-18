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
    <>
      <Form.Check
        type="switch"
        id="availability-switch"
        checked={isSwitchOn}
        onChange={handleCheck}
      />
      <Form.Label htmlFor="custom-switch" className="mb-0">
        Known Availability
      </Form.Label>
    </>
  );
};

export default KnownAvailSwitch;
