import { useState } from "react";
import "firebase/firestore";
import { BuildingCard } from "./BuildingCard";
import { Container, Row, Col } from "react-bootstrap";
import IBuilding from "../interfaces/IBuilding";
import Sorters from "../components/Sorters";
import ISorter from "../interfaces/ISorter";
import { genericSort } from "../utils/genericSort";
import ISavedBuilding from "../interfaces/ISavedBuilding";

type allBuildingsListProps = {
  resultBuildingsUnsorted: IBuilding[];
  savedBuildings: ISavedBuilding[];
};

export const checkIsSaved = (
  savedBuildings: ISavedBuilding[],
  building: IBuilding
) => {
  return !!savedBuildings.find(
    (savedBuilding: IBuilding) =>
      savedBuilding.buildingID === building.buildingID
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
                    lg={4}
                    xl={3}
                    xxl={1}
                    className="building-row"
                  >
                    <BuildingCard
                      {...building}
                      isSaved={checkIsSaved(props.savedBuildings, building)}
                      pageType={"allBuildings"}
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
