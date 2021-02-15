import React, {useEffect, useRef, useState, useCallback} from 'react';
import './Map.scss';
import 'firebase/firestore';
import IMap from "../interfaces/IMap";
// import Moment from "react-moment";
import IBuilding from "../interfaces/IBuilding";
import firebase from "../db/firebase"
import { useAuth } from "../contexts/AuthContext";
import { Card, ListGroup, ListGroupItem, Navbar, Nav, ButtonGroup, Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import Login from "../auth_components/Login"

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
type InfoWindow = google.maps.InfoWindow;

let Markers:any = [];

const Map: React.FC<IMap> = ({ mapType, mapTypeControl = false, filteredBuildings }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();

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

  drop(filteredBuildings)

  function drop(filteredBuildings:Array<IBuilding>) {
    const infoWindow = new google.maps.InfoWindow({content: ''});
    deleteMarkers();
    for (let i = 0; i < filteredBuildings.length; i++) {
      addMarker(filteredBuildings[i], infoWindow);
    }
  }

  const { currentUser } = useAuth() as any
  // const {
  //   buildingID,
  //   buildingName,
  //   phone,
  //   residentialTargetedArea,
  //   totalRestrictedUnits,
  //   studioUnits,
  //   oneBedroomUnits, 
  //   twoBedroomUnits,
  //   threePlusBedroomUnits,
  //   urlforBuilding,
  //   streetNum,
  //   street, 
  //   city,
  //   state, 
  //   zip,
  //   lat, 
  //   lng
  // } = props;

  function saveBuilding(buildingID: any) {
    firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes").doc(buildingID).set(
      {
        // could not access data from buildingRef code below
        // buildingRef: firebase.firestore().collection("buildings").doc(buildingID)
        "buildingID": buildingID,
        // "buildingName": buildingName,
        // "phone": phone,
        // "residentialTargetedArea": residentialTargetedArea,
        // "totalRestrictedUnits": totalRestrictedUnits,
        // "studioUnits": studioUnits,
        // "oneBedroomUnits": oneBedroomUnits, 
        // "twoBedroomUnits": twoBedroomUnits,
        // "threePlusBedroomUnits": threePlusBedroomUnits,
        // "urlforBuilding": urlforBuilding,
        // "streetNum": streetNum,
        // "street": street, 
        // "city": city,
        // "state": state, 
        // "zip": zip,
        // "lat": lat,
        // "lng": lng
      })
    .then(() => {
      console.log("Building saved to user");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    })
  }

  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  function onClickInfowindow(buildingID: any) {
    if (currentUser) {
      saveBuilding(buildingID)
    } else {
      <>
        <Modal show={showLogin} onHide={handleCloseLogin}>
          <Login />
        </Modal>
      </>
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
        '<strong><a href=' + 
        building.urlforBuilding + ' ' +
        `target='_blank' rel='noreferrer'>` +
        '<br>' +
        building.buildingName + '</a></strong>' + 
        '<br>' +
        '<strong>' + building.residentialTargetedArea + '</strong>' + 
        '<br>' +
        + building.streetNum + " "
        + building.street +
        '<br>' +
        building.city + ', ' +
        building.state + ' ' +
        building.zip  + 
        '<br>' +
        building.phone +
        '<br>'
        // `<a onClick="onClickInfowindow("building.buildingID");">Save to List</a>` +
  

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