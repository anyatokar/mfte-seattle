import { ReactMap } from "../map/ReactMap";
import "firebase/firestore";
import { Col, Container, Row } from "react-bootstrap";
import IMap from "../interfaces/IMap";

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
