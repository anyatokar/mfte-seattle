import { useState } from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import AllMarkers from "./AllMarkers";
import { firebaseConfig } from "../db/firebase";
import IMap from "../interfaces/IMap";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const seattle = {
  lat: 47.608013,
  lng: -122.315,
};

const ReactMap: React.FC<IMap> = ({
  resultBuildingsUnsorted = [],
  savedBuildings,
  mapHeight,
  shouldScroll,
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <APIProvider
      apiKey={firebaseConfig.apiKey}
      onLoad={() => setIsMapLoaded(true)}
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
                defaultZoom={11}
                defaultCenter={seattle}
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
                mapTypeControlOptions={{
                  style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                  position: google.maps.ControlPosition.TOP_LEFT,
                  mapTypeIds: [
                    google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.SATELLITE,
                    google.maps.MapTypeId.TERRAIN,
                    google.maps.MapTypeId.HYBRID,
                  ],
                }}
              >
                <AllMarkers
                  buildingsToMap={resultBuildingsUnsorted}
                  shouldScroll={shouldScroll}
                  savedBuildings={savedBuildings}
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
