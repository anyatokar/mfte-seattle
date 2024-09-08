import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { BuildingMarker } from "./BuildingMarker";
import { checkIsSaved, getListing } from "../components/BuildingsList";
import { firebaseConfig } from "../db/firebase";

import IBuilding from "../interfaces/IBuilding";
import IMap from "../interfaces/IMap";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const center = {
  lat: 47.608013,
  lng: -122.315,
};

// Statically define libraries to avoid the "LoadScript has been reloaded
// unintentionally!" performance warning.
// TODO: Is this library needed?
const LIBRARIES: "places"[] = ["places"];

const ReactMap: React.FC<IMap> = ({
  buildingsToMap = [],
  savedBuildings,
  allListings,
}) => {
  // const { buildingsToMap = [] } = props;
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(
    null
  );

  useEffect(() => {
    if (selectedBuilding && !buildingsToMap.includes(selectedBuilding)) {
      setSelectedBuilding(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- No need for selectedBuilding in the deps list
  }, [buildingsToMap]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: firebaseConfig.apiKey,
    libraries: LIBRARIES,
  });

  if (!isLoaded) {
    return null;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      options={{ mapId: "c8d48b060a22a457" }}
    >
      <>
        {buildingsToMap.map((building) => (
          <BuildingMarker
            key={building.buildingID}
            building={building}
            isSelected={building === selectedBuilding}
            setSelectedBuilding={setSelectedBuilding}
            isSaved={checkIsSaved(savedBuildings, building)}
            listing={getListing(allListings, building.buildingID)}
          />
        ))}
      </>
    </GoogleMap>
  );
};

export default ReactMap;
