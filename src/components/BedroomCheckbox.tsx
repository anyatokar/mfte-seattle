import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { CheckboxKey, CheckboxUILabel } from "./Filters";
import useDebounce from "../hooks/useDebounce";

type BedroomCheckboxProps = {
  label: CheckboxUILabel;
  checkboxKey: CheckboxKey;
  onChangeFilter: (filterProperty: any, isChecked: boolean) => void;
};

const BedroomCheckbox: React.FC<BedroomCheckboxProps> = ({
  label,
  checkboxKey,
  onChangeFilter,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [event, setEvent] = useState<React.ChangeEvent<HTMLInputElement>>();
  const debouncedCheckboxStatus = useDebounce(isChecked);

  // useEffect(() => {
  //   if (!event) return;
  //   onChangeFilter(checkboxKey, event.target.checked);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isChecked])

  function handleClick(e: React.ChangeEvent<HTMLInputElement>) {
    const toggledCheck = !isChecked;

    setIsChecked(toggledCheck);
    setEvent(e);
  }

  useEffect(() => {
    if (event) {
      onChangeFilter(checkboxKey, event.target.checked);
    }

    // If the debounced value is not updated, we don't set the search query.
  }, [debouncedCheckboxStatus, setIsChecked]);

  return (
    <Form.Check
      type="checkbox"
      label={label}
      id={checkboxKey}
      value={checkboxKey}
      checked={isChecked}
      onChange={(e) => handleClick(e)}
    />
  );
};

export default BedroomCheckbox;
