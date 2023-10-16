import { ReactMap } from "../Map/ReactMap";
import 'firebase/firestore';
import { Col, Container, Row } from 'react-bootstrap';

export default function SavedHomesMap(props:any) {
  return (
    <Container>
      <Row>
        <Col className="p-0">
          <ReactMap
            filteredBuildings={props.savedBuildings}
          />
        </Col>
      </Row>
    </Container>
  );
}
