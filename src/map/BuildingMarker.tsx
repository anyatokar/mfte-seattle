/// <reference types="googlemaps" />
import { useCallback, useContext, MutableRefObject } from "react";
import { InfoWindow, Marker } from "@react-google-maps/api";

import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";

import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";

import { AddressAndPhone } from "../components/AddressAndPhone";
import ListingButton from "../components/ListingButton";
import SaveButton from "../components/SaveButton";
import WebsiteButton from "../components/WebsiteButton";

import IBuilding from "../interfaces/IBuilding";
import { listingStatusEnum } from "../types/enumTypes";

import Stack from "react-bootstrap/Stack";
import ISavedBuilding from "../interfaces/ISavedBuilding";

interface IBuildingMarkerProps {
  building: IBuilding;
  isSelected: boolean;
  setSelectedBuilding: (building: IBuilding | null) => void;
  savedHomeData: ISavedBuilding | undefined;
  shouldScroll: MutableRefObject<boolean>;
}

const BuildingMarker: React.FC<IBuildingMarkerProps> = ({
  building,
  isSelected,
  setSelectedBuilding,
  savedHomeData,
  shouldScroll,
}) => {
  const { buildingID, buildingName, address, contact } = building;

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

  function handleToggleSaveBuilding() {
    if (savedHomeData) {
      deleteBuilding(currentUser?.uid, buildingID, buildingName);
    } else {
      saveBuilding(currentUser?.uid, buildingID, buildingName);
    }
    shouldScroll.current = false;
  }

  function getIcon() {
    const hasListing =
      building.listing?.listingStatus === listingStatusEnum.ACTIVE;

    return {
      path: "M0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: hasListing ? "red" : "#10345c",
      strokeColor: "black",
      strokeWeight: currentUser && savedHomeData ? 3 : 1,
      fillOpacity: hasListing ? 1 : 0.8,
      rotation: 0,
      scale: 1.25,
      anchor: new google.maps.Point(0, 20),
    };
  }

  return (
    <Marker
      position={{
        lat: address.lat,
        lng: address.lng,
      }}
      onClick={onMarkerClick}
      icon={getIcon()}
    >
      {isSelected && (
        <InfoWindow onCloseClick={clearSelection}>
          <>
            <div>
              {building.listing?.url && (
                <>
                  <ListingButton listing={building.listing} isMarker={true} />
                </>
              )}
            </div>
            <div className={building.listing?.url ? "pt-2" : ""}>
              <div>
                <strong>{buildingName}</strong>
              </div>
              <div>{address.neighborhood}</div>
              <div className="my-2">
                <AddressAndPhone
                  buildingName={buildingName}
                  address={address}
                  contact={contact}
                  withLinks={true}
                />
              </div>

              {currentUser ? (
                savedHomeData ? (
                  <Stack direction={"horizontal"} gap={2}>
                    <WebsiteButton urlForBuilding={contact.urlForBuilding} />
                    <SaveButton
                      isSaved={true}
                      onClickCallback={handleToggleSaveBuilding}
                    />
                  </Stack>
                ) : (
                  <Stack direction={"horizontal"} gap={2}>
                    <WebsiteButton urlForBuilding={contact.urlForBuilding} />
                    <SaveButton
                      isSaved={false}
                      onClickCallback={handleToggleSaveBuilding}
                    />
                  </Stack>
                )
              ) : (
                <Stack direction={"horizontal"} gap={2}>
                  <WebsiteButton urlForBuilding={contact.urlForBuilding} />
                  <SaveButton
                    isSaved={false}
                    onClickCallback={handleShowLogin}
                  />
                </Stack>
              )}
            </div>
          </>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default BuildingMarker;
