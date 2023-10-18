import IFilter from "../interfaces/IFilter";
import { Form } from 'react-bootstrap';

export interface IFiltersProps<T> {
  object: T;
  filters: Array<IFilter<T>>;
  onChangeFilter: (
    filterProperty: keyof T,
    checked: boolean,
  ) => void;
};

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
};

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

  const getChecked = (radioButtonKey: radioButtonKeyType) => {
    const x = filters.filter(x => x.property === radioButtonKey);
    return x.length === 1;
  };

  return (
    <div className="p-1 my-2">
      <p>Filter by number of bedrooms:</p>
      {radioButtonKeys.map((radioButtonKey: radioButtonKeyType) => {
        let styledKey = radioButtonUILabels[radioButtonKey]
        let id = radioButtonKey

          return (
            <Form key={id} className="form-check-inline">
              <Form.Check
                type="checkbox"
                id={id}
                value={radioButtonKey}
                checked={getChecked(radioButtonKey)}
                onChange={(event) => 
                  onChangeFilter(radioButtonKey as any, event.target.checked)
                }
                className={"m-1 ml-3"}
              />
              <Form.Label htmlFor={id}>{styledKey}</Form.Label>
            </Form>
          );
        }
      )}
    </div>
  );
};
