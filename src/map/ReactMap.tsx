import { firebaseConfig } from "../db/firebase";
import { allBuildingsMaxHeight, areListingsOn } from "../config/config";

import { createRoot } from "react-dom/client";
import { useEffect, useState, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { BuildingMarker } from "./BuildingMarker";
import Legend from "./Legend";
import { checkIsSaved, getListing } from "../components/BuildingsList";

import IBuilding from "../interfaces/IBuilding";
import IMap from "../interfaces/IMap";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const containerStyle = {
  width: "100%",
  height: allBuildingsMaxHeight,
};

const center = {
  lat: 47.608013,
  lng: -122.315,
};

const ReactMap: React.FC<IMap> = ({
  resultBuildingsUnsorted = [],
  savedBuildings,
  allListings,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(
    null
  );
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const mapRef = useRef<GoogleMap>(null);
  const [buildingsToMap, setBuildingsToMap] = useState<IBuilding[]>([]);

  // Update buildingsToMap when resultBuildingsUnsorted changes
  useEffect(() => {
    setBuildingsToMap(resultBuildingsUnsorted);
  }, [resultBuildingsUnsorted]);

  useEffect(() => {
    if (
      areListingsOn &&
      selectedBuilding &&
      !resultBuildingsUnsorted.includes(selectedBuilding)
    ) {
      setSelectedBuilding(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- No need for selectedBuilding in the deps list
  }, [resultBuildingsUnsorted]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultBuildingsUnsorted]);

  if (!isLoaded) {
    return null;
  }

  return (
    <Container fluid>
      <Row>
        <Col className="p-0">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12.5}
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
        </Col>
      </Row>
    </Container>
  );
};

export default ReactMap;
