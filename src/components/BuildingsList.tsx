import { areListingsOn } from "../config/config";
import { listingStatusEnum, pageTypeEnum } from "../types/enumTypes";
import BuildingCard from "./BuildingCard";

import IBuilding from "../interfaces/IBuilding";
import IListing from "../interfaces/IListing";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

type AllBuildingsListProps = {
  isLoading: boolean;
  resultBuildingsUnsorted: IBuilding[];
  pageType: pageTypeEnum;
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
                lg={areListingsOn ? 6 : 4}
                xl={areListingsOn ? 6 : 3}
                className="p-1"
              >
                <BuildingCard building={building} />
              </Col>
            ))}
          </>
        )}
      </Row>
    </Container>
  );
};

export default AllBuildingsList;
