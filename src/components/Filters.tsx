import { useState } from "react";
import IFilter from "../interfaces/IFilter";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import BedroomCheckbox from "./BedroomCheckbox";

export interface IFiltersProps<T> {
  object: T;
  filters: Array<IFilter<T>>;
  onChangeFilter: (filterProperty: keyof T, isChecked: boolean) => void;
}

export type CheckboxKey =
  | "sedu"
  | "studioUnits"
  | "oneBedroomUnits"
  | "twoBedroomUnits"
  | "threePlusBedroomUnits";

export type CheckboxUILabel = "Micro" | "Studio" | "One" | "Two" | "Three+";

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
  const bedroomCheckboxes = {
    sedu: false,
    studioUnits: false,
    oneBedroomUnits: false,
    twoBedroomUnits: false,
    threePlusBedroomUnits: false,
  };

  const [bedroomCheckboxStatus, setBedroomCheckboxStatus] =
    useState(bedroomCheckboxes);

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
            <BedroomCheckbox
              label={checkboxUILabels[checkboxKey]}
              checkboxKey={checkboxKey}
              onChangeFilter={onChangeFilter}
            />
          </Form>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Filters;
