import React, {useEffect, useRef, useState} from 'react';
import './Map.scss';
import firebase from '../db/firebase';
import 'firebase/firestore';
import { loadMapApi } from "../utils/GoogleMapsUtils";
import IMap from "../interfaces/IMap";
// import dot from "../assets/images/dot.png"

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
type InfoWindow = google.maps.InfoWindow;

const Map: React.FC<IMap> = ({ mapType, mapTypeControl = false}) => {

  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();
  // const [infoWindow, setInfoWindow] = useState<InfoWindow>();

  const startMap = (): void => {
    if (!map) {
      defaultMapStart();
    }
  };

  useEffect(startMap, [map]);

  const defaultMapStart = (): void => {
    const defaultAddress = new google.maps.LatLng(47.608013, -122.335167);
    initMap(10, defaultAddress);
  };

  const timer:number = 10;
  let markers:any = [];

  const initMap = (zoomLevel: number, address: GoogleLatLng): void => {
    if (ref.current) {
      setMap( 
        new google.maps.Map(ref.current, {
          zoom: zoomLevel,
          center: address,
          mapTypeControl: mapTypeControl,
          streetViewControl: false,
          rotateControl: false,
          scaleControl: true,
          fullscreenControl: false,
          panControl: false,
          zoomControl: true,
          gestureHandling: 'cooperative',
          mapTypeId: mapType,
          draggableCursor: 'pointer',
        })
      )
    }
  };

  function clearMarkers(del:any) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    if(del === true){
        markers = [];
    }
  }

// const [scriptLoaded, setScriptLoaded] = useState(false);

// useEffect(() => {
//   const googleMapScript = loadMapApi();
//   googleMapScript.addEventListener('load', function () {
//     setScriptLoaded(true);
//   });
// }, []);

const [buildings, setBuildings] = useState([] as any);
const [loading, setLoading] = useState(false);

const refB = firebase.firestore().collection("buildings");

function getBuildings() {
  setLoading(true);
  refB.onSnapshot((querySnapshot) => {
    const items: Array<object> = [];
    querySnapshot.forEach((doc) => {
        items.push(doc.data());
    });
    setBuildings(items)
    setLoading(false)
  });
}

useEffect(() => {
    getBuildings();
}, []);

const sites = [{address: 'Seattle, WA' }]

drop(buildings)

  function drop(filteredMeetings:any) {
    clearMarkers(true);
    for (var i = 0; i < filteredMeetings.length; i++) {
        addMarkerWithTimeout(filteredMeetings[i], 0);
    }
}

function addMarkerWithTimeout(
  building:any, 
  timeout:number
) {
  window.setTimeout(function() {


      // var p = new google.maps.LatLng(building.lat, building.lng);
      // var boolAm = false;
      // var boolNoon = false;
      // var boolPm = false;
      var infoContent = '<span class="bold caps">' + 
              building.buildingName + '<br>' + 
              building.phone + '<br>' + 
              building.urlforBuilding + '</span>';

          const marker = new google.maps.Marker({ 
          position: new google.maps.LatLng({lat: building.lat, lng: building.lng}),
          map: map,
          animation: google.maps.Animation.DROP,
          // icon: dot
          })

      markers.push(marker);
      // add infowindow with closure
      google.maps.event.addListener(marker, 'click', (function(marker, building) {
          return function() {
              // infoWindow.setContent(infoContent);
              // infoWindow.open(map, marker);
          };
      })(marker, building));
  }, timeout)
}

  return (
    <div className="map-container">
      <div ref={ref} className="map-container__map"></div>
    </div>
  );
};

export default Map;