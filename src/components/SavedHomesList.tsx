import React from 'react';
import 'firebase/firestore';
import { SavedHomesCard } from "./SavedHomesCard";
import { Container, Row, Col } from 'react-bootstrap';

export default function SavedHomesList(props:any) {

  return (
    <>
      <Container>
        <Row className="show-grid">
          <Col lg={12}>
            <Row className="show-grid">
                {props.savedBuildings.length > 0 && (
                  <>
                    {props.savedBuildings.map((building:any) => (
                      <Col md={4} className="building-row">
                        <SavedHomesCard key={building.buildingID} {...building} />
                      </Col>
                    ))}
                  </>
                )}
                <div className="saved-homes-empty">
                  {props.savedBuildings.length === 0 && <p>Use the buildings tab to start adding to your list!</p>}
                </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}