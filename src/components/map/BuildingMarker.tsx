import { useContext, MutableRefObject } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { ModalContext, ModalState } from "../../contexts/ModalContext";
import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Marker } from "@googlemaps/markerclusterer";
import { saveBuilding, deleteBuilding } from "../../utils/firestoreUtils";
import { MarkersObj } from "./AllMarkers";
import { AddressAndPhone } from "../shared/AddressAndPhone";
import FullDetailsButton from "../shared/FullDetailsButton";
import SaveButton from "../shared/SaveButton";
import WebsiteButton from "../../components/shared/WebsiteButton";
import { TableParentEnum } from "../../types/enumTypes";
import IBuilding from "../../interfaces/IBuilding";
import ISavedBuilding from "../../interfaces/ISavedBuilding";
import Stack from "react-bootstrap/Stack";

interface IBuildingMarkerProps {
  building: IBuilding;
  updateMarkerRefs: (
    marker: Marker | null,
    key: string
  ) => MarkersObj | undefined;
  isSelected: boolean;
  clearSelection: () => void;
  savedHomeData: ISavedBuilding | undefined;
  shouldScroll: MutableRefObject<boolean>;
  onMarkerClick: (ev: google.maps.MapMouseEvent, building: IBuilding) => void;
}

const BuildingMarker: React.FC<IBuildingMarkerProps> = ({
  building,
  isSelected,
  clearSelection,
  savedHomeData,
  shouldScroll,
  updateMarkerRefs,
  onMarkerClick,
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

  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      key={building.buildingID}
      position={{ lat: building.address.lat, lng: building.address.lng }}
      ref={(marker) => {
        markerRef(marker);
        updateMarkerRefs(marker, building.buildingID);
      }}
      onClick={(ev) => onMarkerClick(ev, building)}
      clickable={true}
    >
      <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />

      {isSelected && (
        <InfoWindow
          anchor={marker}
          onCloseClick={clearSelection}
          headerContent={
            <>
              <h6 className="mb-0">{buildingName}</h6>
              {address.neighborhood}
            </>
          }
        >
          <div className="mt-0 pt-0">
            <AddressAndPhone
              buildingName={buildingName}
              address={address}
              contact={contact}
              parentElement={TableParentEnum.MARKER}
            />
          </div>

          {/* Large screens only */}
          <div className="mt-2 d-none d-md-flex">
            <Stack direction="horizontal" gap={2}>
              <WebsiteButton building={building} />
              <SaveButton
                isSaved={currentUser && savedHomeData ? true : false}
                onClickCallback={
                  currentUser ? handleToggleSaveBuilding : handleShowLogin
                }
              />
            </Stack>
          </div>

          {/* Small screens only */}
          <div className="mt-2 d-flex d-md-none">
            <Stack gap={1}>
              <FullDetailsButton
                building={building}
                savedHomeData={savedHomeData}
                shouldScroll={shouldScroll}
              />
              <WebsiteButton building={building} />
              <SaveButton
                isSaved={currentUser && savedHomeData ? true : false}
                onClickCallback={
                  currentUser ? handleToggleSaveBuilding : handleShowLogin
                }
              />
            </Stack>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default BuildingMarker;
