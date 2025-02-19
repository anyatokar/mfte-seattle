import { useState } from "react";
import Form from "react-bootstrap/Form";

type FilterSwitchProps = {
  onCheckboxChange: () => void;
  type: "knownOnly" | "savedOnly";
};

const FilterSwitch: React.FC<FilterSwitchProps> = ({
  onCheckboxChange,
  type,
}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  function handleCheck() {
    setIsSwitchOn((prevState) => !prevState);
    onCheckboxChange();
  }

  const labels = {
    knownOnly: "Known Availability",
    savedOnly: "Saved",
  };

  return (
    <div className="d-flex align-items-center gap-0">
      <Form.Check
        type="switch"
        id={`${type}-switch`}
        checked={isSwitchOn}
        onChange={handleCheck}
      />
      <Form>
        <Form.Label htmlFor={`${type}-switch`} className="mb-0 small">
          {labels[type]}
        </Form.Label>
      </Form>
    </div>
  );
};

export default FilterSwitch;
