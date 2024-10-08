import { areListingsOn } from "../config/config";
import { pageTypeEnum } from "../types/enumTypes";

import BuildingCard from "./BuildingCard";

import { genericSort } from "../utils/genericSort";

import IBuilding from "../interfaces/IBuilding";
import ISavedBuilding from "../interfaces/ISavedBuilding";
import ISorter from "../interfaces/ISorter";
import IListing from "../interfaces/IListing";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

type allBuildingsListProps = {
  resultBuildingsUnsorted: IBuilding[];
  savedBuildings: ISavedBuilding[];
  allListings: IListing[] | [];
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
  return allListings.find(
    (listing: IListing) => listing.buildingID === buildingID
  );
};

const AllBuildingsList: React.FC<allBuildingsListProps> = ({
  resultBuildingsUnsorted,
  savedBuildings,
  pageType,
  allListings,
}) => {
  if (!resultBuildingsUnsorted) {
    return null;
  }

  const activeSorter: ISorter<IBuilding> = {
    property: "buildingName",
    isDescending: false,
  };

  const resultBuildings = resultBuildingsUnsorted.sort(
    (buildingA: IBuilding, buildingB: IBuilding) => {
      // Check if each building has an approved listing in allListings
      const hasListingA = allListings.some(
        (listing) =>
          listing.buildingID === buildingA.buildingID && listing.isApproved
      );
      const hasListingB = allListings.some(
        (listing) =>
          listing.buildingID === buildingB.buildingID && listing.isApproved
      );

      // Sort buildings with approved listings first
      if (hasListingA && !hasListingB) return -1;
      if (!hasListingA && hasListingB) return 1;

      // Use the genericSort function for sorting by the activeSorter
      return genericSort(buildingA, buildingB, activeSorter);
    }
  );

  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <Row>
            {resultBuildings.length > 0 && (
              <>
                {resultBuildings.map((building: IBuilding) => (
                  <Col
                    key={building.buildingID}
                    xs={12}
                    sm={6}
                    lg={areListingsOn ? 6 : 4}
                    xl={areListingsOn ? 4 : 3}
                    className="building-row"
                  >
                    <BuildingCard
                      building={building}
                      isSaved={checkIsSaved(savedBuildings, building)}
                      pageType={pageType}
                      listing={getListing(allListings, building.buildingID)}
                    />
                  </Col>
                ))}
              </>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AllBuildingsList;
