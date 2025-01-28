import IFilter from "../interfaces/IFilter";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

export interface IFiltersProps<T> {
  object: T;
  filters: Array<IFilter<T>>;
  onChangeFilter: (filterProperty: keyof T, isChecked: boolean) => void;
}

type CheckboxKey =
  | "sedu"
  | "studioUnits"
  | "oneBedroomUnits"
  | "twoBedroomUnits"
  | "threePlusBedroomUnits";

type CheckboxUILabel = "Micro" | "Studio" | "One" | "Two" | "Three+";

type CheckboxMap = {
  [key in CheckboxKey]: CheckboxUILabel;
};

const checkboxKeys: CheckboxKey[] = [
  "sedu",
  "studioUnits",
  "oneBedroomUnits",
  "twoBedroomUnits",
  "threePlusBedroomUnits",
];

const checkboxUILabels: CheckboxMap = {
  sedu: "Micro",
  studioUnits: "Studio",
  oneBedroomUnits: "One",
  twoBedroomUnits: "Two",
  threePlusBedroomUnits: "Three+",
};

const Filters = <T,>({ filters, onChangeFilter }: IFiltersProps<T>) => {
  const isChecked = (checkboxKey: CheckboxKey) =>
    filters.some((filter) => filter.property === checkboxKey);

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" id="bedroom-filter-dropdown">
        Bedrooms
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-2" aria-labelledby="bedroom-filter-dropdown">
        {checkboxKeys.map((checkboxKey) => (
          <Form key={checkboxKey}>
            <Form.Check
              type="checkbox"
              label={checkboxUILabels[checkboxKey]}
              id={checkboxKey}
              value={checkboxKey}
              checked={isChecked(checkboxKey)}
              onChange={(e) =>
                onChangeFilter(checkboxKey as keyof T, e.target.checked)
              }
            />
          </Form>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Filters;
