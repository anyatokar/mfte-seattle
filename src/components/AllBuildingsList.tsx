import React from 'react';
import 'firebase/firestore';
import { AllBuildingsCard } from "./AllBuildingsCard";
import { Container, Row, Col } from 'react-bootstrap';

export default function SavedHomesList(props:any) {

  return (
    <>
      <Container>
        <Row className="show-grid">
          <Col lg={12}>
            <Row className="show-grid">
                {props.resultBuildings.length > 0 && (
                  <>
                    {props.resultBuildings.map((building:any) => (
                      <Col md={4}  className="building-row">
                        <AllBuildingsCard key={building.buildingName} {...building} />
                      </Col>
                    ))}
                  </>
                )}
                {props.resultBuildings.length === 0 && <p>No results found!</p>}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}