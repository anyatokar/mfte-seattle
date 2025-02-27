import Form from "react-bootstrap/Form";

type FilterSwitchProps = {
  onCheckboxChange: () => void;
  type: "knownOnly" | "savedOnly";
  isChecked: boolean;
};

const FilterSwitch: React.FC<FilterSwitchProps> = ({
  onCheckboxChange,
  type,
  isChecked,
}) => {
  const labels = {
    knownOnly: "Known Availability",
    savedOnly: "Saved",
  };

  return (
    <Form className="mx-1 d-flex align-items-center gap-1">
      <Form.Check
        type="checkbox"
        id={`${type}-checkbox`}
        checked={isChecked}
        onChange={onCheckboxChange}
      />

      <Form.Label
        htmlFor={`${type}-checkbox`}
        className="mb-0 small text-size-override"
      >
        {labels[type]}
      </Form.Label>
    </Form>
  );
};

export default FilterSwitch;
