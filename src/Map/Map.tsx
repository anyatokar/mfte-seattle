import React, {useEffect, useRef, useState, useCallback} from 'react';
import './Map.scss';
import 'firebase/firestore';
import IMap from "../interfaces/IMap";
import IBuilding from '../interfaces/IBuilding';

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
// type InfoWindow = google.maps.InfoWindow;

let Markers:any = [];

const Map: React.FC<IMap> = ({ mapType, mapTypeControl = false, filteredBuildings}) => {

  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();
  const [infoWindow, setInfoWindow] = useState<InfoWindow>();

  const startMap = (): void => {
    if (!map) {
      defaultMapStart();
    }
  };

  const initMap = useCallback((zoomLevel: number, address: GoogleLatLng): void => {
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
  }, [mapType, mapTypeControl]);

  const defaultMapStart = useCallback((): void => {
    const defaultAddress = new google.maps.LatLng(47.608013, -122.335167);
    initMap(12, defaultAddress);
  }, [initMap]);

  useEffect(startMap, [map, defaultMapStart]);

  function setMapOnAll(map: google.maps.Map | null) {
    for (let i = 0; i < Markers.length; i++) {
      Markers[i].setMap(map);
    }
  }
  
  function clearMarkers() {
    setMapOnAll(null);
  }

  function deleteMarkers() {
    clearMarkers();
    Markers = [];
  }

  drop(filteredBuildings)

  function drop(filteredBuildings:Array<IBuilding>) {
    deleteMarkers();
    for (var i = 0; i < filteredBuildings.length; i++) {
      addMarker(filteredBuildings[i]);
    }
  }

  function addMarker(building:IBuilding) {
    const marker = new google.maps.Marker({ 
      position: new google.maps.LatLng({lat: building.lat, lng: building.lng}),
      map: map,
      animation: google.maps.Animation.DROP,
    })
    Markers.push(marker);
  }

  return (
    <div className="map-container">
      <div ref={ref} className="map-container__map"></div>
    </div>
  );
};

export default Map;