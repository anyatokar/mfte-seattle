import 'firebase/firestore';
import { BuildingCard } from "./BuildingCard";
import { Container, Row, Col } from 'react-bootstrap';
import ISavedBuilding from '../interfaces/ISavedBuilding';

type SavedHomesListProps = {
  savedBuildings: Array<ISavedBuilding>
};

export default function SavedHomesList(props: SavedHomesListProps) {

  return (
    <Container fluid>
      <Row className="show-grid">
        <Col lg={12}>
          <Row className="show-grid">
            {props.savedBuildings?.length !== 0 && (
            <>
              {props.savedBuildings?.map((building: ISavedBuilding) => (
                <Col key={building.buildingID} xs={12} sm={6} lg={4} xl={3} xxl={1} className="building-row">
                  <BuildingCard {...building} pageType="savedHomes" />
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
