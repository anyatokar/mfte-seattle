import { ReactMap } from "../Map/ReactMap";
import 'firebase/firestore';

export default function SavedHomesMap(props:any) {
  return (
    <>
      <div className="col col-no-padding">
        <ReactMap
          filteredBuildings={props.savedBuildings}
        />
      </div>
    </>
  );
}