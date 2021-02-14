import React, {useState} from 'react';
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



  const resultBuildings = props.allBuildings.sort((buildingA: any, buildingB: any) =>
  genericSort<IBuilding>(buildingA, buildingB, activeSorter)
);

  return (
    <>
            <section className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              {/* <h3>Results:</h3> */}
              {props.allBuildings.length > 0 && <Sorters<IBuilding>
                object={props.allBuildings[0]}
                onChangeSorter={(property, isDescending) => {
                  setActiveSorter({
                    property,
                    isDescending,
                  });
                }}
              />}
            </div>
          </div>
        </section>
      <Container>
        <Row className="show-grid">
          <Col lg={12}>
            <Row className="show-grid">
                {resultBuildings.length > 0 && (
                  <>
                    {resultBuildings.map((building:any) => (
                      <Col md={4}  className="building-row">
                        <AllBuildingsCard key={building.buildingName} {...building} />
                      </Col>
                    ))}
                  </>
                )}
                {resultBuildings.length === 0 && <p>No results found!</p>}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}