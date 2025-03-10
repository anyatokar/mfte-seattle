import { firebaseConfig } from "../db/firebase";

import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import BuildingMarker from "./BuildingMarker";
import Legend from "./Legend";
import { getSavedData } from "../components/BuildingsList";

import IBuilding from "../interfaces/IBuilding";
import IMap from "../interfaces/IMap";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const seattle = {
  lat: 47.608013,
  lng: -122.315,
};
const mapBounds = {
  latLngBounds: {
    north: 47.9,
    south: 47.4919,
    west: -122.4594,
    east: -122.2244,
  },
};

const ReactMap: React.FC<IMap> = ({
  resultBuildingsUnsorted = [],
  savedBuildings,
  mapHeight,
  shouldScroll,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(
    null
  );

  const [buildingsToMap, setBuildingsToMap] = useState(resultBuildingsUnsorted);

  useEffect(() => {
    setBuildingsToMap(resultBuildingsUnsorted);
  }, [resultBuildingsUnsorted]);

  useEffect(() => {
    if (
      selectedBuilding &&
      !resultBuildingsUnsorted.some(
        (b) => b.buildingID === selectedBuilding.buildingID
      )
    ) {
      setSelectedBuilding(null);
    }
  }, [resultBuildingsUnsorted, selectedBuilding]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: firebaseConfig.apiKey,
  });

  return (
    isLoaded && (
      <Container fluid>
        <Row>
          <Col
            className="p-0 map-and-list-container"
            style={{ width: "100%", height: mapHeight }}
          >
            <GoogleMap
              mapContainerClassName="map-container"
              center={seattle}
              zoom={12.5}
              options={{
                restriction: mapBounds,
                mapTypeControl: true,
                mapTypeControlOptions: {
                  style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                  position: google.maps.ControlPosition.TOP_LEFT,
                  mapTypeIds: [
                    google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.SATELLITE,
                    google.maps.MapTypeId.TERRAIN,
                    google.maps.MapTypeId.HYBRID,
                  ],
                },
                mapId: "c8d48b060a22a457",
              }}
            >
              {buildingsToMap.map((building) => (
                <BuildingMarker
                  key={building.buildingID}
                  building={building}
                  isSelected={building === selectedBuilding}
                  setSelectedBuilding={setSelectedBuilding}
                  savedHomeData={getSavedData(savedBuildings, building)}
                  shouldScroll={shouldScroll}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                }}
              >
                {<Legend />}
              </div>
            </GoogleMap>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default ReactMap;
