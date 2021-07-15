import { ReactMap } from "../Map/ReactMap";
import { MapTypeId } from '../interfaces/IMap';
import 'firebase/firestore';

export default function SavedHomesMap(props:any) {
  return (
    <>
      <div className="col col-no-padding">
        <ReactMap
          mapType={ MapTypeId.ROADMAP }
          mapTypeControl={true}
          filteredBuildings={props.savedBuildings}
        />
      </div>
    </>
  );
}