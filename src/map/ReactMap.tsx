import { firebaseConfig } from "../db/firebase";
import { areListingsOn } from "../config/config";

import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import BuildingMarker from "./BuildingMarker";
import Legend from "./Legend";
import { checkIsSaved } from "../components/BuildingsList";

import IBuilding from "../interfaces/IBuilding";
import IMap from "../interfaces/IMap";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const center = {
  lat: 47.608013,
  lng: -122.315,
};

const ReactMap: React.FC<IMap> = ({
  resultBuildingsUnsorted = [],
  savedBuildings,
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
      areListingsOn &&
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
          <Col className="p-0">
            <GoogleMap
              mapContainerClassName="map-and-list-container"
              center={center}
              zoom={12.5}
              options={{ mapId: "c8d48b060a22a457" }}
            >
              {buildingsToMap.map((building) => (
                <BuildingMarker
                  key={building.buildingID}
                  building={building}
                  isSelected={building === selectedBuilding}
                  setSelectedBuilding={setSelectedBuilding}
                  isSaved={checkIsSaved(savedBuildings, building)}
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
