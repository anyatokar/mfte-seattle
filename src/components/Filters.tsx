import * as React from "react";
import { ReactNode } from "react";
import IFilter from "../interfaces/IFilter";

export interface IFiltersProps<T> {
  object: T;
  filters: Array<IFilter<T>>;
  onChangeFilter: (
    filterProperty: keyof T,
    checked: boolean,
    isTruthyPicked: boolean
  ) => void;
}

export function Filters<T>(props: IFiltersProps<T>) {
  const { object, filters, onChangeFilter } = props;

  const labelTruthy = (
    <>
      {/* offered */}
    </>
  );

  const labelFalsy = (
    <>
      is <b>falsy</b>
    </>
  );

  return (
    <div className="p-1 my-2">
      
      <label className="mt-3">Filter by number of bedrooms:</label>
      {Object.keys(object).map((key) => {
        if (key !== 'studioUnits' && 
            key !== 'oneBedroomUnits' && 
            key !== 'twoBedroomUnits' && 
            key !== 'threePlusBedroomUnits') 
            { return ('')}
        
        let styledKey = ''

        if (key === 'studioUnits') { 
          styledKey = 'Studios'
        } else if (key === 'oneBedroomUnits') {
          styledKey = 'One bedrooms'
        } else if (key === 'twoBedroomUnits') {
          styledKey = 'Two bedrooms' 
        } else if (key === 'threePlusBedroomUnits') {
          styledKey = 'Three or more bedrooms' 
        }


        const getRadioButton = (isTruthyPicked: boolean): ReactNode => {
          const id = isTruthyPicked
            ? `radio-defined-${key}`
            : `radio-not-defined-${key}`;
          const label = isTruthyPicked
            ? labelTruthy
            : labelFalsy;

          const getChecked = () => {
            const x = filters.filter(x => x.property === key);
            return x.length === 1 && x[0].isTruthyPicked === isTruthyPicked;
          }

          return (
            <>
              <input
                type="checkbox"
                id={id}
                value={key}
                checked={getChecked()}
                onChange={(event) =>
                  onChangeFilter(key as any, event.target.checked, isTruthyPicked)
                }
                className={"m-1 ml-3"}
              />
              <label htmlFor={id}>
                {styledKey}  {label}
              </label>
            </>
          );
        };

        return (
          <div key={key} className="input-group my-3">
            {getRadioButton(true)}
            {/* {getRadioButton(false)} */}
          </div>
        );
      })}
    </div>
  );
}