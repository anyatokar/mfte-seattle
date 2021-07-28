import { useState } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
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

  const clearSelection = () => { setSelectedBuilding(null) };

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
              <Marker
                animation={ google.maps.Animation.DROP }
                position={{
                  lat: building.lat,
                  lng: building.lng
                }}
                onClick={() => setSelectedBuilding(building)}
                key={ building.buildingID }
              >
                
              </Marker>)
          }
          {
            selectedBuilding &&
            <InfoWindow
              position={{
                lat: selectedBuilding.lat,
                lng: selectedBuilding.lng
              }}
              onCloseClick={clearSelection}
            >
              <>
              <strong>
                <a
                  href={ selectedBuilding.urlForBuilding }
                  target='_blank'
                  rel='noreferrer'
                >
                  <br/>{ selectedBuilding.buildingName }
                </a>
              </strong>
              <br/>
              <strong>{ selectedBuilding.residentialTargetedArea }</strong>
              <br/>
              { selectedBuilding.streetNum } { selectedBuilding.street }
              <br/>
              { selectedBuilding.city }, { selectedBuilding.state } { selectedBuilding.zip }
              <br/>
              <br/>
              <a href={ `tel:${selectedBuilding.phone}` }>{ selectedBuilding.phone }</a>
              <br/>
              </>
            </InfoWindow>
          }
        </>
      </GoogleMap>
    </LoadScript>
  )
};
