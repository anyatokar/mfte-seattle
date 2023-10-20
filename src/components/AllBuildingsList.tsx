import {useState} from 'react';
import 'firebase/firestore';
import { AllBuildingsCard } from "./AllBuildingsCard";
import { Container, Row, Col } from 'react-bootstrap';
import IBuilding from "../interfaces/IBuilding";
import Sorters from "../components/Sorters";
import ISorter from "../interfaces/ISorter";
import { genericSort } from "../utils/genericSort";
import ISavedBuilding from '../interfaces/ISavedBuilding';

type allBuildingsListProps = {
  resultBuildingsUnsorted: IBuilding[],
  savedBuildings: ISavedBuilding[]
};

export const checkIsSaved = (savedBuildings: ISavedBuilding[], building: IBuilding) => {
  return !!savedBuildings.find((savedBuilding: IBuilding) => savedBuilding.buildingID === building.buildingID);
}

export default function AllBuildingsList(props: allBuildingsListProps) {
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



  return (
    <Container fluid>
      <Row className="show-grid">
        <Col lg={6}>
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
                    <AllBuildingsCard {...building} isSaved={checkIsSaved(props.savedBuildings, building)} />
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
