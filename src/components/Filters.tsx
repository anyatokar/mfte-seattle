import IFilter from "../interfaces/IFilter";
import Form from "react-bootstrap/Form";

export interface IFiltersProps<T> {
  object: T;
  filters: Array<IFilter<T>>;
  onChangeFilter: (filterProperty: keyof T, checked: boolean) => void;
}

type checkboxKeyType =
  | "sedu"
  | "studioUnits"
  | "oneBedroomUnits"
  | "twoBedroomUnits"
  | "threePlusBedroomUnits";

type checkboxUILabelType =
  | "Micro"
  | "Studio"
  | "One bedroom"
  | "Two bedroom"
  | "Three or more";

type checkboxMapType = {
  [key in checkboxKeyType]: checkboxUILabelType;
};

const checkboxKeys: checkboxKeyType[] = [
  "sedu",
  "studioUnits",
  "oneBedroomUnits",
  "twoBedroomUnits",
  "threePlusBedroomUnits",
];

const checkboxUILabels: checkboxMapType = {
  sedu: "Micro",
  studioUnits: "Studio",
  oneBedroomUnits: "One bedroom",
  twoBedroomUnits: "Two bedroom",
  threePlusBedroomUnits: "Three or more",
};

const Filters = <T,>({ filters, onChangeFilter }: IFiltersProps<T>) => {
  const getChecked = (checkboxKey: checkboxKeyType) => {
    const x = filters.filter((x) => x.property === checkboxKey);
    return x.length === 1;
  };

  return (
    <div className="p-1 my-2">
      <p>Filter by number of bedrooms:</p>
      {checkboxKeys.map((checkboxKey: checkboxKeyType) => {
        let styledKey = checkboxUILabels[checkboxKey];
        let id = checkboxKey;

        return (
          <Form key={id} className="form-check-inline">
            <Form.Check
              type="checkbox"
              label={styledKey}
              id={id}
              value={checkboxKey}
              checked={getChecked(checkboxKey)}
              onChange={(event) =>
                onChangeFilter(checkboxKey as any, event.target.checked)
              }
            />
          </Form>
        );
      })}
    </div>
  );
};

export default Filters;
