export interface ISortersProps<T> {
  object: T;
  onChangeSorter: (
    sortProperty: keyof T,
    isDescending: boolean
  ) => void;
}

export default function Sorters<T>(props: ISortersProps<T>) {
  const { object, onChangeSorter } = props;
  const objectKeys = ["buildingName", "residentialTargetedArea"]
  return (
    <>
      <label htmlFor="sorters" className="mt-3">Sort:</label>
      <select
        id="sorters"
        className="custom-select form-control"
        onChange={(event) =>
          onChangeSorter(
            event.target.value.split(",")[0] as any,
            event.target.value.split(",")[1] === "true"
          )
        }
        defaultValue={["title", "true"]}
      >
        {objectKeys.map((key) => {
          if (!key) {
            return<></>
          } else if (key === 'buildingName' || 
            key === 'residentialTargetedArea' 
          ) {
            const keyToStringObj = { 
              'buildingName': 'Building Name', 
              'residentialTargetedArea': 'Neighborhood',
            }
        
            return(
              <>
                <option
                  key={`${key}-false`}
                  value={[key, "false"]}
                >
                  {keyToStringObj[key]} (A to Z)
                </option>
                <option
                  key={`${key}-true`}
                  value={[key, "true"]}
                >
                  {keyToStringObj[key]} (Z to A)
                </option>
              </>
            );
          } else {
            return (<></>)}
        })}
      </select>
    </>
  );
}
