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
import { willShowAvailTable } from "../../utils/generalUtils";
import { TableParentEnum, TableTypeEnum } from "../../types/enumTypes";

import { MarkersObj } from "./AllMarkers";
import { AddressAndPhone } from "../shared/AddressAndPhone";
import BuildingDataTable from "../shared/BuildingDataTable";
import SaveButton from "../shared/SaveButton";
import WebsiteButton from "../../components/shared/WebsiteButton";
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
              <div>{address.neighborhood}</div>

              <div className="mt-2">
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

              <div className="my-2">
                <AddressAndPhone
                  buildingName={buildingName}
                  address={address}
                  contact={contact}
                  withLinks={true}
                />
              </div>
            </>
          }
        >
          {willShowAvailTable(building.listing) && (
            <BuildingDataTable
              type={TableTypeEnum.availData}
              data={building.listing.availDataArray}
              tableParent={TableParentEnum.MARKER}
            />
          )}
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default BuildingMarker;
