/// <reference types="googlemaps" />
import { useCallback } from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import IBuilding from '../interfaces/IBuilding';
import { Button } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import { useState, useContext } from "react";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";
import AddressAndPhone from '../components/addressAndPhone';

interface IBuildingMarkerProps {
  building: IBuilding,
  isSelected: boolean,
  setSelectedBuilding: (building: IBuilding | null) => void
  isSaved: boolean;
};

export function BuildingMarker(props: IBuildingMarkerProps) {
  const { building, isSelected, setSelectedBuilding, isSaved: wasOriginallySaved } = props;
  const {
    buildingID,
    buildingName,
    urlForBuilding,
    residentialTargetedArea,
    streetNum,
    street,
    city,
    state,
    zip,
    phone,
    phone2,
    lat,
    lng
  } = building;

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
  const [isSaved, setIsSaved] = useState(wasOriginallySaved);

  function toggleSave() {
    if (wasOriginallySaved || isSaved) {
      setIsSaved(false);
      deleteBuilding(currentUser, buildingID, buildingName);
    } else {
      setIsSaved(true);
      saveBuilding(currentUser, building);
    }
  };

  return (
    <Marker
      position={{
        lat: lat,
        lng: lng
      }}
      onClick={ onMarkerClick }
    >
      {
        isSelected &&
        <InfoWindow onCloseClick={ clearSelection }>
          <>
            <strong>
              <a
                href={ urlForBuilding }
                target='_blank'
                rel='noreferrer'
              >
                { buildingName }
              </a>
            </strong>
            <br />
            <strong>{ residentialTargetedArea }</strong>
            <AddressAndPhone
                buildingName={buildingName}
                streetNum={streetNum}
                street={street}
                city={city}
                state={state}
                zip={zip}
                phone={phone}
                phone2={phone2}
              />
            { currentUser ? (
            (wasOriginallySaved || isSaved) ?
              <Button 
                variant="btn btn-info btn-sm"
                onClick={toggleSave}
                role="button">
                Saved
              </Button>
              :
              <Button 
                variant="btn btn-outline-info btn-sm"
                onClick={toggleSave}
                role="button">
                Save
              </Button>
            ) : (
            <>
              <Button onClick={handleShowLogin} variant="btn btn-outline-info btn-sm">
                Save
              </Button>
            </>
            )}
          </>
        </InfoWindow>
      }
    </Marker>
  );
}
