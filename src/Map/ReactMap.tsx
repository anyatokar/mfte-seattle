import { GoogleMap, LoadScript } from '@react-google-maps/api';
import IMap from "../interfaces/IMap";

const containerStyle = {
  width: '100%',
  height: '80vh'
};

const center = {
  lat: 47.608013,
  lng: -122.315
};

export function ReactMap(props: IMap) {
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
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
    </LoadScript>
  )
};
