import {useState} from 'react';
import 'firebase/firestore';
import { AllBuildingsCard } from "./AllBuildingsCard";
import { Container, Row, Col } from 'react-bootstrap';
import IBuilding from "../interfaces/IBuilding";
import Sorters from "../components/Sorters";
import ISorter from "../interfaces/ISorter";
import { genericSort } from "../utils/genericSort";

export default function SavedHomesList(props:any) {
  const [activeSorter, setActiveSorter] = useState<ISorter<IBuilding>>({
    property: "buildingName",
    isDescending: false,
  });

  const resultBuildings = props.resultBuildingsUnsorted.sort((buildingA: any, buildingB: any) =>
  genericSort<IBuilding>(buildingA, buildingB, activeSorter)
);

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
                    {resultBuildings.map((building:any) => (
                      <Col md={4} lg={3} className="building-row">
                        <AllBuildingsCard key={building.buildingID} {...building} />
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