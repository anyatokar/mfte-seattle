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
  const getChecked = (checkboxKey: CheckboxKey) => {
    const x = filters.filter((x) => x.property === checkboxKey);
    return x.length === 1;
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary">Bedrooms</Dropdown.Toggle>

      <Dropdown.Menu className="p-2">
        {checkboxKeys.map((checkboxKey: CheckboxKey) => {
          let styledKey = checkboxUILabels[checkboxKey];
          let id = checkboxKey;

          return (
            <Form key={id}>
              <Form.Check
                type="checkbox"
                label={styledKey}
                id={id}
                value={checkboxKey}
                checked={getChecked(checkboxKey)}
                onChange={(e) =>
                  onChangeFilter(checkboxKey as any, e.target.checked)
                }
              />
            </Form>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Filters;
