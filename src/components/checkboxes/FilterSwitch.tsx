import { useState } from "react";
import Form from "react-bootstrap/Form";
import { useAuth } from "../../contexts/AuthContext";

type FilterSwitchProps = {
  onCheckboxChange: () => void;
  type: "knownOnly" | "savedOnly";
};

const FilterSwitch: React.FC<FilterSwitchProps> = ({
  onCheckboxChange,
  type,
}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const { currentUser } = useAuth();

  function handleCheck() {
    if (type === "knownOnly" || currentUser) {
      setIsSwitchOn((prevState) => !prevState);
    }
    onCheckboxChange();
  }

  const labels = {
    knownOnly: "Known Availability",
    savedOnly: "Saved",
  };

  return (
    <Form className="mx-1 d-flex align-items-center gap-1">
      <Form.Check
        type="checkbox"
        id={`${type}-switch`}
        checked={isSwitchOn}
        onChange={handleCheck}
      />

      <Form.Label htmlFor={`${type}-switch`} className="mb-0 small">
        {labels[type]}
      </Form.Label>
    </Form>
  );
};

export default FilterSwitch;
