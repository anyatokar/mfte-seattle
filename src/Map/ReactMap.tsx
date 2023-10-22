import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { BuildingMarker } from './BuildingMarker';
import IMap from '../interfaces/IMap';
import IBuilding from '../interfaces/IBuilding';
import { checkIsSaved } from '../components/AllBuildingsList';
import { firebaseConfig } from '../db/firebase';

const containerStyle = {
  width: '100%',
  height: '80vh'
};

const center = {
  lat: 47.608013,
  lng: -122.315
};

// Statically define libraries to avoid the "LoadScript has been reloaded
// unintentionally!" performance warning.
const LIBRARIES: ("places")[] = ["places"];

export function ReactMap(props: IMap) {
  const { buildingsToMap = [] } = props;
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(null);

  useEffect(() => {
    if (selectedBuilding && !buildingsToMap.includes(selectedBuilding)) {
      setSelectedBuilding(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- No need for selectedBuilding in the deps list
  }, [buildingsToMap]);

  return (
    <LoadScript
      googleMapsApiKey={ firebaseConfig.apiKey }
      libraries={ LIBRARIES }
      language="en"
      version="quarterly"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        options={{mapId: 'c8d48b060a22a457'}}
      >
        <>
          {
            buildingsToMap.map(building => 
              <BuildingMarker
                key={ building.buildingID }
                building={ building }
                isSelected={ building === selectedBuilding }
                setSelectedBuilding={ setSelectedBuilding }
                isSaved={ checkIsSaved(props.savedBuildings, building) }
              />
            )
          }
        </>
      </GoogleMap>
    </LoadScript>
  )
};
