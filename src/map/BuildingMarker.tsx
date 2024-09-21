/// <reference types="googlemaps" />
import { useCallback, useState, useContext } from "react";
import { InfoWindow, Marker } from "@react-google-maps/api";
import { useAuth } from "../contexts/AuthContext";

import { areListingsOn } from "../config/config";

import { ModalContext, ModalState } from "../contexts/ModalContext";
import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";
import { AddressAndPhone } from "../components/BuildingContactInfo";
import ListingCard from "../components/ListingCard";

import IBuilding from "../interfaces/IBuilding";
import IListing from "../interfaces/IListing";

import Button from "react-bootstrap/Button";

interface IBuildingMarkerProps {
  building: IBuilding;
  isSelected: boolean;
  setSelectedBuilding: (building: IBuilding | null) => void;
  isSaved: boolean;
  listing: IListing | undefined;
}

export function BuildingMarker(props: IBuildingMarkerProps) {
  const {
    building,
    isSelected,
    setSelectedBuilding,
    isSaved: wasOriginallySaved,
    listing,
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

  const svgMarkerNoListing = {
    path: "M0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "#10345c",
    strokeColor: "black",
    strokeWeight: 1,
    fillOpacity: 0.8,
    rotation: 0,
    scale: 1.25,
    anchor: new google.maps.Point(0, 20),
  };

  const svgMarkerListing = {
    path: "M0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "red",
    strokeColor: "black",
    strokeWeight: 1,
    fillOpacity: 1,
    rotation: 0,
    scale: 1.25,
    anchor: new google.maps.Point(0, 20),
  };

  const icon =
    areListingsOn && listing?.hasAnyAvailability
      ? svgMarkerListing
      : svgMarkerNoListing;

  return (
    <Marker
      position={{
        lat: lat,
        lng: lng,
      }}
      onClick={onMarkerClick}
      icon={icon}
    >
      {isSelected && (
        <InfoWindow onCloseClick={clearSelection}>
          <>
            <div>
              {areListingsOn && listing?.url && (
                <>
                  <ListingCard
                    areListingsOn={areListingsOn}
                    listing={listing}
                    isMarker={true}
                    urlForBuilding={urlForBuilding}
                  />
                </>
              )}
            </div>
            <div className={areListingsOn && listing?.url ? "pt-2" : ""}>
              <div>
                <strong>{buildingName}</strong>
              </div>
              <div>{residentialTargetedArea}</div>
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
            </div>
          </>
        </InfoWindow>
      )}
    </Marker>
  );
}
