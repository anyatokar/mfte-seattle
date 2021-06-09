import { useEffect } from 'react';
import { useState } from 'react';
import Map from "../Map/Map";
import { loadMapApi } from "../utils/GoogleMapsUtils";
import 'firebase/firestore';

export default function SavedHomesMap(props:any) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    
    const googleMapScript = loadMapApi();
    googleMapScript.addEventListener('load', function () {
      setScriptLoaded(true);
    });
  }, []);

  return (
    <>
      <div className="col col-no-padding">
        {scriptLoaded && (
          <Map
            mapType={google.maps.MapTypeId.ROADMAP}
            mapTypeControl={true}
            filteredBuildings={props.savedBuildings}
          />
        )}
      </div>
    </>
  );
}