import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { BuildingMarker } from './BuildingMarker';
import IMap from '../interfaces/IMap';
import IBuilding from '../interfaces/IBuilding';

const containerStyle = {
  width: '100%',
  height: '80vh'
};

const center = {
  lat: 47.608013,
  lng: -122.315
};

export function ReactMap(props: IMap) {
  const { filteredBuildings = [] } = props;
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(null);

  useEffect(() => {
    if (selectedBuilding && !filteredBuildings.includes(selectedBuilding)) {
      setSelectedBuilding(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- No need for selectedBuilding in the deps list
  }, [filteredBuildings]);

  return (
    <LoadScript
      googleMapsApiKey={ `${process.env.REACT_APP_APIKEY}` }
      libraries={ ["places"] }
      language="en"
      version="quarterly"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
      >
        <>
          {
            filteredBuildings.map(building => 
              <BuildingMarker
                key={ building.buildingID }
                building={ building }
                isSelected={ building === selectedBuilding }
                setSelectedBuilding={ setSelectedBuilding }
              />
            )
          }
        </>
      </GoogleMap>
    </LoadScript>
  )
};
