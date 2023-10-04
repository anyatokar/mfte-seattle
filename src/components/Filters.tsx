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

type radioButtonDefined =
  'radio-defined-sedu' |
  'radio-defined-studioUnits' |
  'radio-defined-oneBedroomUnits' |
  'radio-defined-twoBedroomUnits'|
  'radio-defined-threePlusBedroomUnits'

type radioButtonNotDefined =
  'radio-not-defined-sedu' |
  'radio-not-defined-studioUnits' |
  'radio-not-defined-oneBedroomUnits' |
  'radio-not-defined-twoBedroomUnits'|
  'radio-not-defined-threePlusBedroomUnits'

type radioButtonTitle = radioButtonDefined | radioButtonNotDefined

type radioButtonKeyType =
  'sedu' |
  'studioUnits' |
  'oneBedroomUnits' |
  'twoBedroomUnits' |
  'threePlusBedroomUnits'

type radioButtonUILabelType =
  'Pod' |
  'Studio' |
  'One bedroom' |
  'Two bedroom' |
  'Three or more'

type radioButtonMapType = {
  [key in radioButtonKeyType]: radioButtonUILabelType
}

const radioButtonKeys: radioButtonKeyType[] = ['sedu', 'studioUnits', 'oneBedroomUnits', 'twoBedroomUnits', 'threePlusBedroomUnits']

const radioButtonUILabels: radioButtonMapType = {
  sedu: 'Pod',
  studioUnits: 'Studio',
  oneBedroomUnits: 'One bedroom',
  twoBedroomUnits: 'Two bedroom', 
  threePlusBedroomUnits: 'Three or more',
};

export function Filters<T>(props: IFiltersProps<T>) {
  const { filters, onChangeFilter } = props;

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

  const getChecked = (radioButtonKey: radioButtonKeyType, isTruthyPicked: boolean) => {
    const x = filters.filter(x => x.property === radioButtonKey);
    return x.length === 1 && x[0].isTruthyPicked === isTruthyPicked;
  }
  
  const getID = (isTruthyPicked: boolean, radioButtonKey: radioButtonKeyType): radioButtonTitle => {
    return isTruthyPicked
      ? `radio-defined-${radioButtonKey}`
      : `radio-not-defined-${radioButtonKey}`;
  }

  const getLabel = (isTruthyPicked: boolean) => {
    return isTruthyPicked
      ? labelTruthy
      : labelFalsy;
  }

  return (
    <div className="p-1 my-2">
      {radioButtonKeys.map((radioButtonKey: radioButtonKeyType) => {
      let isTruthyPicked = true
        let styledKey = radioButtonUILabels[radioButtonKey]
        let label = getLabel(isTruthyPicked)
        let id = getID(isTruthyPicked, radioButtonKey)

          return (
            <div key={id}>
              <input
                type="checkbox"
                id={id}
                value={radioButtonKey}
                checked={getChecked(radioButtonKey, isTruthyPicked)}
                onChange={(event) => 
                  onChangeFilter(radioButtonKey as any, event.target.checked, isTruthyPicked
                )}
                className={"m-1 ml-3"}
              />
              <label htmlFor={id}>
                {styledKey} {label}
              </label>
              <section className="form-check-inline">
                <div>
                  {label}
                </div>
              </section>
            </div>
          );
      })}
    </div>
  );
}
