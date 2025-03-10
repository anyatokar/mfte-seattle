import { useCallback, useContext, MutableRefObject } from "react";

import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";
import { Marker } from "@googlemaps/markerclusterer";

import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";

import { AddressAndPhone } from "../components/AddressAndPhone";
import WebsiteButton from "../components/WebsiteButton";
import SaveButton from "../components/SaveButton";

import IBuilding from "../interfaces/IBuilding";
import ISavedBuilding from "../interfaces/ISavedBuilding";
import Stack from "react-bootstrap/Stack";
import { MarkersObj } from "./AllMarkers";

interface IBuildingMarkerProps {
  building: IBuilding;
  setMarkerRef: (marker: Marker | null, key: string) => MarkersObj | undefined;
  markerRef: Marker;
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
  setMarkerRef,
  markerRef,
}) => {
  const { buildingID, buildingName, address, contact } = building;

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

  function handleClose() {
    setSelectedBuilding(null);
  }

  return (
    <AdvancedMarker
      key={building.buildingID}
      position={{ lat: building.address.lat, lng: building.address.lng }}
      ref={(marker) => setMarkerRef(marker, building.buildingID)}
      onClick={() => setSelectedBuilding(building)}
    >
      <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />

      {isSelected && (
        <InfoWindow anchor={markerRef} onClose={handleClose}>
          <>
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
                    <WebsiteButton building={building} />
                    <SaveButton
                      isSaved={true}
                      onClickCallback={handleToggleSaveBuilding}
                    />
                  </Stack>
                ) : (
                  <Stack direction={"horizontal"} gap={2}>
                    <WebsiteButton building={building} />
                    <SaveButton
                      isSaved={false}
                      onClickCallback={handleToggleSaveBuilding}
                    />
                  </Stack>
                )
              ) : (
                <Stack direction={"horizontal"} gap={2}>
                  <WebsiteButton building={building} />
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
    </AdvancedMarker>
  );
};

export default BuildingMarker;
