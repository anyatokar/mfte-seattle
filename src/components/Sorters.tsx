import { Fragment } from "react";

export interface ISortersProps<T> {
  object: T;
  onChangeSorter: (
    sortProperty: keyof T,
    isDescending: boolean
  ) => void;
}

type DropdownButtonKeyType =
  'buildingName' |
  'residentialTargetedArea'

const dropdownMenuKeys: DropdownButtonKeyType[]= ["buildingName", "residentialTargetedArea"]

export default function Sorters<T>(props: ISortersProps<T>) {
  const { onChangeSorter } = props;

  return (
    <>
      <label htmlFor="sorters" className="mt-3">Sort buildings by name or neighborhood:</label>
      <select
        id="sorters"
        className="custom-select form-control"
        onChange={(event) =>
          onChangeSorter(
            event.target.value.split(",")[0] as any,
            event.target.value.split(",")[1] === "true"
          )
        }

      >
        {dropdownMenuKeys.map((dropdownMenuKey) => {
          if (dropdownMenuKey === 'buildingName' ||
            dropdownMenuKey === 'residentialTargetedArea'
          ) {
            const dropdownMenuUILabels = {
              buildingName: 'Building name',
              residentialTargetedArea: 'Neighborhood',
            }
            return(
              <Fragment key={dropdownMenuKey}>
                <option
                  value={[dropdownMenuKey, "false"]}
                >
                  {dropdownMenuUILabels[dropdownMenuKey]} (A to Z)
                </option>
                <option
                  value={[dropdownMenuKey, "true"]}
                >
                  {dropdownMenuUILabels[dropdownMenuKey]} (Z to A)
                </option>
              </Fragment>
            );
          } else {
            return (<></>)}
        })}
      </select>
    </>
  );
}
