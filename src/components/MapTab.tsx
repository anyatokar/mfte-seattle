import "firebase/firestore";
import { ReactMap } from "../map/ReactMap";
import IMap from "../interfaces/IMap";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default function MapTab(props: IMap) {
  return (
    <Container fluid>
      <Row>
        <Col className="p-0">
          <ReactMap
            buildingsToMap={props.buildingsToMap}
            savedBuildings={props.savedBuildings}
          />
        </Col>
      </Row>
    </Container>
  );
}
