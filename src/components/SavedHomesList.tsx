import 'firebase/firestore';
import { SavedHomesCard } from "./SavedHomesCard";
import { Container, Row, Col } from 'react-bootstrap';
import IBuilding from "../interfaces/IBuilding";
import { BuildingsListProps } from './AllBuildingsList';

export default function SavedHomesList(props:BuildingsListProps) {

  return (
    <>
      <Container>
        <Row className="show-grid">
          <Col lg={12}>
            <Row className="show-grid">
                {props.savedBuildings?.length && (
                  <>
                    {props.savedBuildings?.map((building:IBuilding) => (
                      <Col key={building.buildingID} md={4} className="building-row">
                        <SavedHomesCard {...building} />
                      </Col>
                    ))}
                  </>
                )}
                <div className="saved-homes-empty">
                  {props.savedBuildings?.length === 0 && <p>Use the Buildings tab to start adding to your list!</p>}
                </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
