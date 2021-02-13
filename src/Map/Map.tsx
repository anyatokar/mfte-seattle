import React, {useEffect, useRef, useState, useCallback} from 'react';
import './Map.scss';
import 'firebase/firestore';
import IMap from "../interfaces/IMap";
import IBuilding from '../interfaces/IBuilding';
// import {InfoWindow} from 'google-map-react';
// import {InfoWindow} from '@types/google-map-react'


type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
type InfoWindow = google.maps.InfoWindow;



let Markers:any = [];

const Map: React.FC<IMap> = ({ mapType, mapTypeControl = false, filteredBuildings}) => {

  

  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();
  // const [infoWindow, setInfoWindow] = useState<InfoWindow>();

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
    const defaultAddress = new google.maps.LatLng(47.608013, -122.315);
    initMap(14, defaultAddress);
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

  // const [infoWindowContent, setInfoWindowContent] = useState("something about building")

  drop(filteredBuildings)

  function drop(filteredBuildings:Array<IBuilding>) {
    const infoWindow = new google.maps.InfoWindow({content: ''});
    deleteMarkers();
    for (let i = 0; i < filteredBuildings.length; i++) {
      addMarker(filteredBuildings[i], infoWindow);
    }
  }

  function addMarker(building:IBuilding, infoWindow:InfoWindow) {
    const marker = new google.maps.Marker({ 
      position: new google.maps.LatLng({lat: building.lat, lng: building.lng}),
      map: map,
      animation: google.maps.Animation.DROP,
    });
    
    Markers.push(marker);

    let contentString = 
      '<div>' +
        '<h5>' + building.buildingName + '</h5>' + 
        '<h6>' + building.residentialTargetedArea + '</h6>' + 
        '<p>' + building.streetNum + " "
        + building.street +
        '<br>' +
        // TODO upload state to db
        building.city + ', ' +
        building.state + " " +
        building.zip  + '</p>' +
        building.phone +
        '<a href=' + building.urlforBuilding + '>' +
        '<br>' +
        building.urlforBuilding +
        // '<br>' +
        // '<button className="btn btn-info btn-sm">' + 
        // 'Save to list' + 
        // '</button>' +
      '</div>'


    // mouseover
    marker.addListener("click", () => {
      infoWindow.setContent(contentString)
      infoWindow.open(map, marker);
    });
  }

  return (
    <div className="map-container">
      <div ref={ref} className="map-container__map"></div>
    </div>
  );
};

export default Map;