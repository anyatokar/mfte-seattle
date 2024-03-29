/// <reference types="googlemaps" />
import { useCallback } from "react";
import { InfoWindow, Marker } from "@react-google-maps/api";
import { useAuth } from "../contexts/AuthContext";
import { useState, useContext } from "react";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";
import {
  AddressAndPhone,
  BuildingName,
} from "../components/BuildingContactInfo";
import IBuilding from "../interfaces/IBuilding";
import Button from "react-bootstrap/Button";

interface IBuildingMarkerProps {
  building: IBuilding;
  isSelected: boolean;
  setSelectedBuilding: (building: IBuilding | null) => void;
  isSaved: boolean;
}

export function BuildingMarker(props: IBuildingMarkerProps) {
  const {
    building,
    isSelected,
    setSelectedBuilding,
    isSaved: wasOriginallySaved,
  } = props;
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
    lng,
  } = building;

  const onMarkerClick = useCallback(
    () => setSelectedBuilding(isSelected ? null : building),
    [isSelected, building, setSelectedBuilding]
  );

  const clearSelection = useCallback(
    () => setSelectedBuilding(null),
    [setSelectedBuilding]
  );

  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  const { currentUser } = useAuth();
  const [isSaved, setIsSaved] = useState(wasOriginallySaved);

  function toggleSave() {
    if (wasOriginallySaved || isSaved) {
      setIsSaved(false);
      deleteBuilding(currentUser?.uid, buildingID, buildingName);
    } else {
      setIsSaved(true);
      saveBuilding(currentUser?.uid, building);
    }
  }

  return (
    <Marker
      position={{
        lat: lat,
        lng: lng,
      }}
      onClick={onMarkerClick}
    >
      {isSelected && (
        <InfoWindow onCloseClick={clearSelection}>
          <>
            <strong>
              <BuildingName
                buildingName={buildingName}
                urlForBuilding={urlForBuilding}
              />
            </strong>
            <strong>{residentialTargetedArea}</strong>
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
            {currentUser ? (
              wasOriginallySaved || isSaved ? (
                <Button
                  className="diy-solid-info-button"
                  size="sm"
                  onClick={toggleSave}
                >
                  Saved
                </Button>
              ) : (
                <Button
                  className="diy-outline-info-button"
                  size="sm"
                  onClick={toggleSave}
                >
                  Save
                </Button>
              )
            ) : (
              <>
                <Button
                  className="diy-outline-info-button"
                  size="sm"
                  onClick={handleShowLogin}
                >
                  Save
                </Button>
              </>
            )}
          </>
        </InfoWindow>
      )}
    </Marker>
  );
}
