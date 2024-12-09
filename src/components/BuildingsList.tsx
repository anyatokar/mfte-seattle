import { areListingsOn } from "../config/config";
import { listingStatusEnum, pageTypeEnum } from "../types/enumTypes";
import BuildingCard from "./BuildingCard";

import IBuilding from "../interfaces/IBuilding";
import IListing from "../interfaces/IListing";
import ISavedBuilding from "../interfaces/ISavedBuilding";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

type AllBuildingsListProps = {
  isLoading: boolean;
  resultBuildingsUnsorted: IBuilding[];
  savedBuildings: ISavedBuilding[];
  pageType: pageTypeEnum;
};

// TODO: For saved list, they're all going to be in the saved so this can be more efficient.
// Result of combining AllBuildingsList and SavedBuildingsList components.
export const checkIsSaved = (
  savedBuildings: ISavedBuilding[],
  building: IBuilding
) => {
  return !!savedBuildings.find(
    (savedBuilding: IBuilding) =>
      savedBuilding.buildingID === building.buildingID
  );
};

export const getListing = (
  allListings: IListing[],
  buildingID: IBuilding["buildingID"]
) => {
  // This finds the first active entry.
  return allListings.find(
    (listing: IListing) =>
      listing.buildingID === buildingID &&
      listing.listingStatus === listingStatusEnum.ACTIVE
  );
};

const AllBuildingsList: React.FC<AllBuildingsListProps> = ({
  isLoading,
  resultBuildingsUnsorted,
  savedBuildings,
  pageType,
}) => {
  if (!resultBuildingsUnsorted) {
    return null;
  }

  return (
    <Container fluid>
      {/* result count */}
      <Row>
        <Col>
          {!isLoading && pageType === pageTypeEnum.allBuildings && (
            <p className="mb-0">
              {resultBuildingsUnsorted.length > 0
                ? `${resultBuildingsUnsorted.length} buildings found`
                : "No buildings found"}
            </p>
          )}
          {isLoading && (
            <div>
              <Spinner animation="border" variant="warning" />
              <span>Loading buildings list</span>
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
                lg={areListingsOn ? 6 : 4}
                xl={areListingsOn ? 6 : 3}
                className="p-1"
              >
                <BuildingCard
                  building={building}
                  isSaved={checkIsSaved(savedBuildings, building)}
                  pageType={pageType}
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
