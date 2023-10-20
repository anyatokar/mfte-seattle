import 'firebase/firestore';
import { SavedHomesCard } from "./SavedHomesCard";
import { Container, Row, Col } from 'react-bootstrap';
import ISavedBuilding from '../interfaces/ISavedBuilding';

type SavedHomesListProps = {
  savedBuildings: Array<ISavedBuilding>
};

export default function SavedHomesList(props: SavedHomesListProps) {

  return (
    <Container>
      <Row className="show-grid">
        <Col lg={12}>
          <Row className="show-grid">
            {props.savedBuildings?.length !== 0 && (
            <>
              {props.savedBuildings?.map((building: ISavedBuilding) => (
                <Col key={building.buildingID} md={4} className="building-row">
                  <SavedHomesCard {...building} />
                </Col>
              ))}
            </>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
