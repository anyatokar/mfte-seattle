import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import AllMarkers from "./AllMarkers";
import { firebaseConfig } from "../../db/firebase";
import IMap from "../../interfaces/IMap";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useState } from "react";

const ReactMap: React.FC<IMap> = ({
  resultBuildingsUnsorted = [],
  savedBuildings,
  mapHeight,
  shouldScroll,
  setSelectedBuildingId,
  selectedBuildingId,
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const seattleCoordinates = {
    lat: 47.62,
    lng: -122.315,
  };

  const mapTypeControlOptions = {
    style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    position: window.google.maps.ControlPosition.TOP_LEFT,
    mapTypeIds: [
      window.google.maps.MapTypeId.ROADMAP,
      window.google.maps.MapTypeId.SATELLITE,
      window.google.maps.MapTypeId.TERRAIN,
      window.google.maps.MapTypeId.HYBRID,
    ],
  };

  return (
    <APIProvider
      apiKey={firebaseConfig.apiKey}
      onLoad={() => {
        console.log("Maps API has loaded.");
        setIsMapLoaded(true);
      }}
    >
      {isMapLoaded && (
        <Container fluid>
          <Row>
            <Col
              className="p-0 map-and-list-container"
              style={{ width: "100%", height: mapHeight }}
            >
              <Map
                className="map-container"
                defaultZoom={10.9}
                defaultCenter={seattleCoordinates}
                mapId={"c8d48b060a22a457"}
                onCameraChanged={(ev: MapCameraChangedEvent) =>
                  console.log(
                    "camera changed:",
                    ev.detail.center,
                    "zoom:",
                    ev.detail.zoom
                  )
                }
                mapTypeControl={true}
                mapTypeControlOptions={mapTypeControlOptions}
              >
                <AllMarkers
                  buildingsToMap={resultBuildingsUnsorted}
                  shouldScroll={shouldScroll}
                  savedBuildings={savedBuildings}
                  setSelectedBuildingId={setSelectedBuildingId}
                  selectedBuildingId={selectedBuildingId}
                />
              </Map>
            </Col>
          </Row>
        </Container>
      )}
    </APIProvider>
  );
};

export default ReactMap;
