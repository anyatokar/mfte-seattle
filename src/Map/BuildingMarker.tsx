/// <reference types="googlemaps" />
import { useCallback } from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import IBuilding from '../interfaces/IBuilding';
import { Button } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import { useState, useContext } from "react";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";

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
  } = building;

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
            <br />
            <strong>{ building.residentialTargetedArea }</strong>
            <br /><br />
            { building.streetNum } { building.street }
            <br />
            { building.city }, { building.state } { building.zip }
            <br />
            { building.phone ?
              (
                <>
                  <br />
                  <a href={ `tel:${building.phone}` }>{ building.phone }</a>
                  <br />
                </>
              ) : ''
            }
            { building.phone2 ?
              (
                <>
                  <a href={ `tel:${building.phone2}` }>{ building.phone2 }</a>
                  <br />
                </>
              ) : ''
            }
            <br />
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
