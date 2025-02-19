/// <reference types="googlemaps" />
import { useCallback, useState, useContext } from "react";
import { InfoWindow, Marker } from "@react-google-maps/api";
import { areListingsOn } from "../config/config";

import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";

import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";

import { AddressAndPhone } from "../components/BuildingContactInfo";
import ListingButton from "../components/ListingButton";
import SaveButton from "../components/SaveButton";
import WebsiteButton from "../components/WebsiteButton";

import IBuilding from "../interfaces/IBuilding";
import { accountTypeEnum, listingStatusEnum } from "../types/enumTypes";

import Stack from "react-bootstrap/Stack";

interface IBuildingMarkerProps {
  building: IBuilding;
  isSelected: boolean;
  setSelectedBuilding: (building: IBuilding | null) => void;
  isSaved: boolean;
}

const BuildingMarker: React.FC<IBuildingMarkerProps> = ({
  building,
  isSelected,
  setSelectedBuilding,
  isSaved: wasOriginallySaved,
}) => {
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

  const { currentUser, accountType } = useAuth();
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

  function getIcon() {
    const hasListing =
      building.listing?.listingStatus === listingStatusEnum.ACTIVE;

    return {
      path: "M0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: hasListing ? "red" : "#10345c",
      strokeColor: wasOriginallySaved || isSaved ? "black" : "",
      strokeWeight: wasOriginallySaved || isSaved ? 3 : 0,
      fillOpacity: hasListing ? 1 : 0.8,
      rotation: 0,
      scale: 1.25,
      anchor: new google.maps.Point(0, 20),
    };
  }

  return (
    <Marker
      position={{
        lat: lat,
        lng: lng,
      }}
      onClick={onMarkerClick}
      icon={getIcon()}
    >
      {isSelected && (
        <InfoWindow onCloseClick={clearSelection}>
          <>
            <div>
              {areListingsOn && building.listing?.url && (
                <>
                  <ListingButton listing={building.listing} isMarker={true} />
                </>
              )}
            </div>
            <div
              className={areListingsOn && building.listing?.url ? "pt-2" : ""}
            >
              <div>
                <strong>{buildingName}</strong>
              </div>
              <div>{residentialTargetedArea}</div>
              <div className="my-2">
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
              </div>
              {accountType !== accountTypeEnum.MANAGER &&
                (currentUser ? (
                  wasOriginallySaved || isSaved ? (
                    <Stack direction={"horizontal"} gap={2}>
                      <WebsiteButton urlForBuilding={urlForBuilding} />
                      <SaveButton isSaved={true} onClickCallback={toggleSave} />
                    </Stack>
                  ) : (
                    <Stack direction={"horizontal"} gap={2}>
                      <WebsiteButton urlForBuilding={urlForBuilding} />
                      <SaveButton
                        isSaved={false}
                        onClickCallback={toggleSave}
                      />
                    </Stack>
                  )
                ) : (
                  <Stack direction={"horizontal"} gap={2}>
                    <WebsiteButton urlForBuilding={urlForBuilding} />
                    <SaveButton
                      isSaved={false}
                      onClickCallback={handleShowLogin}
                    />
                  </Stack>
                ))}
              {accountType === accountTypeEnum.MANAGER && (
                <WebsiteButton urlForBuilding={urlForBuilding} />
              )}
            </div>
          </>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default BuildingMarker;
