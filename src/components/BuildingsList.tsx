import { MutableRefObject } from "react";
import BuildingCard from "./BuildingCard";

import IBuilding from "../interfaces/IBuilding";
import ISavedBuilding from "../interfaces/ISavedBuilding";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

type AllBuildingsListProps = {
  isLoading: boolean;
  resultBuildingsUnsorted: IBuilding[];
  savedBuildings: ISavedBuilding[];
  shouldScroll: MutableRefObject<boolean>;
};

export const checkIsSaved = (
  savedBuildings: ISavedBuilding[],
  building: IBuilding
): ISavedBuilding | undefined => {
  return savedBuildings.find(
    (savedBuilding) => savedBuilding.buildingID === building.buildingID
  );
};

const AllBuildingsList: React.FC<AllBuildingsListProps> = ({
  isLoading,
  resultBuildingsUnsorted,
  savedBuildings,
  shouldScroll,
}) => {
  if (!resultBuildingsUnsorted) {
    return null;
  }

  return (
    <Container fluid>
      {/* result count */}
      <Row>
        <Col>
          {!isLoading && (
            <p className="mb-0">
              {resultBuildingsUnsorted.length > 0
                ? `${resultBuildingsUnsorted.length} buildings found`
                : "No buildings found"}
            </p>
          )}
          {isLoading && (
            <div className="d-flex align-items-center">
              <Spinner animation="border" variant="secondary" role="status" />
              <span className="text-muted ms-2">Loading buildings</span>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        {!isLoading && resultBuildingsUnsorted.length > 0 && (
          <>
            {resultBuildingsUnsorted.map((building: IBuilding) => (
              <Col
                key={building.buildingID}
                xs={12}
                sm={6}
                // Split screen starts at md
                md={12}
                lg={6}
                className="p-1"
              >
                <BuildingCard
                  building={building}
                  savedHomeData={checkIsSaved(savedBuildings, building)}
                  shouldScroll={shouldScroll}
                />
              </Col>
            ))}
          </>
        )}
      </Row>
    </Container>
  );
};

export default AllBuildingsList;
