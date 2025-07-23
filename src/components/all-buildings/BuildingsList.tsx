import { MutableRefObject, useRef } from "react";
import BuildingCard from "./BuildingCard";
import { willShowAvailTable } from "../../utils/generalUtils";
import IBuilding from "../../interfaces/IBuilding";
import ISavedBuilding from "../../interfaces/ISavedBuilding";
import { BuildingCardEnum } from "../../types/enumTypes";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

type AllBuildingsListProps = {
  isLoading: boolean;
  resultBuildingsUnsorted: IBuilding[];
  savedBuildings: ISavedBuilding[];
  shouldScroll: MutableRefObject<boolean>;
  setSelectedBuildingId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedBuildingId: string | null;
};

export const getSavedData = (
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
  setSelectedBuildingId,
  selectedBuildingId,
}) => {
  const buildingRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
                ref={(el: HTMLDivElement | null) => {
                  buildingRefs.current[building.buildingID] = el;
                }}
                sm={willShowAvailTable(building.listing) ? 12 : 6}
                // Split screen starts at md
                className="p-1"
              >
                <BuildingCard
                  isSelected={selectedBuildingId === building.buildingID}
                  setSelectedBuildingId={setSelectedBuildingId}
                  building={building}
                  savedHomeData={getSavedData(savedBuildings, building)}
                  shouldScroll={shouldScroll}
                  parentComponent={BuildingCardEnum.BUILDING_LIST}
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
