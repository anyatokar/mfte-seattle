import "firebase/firestore";
import ReactMap from "../map/ReactMap";
import IMap from "../interfaces/IMap";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const MapTab: React.FC<IMap> = ({buildingsToMap, savedBuildings, allListings}) => {
  return (
    <Container fluid>
      <Row>
        <Col className="p-0">
          <ReactMap
            buildingsToMap={buildingsToMap}
            savedBuildings={savedBuildings}
            allListings={allListings}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default MapTab;
