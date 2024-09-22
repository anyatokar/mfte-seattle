import { firebaseConfig } from "../db/firebase";

import { createRoot } from "react-dom/client";
import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { BuildingMarker } from "./BuildingMarker";
import Legend from "./Legend";
import { checkIsSaved, getListing } from "../components/BuildingsList";

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

const ReactMap: React.FC<IMap> = ({
  buildingsToMap = [],
  savedBuildings,
  allListings,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(
    null
  );
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const mapRef = useRef<GoogleMap>(null);

  useEffect(() => {
    if (selectedBuilding && !buildingsToMap.includes(selectedBuilding)) {
      setSelectedBuilding(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- No need for selectedBuilding in the deps list
  }, [buildingsToMap]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: firebaseConfig.apiKey,
  });

  // Legend for pin colors.
  // Seems strange to have it dependent on buildingsToMap changing
  // but it's so it persists when navigating between pages.
  // There's a isLegendVisible tag to keep it from rendering on every filter.
  useEffect(() => {
    if (isLoaded && mapRef.current && !isLegendVisible) {
      const map = mapRef.current.state.map;

      // Create a div for the custom legend
      const legendDiv = document.createElement("div");

      // Push the custom legend div to the map controls at the bottom-right corner
      map?.controls[window.google.maps.ControlPosition.LEFT_BOTTOM].push(
        legendDiv
      );

      const root = createRoot(legendDiv);
      root.render(<Legend />);
      setIsLegendVisible(true);
    }
  }, [buildingsToMap]);

  if (!isLoaded) {
    return null;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      ref={mapRef}
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
