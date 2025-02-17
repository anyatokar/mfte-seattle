import Form from "react-bootstrap/Form";

type FilterCheckboxProps = {
  checkboxKey: string;
  onCheckboxChange: (checkbox: string) => void;
  isChecked: boolean;
};

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  checkboxKey,
  onCheckboxChange,
  isChecked,
}) => {
  function handleCheck() {
    onCheckboxChange(checkboxKey);
  }

  return (
    <Form.Check
      type="checkbox"
      label={checkboxKey}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={handleCheck}
    />
  );
};

export default FilterCheckbox;
