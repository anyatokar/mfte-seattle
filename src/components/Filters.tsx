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
  const objectKeys = ["sedu", "studioUnits", "oneBedroomUnits", "twoBedroomUnits", "threePlusBedroomUnits"]
  return (
    <div className="p-1 my-2">
      
      <label className="mt-3">Number of bedrooms:</label>
      {/* Object is a class that is calling method keys on object (which is all the buildings) */}
      {objectKeys.map((key) => {
        if (key !== 'sedu' && 
            key !== 'studioUnits' && 
            key !== 'oneBedroomUnits' && 
            key !== 'twoBedroomUnits' && 
            key !== 'threePlusBedroomUnits') 
            { return ('')}
        
        let styledKey = ''

        if (key === 'sedu') { 
          styledKey = 'Pod'
        } else if (key === 'studioUnits') {
          styledKey = 'Studio'
        } else if (key === 'oneBedroomUnits') {
          styledKey = 'One'
        } else if (key === 'twoBedroomUnits') {
          styledKey = 'Two' 
        } else if (key === 'threePlusBedroomUnits') {
          styledKey = 'Three or more' 
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
          <section className="form-check-inline">
            <div key={key} >
              {getRadioButton(true)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
