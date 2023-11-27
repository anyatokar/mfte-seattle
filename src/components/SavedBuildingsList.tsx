import "firebase/firestore";
import { BuildingCard } from "./BuildingCard";
import { Container, Row, Col } from "react-bootstrap";
import ISavedBuilding from "../interfaces/ISavedBuilding";

type SavedBuildingsListProps = {
  savedBuildings: Array<ISavedBuilding>;
};

export default function SavedBuildingsList(props: SavedBuildingsListProps) {
  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <Row>
            {props.savedBuildings?.length !== 0 && (
              <>
                {props.savedBuildings?.map((building: ISavedBuilding) => (
                  <Col
                    key={building.buildingID}
                    xs={12}
                    sm={6}
                    lg={4}
                    xl={3}
                    xxl={1}
                    className="building-row"
                  >
                    <BuildingCard {...building} pageType="savedBuildings" />
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
