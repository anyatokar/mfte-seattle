import { useState } from "react";

import { areListingsOn } from "../config/config";
import { pageTypeEnum } from "../types/enumTypes";

import { BuildingCard } from "./BuildingCard";
import Sorters from "./Sorters";

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

export default function AllBuildingsList(props: allBuildingsListProps) {
  const [activeSorter, setActiveSorter] = useState<ISorter<IBuilding>>({
    property: "buildingName",
    isDescending: false,
  });

  if (!props.resultBuildingsUnsorted) {
    return null;
  }

  const resultBuildings = props.resultBuildingsUnsorted.sort(
    (buildingA: any, buildingB: any) =>
      genericSort<IBuilding>(buildingA, buildingB, activeSorter)
  );

  return (
    <Container fluid>
      {props.pageType === pageTypeEnum.allBuildings && (
        <Row>
          <Col
            sm={12}
            md={{ span: 9, offset: 1 }}
            lg={{ span: 8, offset: 0 }}
            className="p-0"
          >
            {props.resultBuildingsUnsorted.length > 0 && (
              <Sorters<IBuilding>
                object={props.resultBuildingsUnsorted[0]}
                onChangeSorter={(property, isDescending) => {
                  setActiveSorter({
                    property,
                    isDescending,
                  });
                }}
              />
            )}
          </Col>
        </Row>
      )}
      <Row>
        <Col lg={12}>
          <Row>
            {resultBuildings.length > 0 && (
              <>
                {resultBuildings.map((building: IBuilding) => (
                  <Col
                    key={building.buildingID}
                    xs={12}
                    sm={areListingsOn ? 12 : 6}
                    lg={areListingsOn ? 6 : 4}
                    xl={areListingsOn ? 4 : 3}
                    className="building-row"
                  >
                    <BuildingCard
                      {...building}
                      isSaved={checkIsSaved(props.savedBuildings, building)}
                      pageType={props.pageType}
                      listing={getListing(
                        props.allListings,
                        building.buildingID
                      )}
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
}
