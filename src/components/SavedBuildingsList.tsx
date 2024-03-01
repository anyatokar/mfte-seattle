import "firebase/firestore";
import { BuildingCard } from "./BuildingCard";
import ISavedBuilding from "../interfaces/ISavedBuilding";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

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
