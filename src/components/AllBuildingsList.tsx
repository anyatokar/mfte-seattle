import {useState} from 'react';
import 'firebase/firestore';
import { AllBuildingsCard } from "./AllBuildingsCard";
import { Container, Row, Col } from 'react-bootstrap';
import IBuilding from "../interfaces/IBuilding";
import Sorters from "../components/Sorters";
import ISorter from "../interfaces/ISorter";
import { genericSort } from "../utils/genericSort";

//TODO: Maybe move this type since it's used in SavedHomesCard component as well.
export type BuildingsListProps = {
  resultBuildingsUnsorted?: IBuilding[],
  savedBuildings?: IBuilding[]
};

export default function AllBuildingsList(props: BuildingsListProps) {
  const [activeSorter, setActiveSorter] = useState<ISorter<IBuilding>>({
    property: "buildingName",
    isDescending: false,
  });

  if (!props.resultBuildingsUnsorted) {
    return null;
  };

  const resultBuildings = props.resultBuildingsUnsorted.sort((buildingA: any, buildingB: any) =>
    genericSort<IBuilding>(buildingA, buildingB, activeSorter)
  );

  const checkIsSaved = (building: IBuilding) => {
    return !!props.savedBuildings?.find((savedBuilding: IBuilding) => savedBuilding.buildingID === building.buildingID);
  }

  return (
    <>
      <Container>
        <Row className="show-grid sort-bar">
          <Col lg={4}>
            {props.resultBuildingsUnsorted.length > 0 && <Sorters<IBuilding>
              object={props.resultBuildingsUnsorted[0]}
              onChangeSorter={(property, isDescending) => {
                setActiveSorter({
                  property,
                  isDescending,
                });
              }}
            />}
          </Col>
        </Row>
        <Row className="show-grid">
          <Col lg={12}>
            <Row className="show-grid">
                {resultBuildings.length > 0 && (
                  <>
                    {resultBuildings.map((building:IBuilding) => (
                      <Col key={building.buildingID} md={4} lg={3} className="building-row">
                        <AllBuildingsCard {...building} isSaved={checkIsSaved(building)} />
                      </Col>
                    ))}
                  </>
                )}
                {resultBuildings.length === 0 && <p>Try expanding your search criteria!</p>}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
