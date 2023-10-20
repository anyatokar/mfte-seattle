/// <reference types="googlemaps" />
import { useCallback } from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import IBuilding from '../interfaces/IBuilding';
import { Button } from 'react-bootstrap';
import firebase from "../db/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useState, useContext } from "react";
import { ModalContext, ModalState } from "../contexts/ModalContext";

// TODO: Having a Saved button is useless here BUT it's for an upcoming toggle.
interface IBuildingMarkerProps {
  building: IBuilding,
  isSelected: boolean,
  setSelectedBuilding: (building: IBuilding | null) => void
  isSaved: boolean;
};

export function BuildingMarker(props: IBuildingMarkerProps) {
  const { building, isSelected, setSelectedBuilding, isSaved: wasOriginallySaved } = props;

  const onMarkerClick = useCallback(
    () => setSelectedBuilding(isSelected ? null : building),
    [isSelected, building, setSelectedBuilding]
  );

  const clearSelection = useCallback(
    () => setSelectedBuilding(null),
    [setSelectedBuilding]
  );

  const [/* modalState */, setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  const {currentUser} = useAuth() as any;
  const {
    buildingID,
    buildingName,
    phone,
    phone2,
    residentialTargetedArea,
    totalRestrictedUnits,
    sedu,
    studioUnits,
    oneBedroomUnits, 
    twoBedroomUnits,
    threePlusBedroomUnits,
    urlForBuilding,
    streetNum,
    street, 
    city,
    state, 
    zip,
    lat, 
    lng,
  } = building;

  const [isSaved, setIsSaved] = useState(false);

  function saveBuilding(e: any) {
    setIsSaved(true);
    firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes").doc(buildingID)
    .set({
      "buildingID": buildingID,
      "buildingName": buildingName,
      "phone": phone,
      "phone2": phone2,
      "residentialTargetedArea": residentialTargetedArea,
      "totalRestrictedUnits": totalRestrictedUnits,
      "sedu": sedu,
      "studioUnits": studioUnits,
      "oneBedroomUnits": oneBedroomUnits, 
      "twoBedroomUnits": twoBedroomUnits,
      "threePlusBedroomUnits": threePlusBedroomUnits,
      "urlForBuilding": urlForBuilding,
      "streetNum": streetNum,
      "street": street, 
      "city": city,
      "state": state, 
      "zip": zip,
      "lat": lat,
      "lng": lng,
    })
    .then(() => {
      console.log("Building saved to user");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  };

  return (
    <Marker
      animation={ google.maps.Animation.DROP }
      position={{
        lat: building.lat,
        lng: building.lng
      }}
      onClick={ onMarkerClick }
    >
      {
        isSelected &&
        <InfoWindow onCloseClick={ clearSelection }>
          <>
            <strong>
              <a
                href={ building.urlForBuilding }
                target='_blank'
                rel='noreferrer'
              >
                { building.buildingName }
              </a>
            </strong>
            <br/>
            <strong>{ building.residentialTargetedArea }</strong>
            <br/>
            { building.streetNum } { building.street }
            <br/>
            { building.city }, { building.state } { building.zip }
            <br/>
            <br/>
            <a href={ `tel:${building.phone}` }>{ building.phone }</a>
            <br/>
            <br/>
            { currentUser ? (
            (wasOriginallySaved || isSaved) ?
              <Button 
                variant="btn btn-info btn-sm"
                onClick={saveBuilding}
                role="button">
                Saved
              </Button>
              :
              <Button 
                variant="btn btn-outline-info btn-sm"
                onClick={saveBuilding}
                role="button">
                Save
              </Button>
            ) : (
            <>
              <Button onClick={handleShowLogin} variant="btn btn-outline-info btn-sm">
                Save
              </Button>
            </>
            )
          }
          </>
        </InfoWindow>
      }
    </Marker>
  );
}
